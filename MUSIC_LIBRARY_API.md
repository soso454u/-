# Selene 音乐库公开协议 v2

适用播放器版本：**2.10.108+**。供独立的 Selene 小手机音乐 App 对接，不依赖小手机代码。

## 连接与兼容

接口仍挂在实际同源酒馆页面的 `ROOT.__SELENE_MUSIC_PLAYER__`。iframe 中应向上寻找可访问的同源父窗口。连接后先注册事件，再调用 `getCapabilities()` 和所需的分页读取方法建立初始状态。

```js
let ROOT = window;
try { while (ROOT.parent !== ROOT && ROOT.parent.document) ROOT = ROOT.parent; } catch {}
const player = () => ROOT.__SELENE_MUSIC_PLAYER__;
const onLibrary = event => {
  const state = event.detail;
  if (!state.available) return; // 卸载时清空界面；重载后重新握手、读取列表。
  // 按 state.changed 重新读取可见页，不必读取整个音乐库。
};
ROOT.addEventListener('selene-music-library-state', onLibrary);
const capabilities = player()?.getCapabilities();
const favorites = player()?.getMusicLibrary({ kind: 'favorites', offset: 0, limit: 30 });
// 小手机自身卸载时：
// ROOT.removeEventListener('selene-music-library-state', onLibrary);
```

播放器不存在时 `player()` 为 undefined，须使用可选链。每次控制都重新读取当前公开对象，勿长期保存旧实例。旧实例卸载后新方法返回 `UNLOADED`。

**旧协议保持不变**：`getPlaybackState()` 仍返回 `protocolVersion: 1` 的原结构；`play/pause/togglePlayback/previousTrack/nextTrack/seekTo`、原设置方法、`selene-music-playback-state` 和 `selene-music-player-state` 的字段与行为不变。新音乐库方法及事件使用 `protocolVersion: 2`。

## 通用返回值

除 `searchMusic()` 返回 Promise 外，新方法均同步返回普通对象。业务错误通过 `ok: false` 返回，不把请求、音频或内部异常对象传出。

```js
// 成功：方法字段直接放在通用字段之后，没有额外 data 层。
{
  protocolVersion: 2,
  instanceId: '当前播放器实例标识',
  loaded: true,
  available: true,
  revision: 0,
  ok: true,
  // ...下文各方法的字段
}
// 失败
{
  protocolVersion: 2,
  instanceId: '当前播放器实例标识',
  loaded: true,           // 卸载时为 false
  available: true,        // 卸载时为 false
  revision: 0,
  ok: false,
  error: { code: 'NOT_FOUND', message: '歌曲已移出列表，请重新读取' }
}
```

`revision` 为实例内单调递增的音乐库变更序号，重载后重新开始。引用、数组和元数据均为副本；修改返回值不会修改播放器。不要直接写播放器的 localStorage、IndexedDB 或配置。

### Track / TrackRef

```js
{
  trackId: 'track-1',
  trackRef: {
    instanceId: '当前播放器实例标识',
    kind: 'favorites', // favorites | playlist | queue | search | current
    trackId: 'track-1',
    // playlistId: '真实歌单 ID', // kind=playlist 时提供
    // searchId: 'search-1',      // kind=search 时提供
  },
  title: '歌曲标题',
  artist: '歌手',
  album: '专辑',
  artwork: '歌曲已有封面地址', // 未设置时为空字符串，不额外找封面
  duration: 180,             // 秒；未知为 0
  source: 'netease',         // 原播放器的来源标记，如 joox/tencent/direct
  favorite: false,
  playable: true            // 视频条目为 false，音乐控制接口会拒绝播放
}
```

`trackId` 是播放器对内部歌曲对象分配的不透明标识，在本实例内跨分页、排序及该对象的音源/元数据更新保持稳定。队列构建会按原逻辑复制歌曲，同一录音在不同列表中可能有不同的 `trackId`。它不等同于 v1 播放快照的原始平台 `trackId`；关联音乐库与当前歌曲时使用 `getQueueState()` 的 `currentTrackId` 和 `currentTrack`。

`trackRef` 必须原样传回。解析时检查实例、列表和歌曲是否仍存在；不会采用调用方附加的 URL 或歌曲元数据。不要自行拼接标识。删除歌曲/歌单、搜索结果过期或播放器重载后，应重新读取。列表引用失效后，仍可从其他实际包含该歌曲的列表取得新引用。`current` 引用仅在该对象仍为当前歌曲时有效。

返回中不包含原始音频直链、临时音源、播放器配置、API 密钥、请求对象或音频对象。直链歌曲只能使用播放器中已存在的条目，不能从此协议导入任意 URL。

### 分页

所有分页采用 `offset`（默认 0，非负整数）与 `limit`（默认 30，整数 1–100）。返回：

```js
{ offset: 0, limit: 30, total: 120, nextOffset: 30, items: [/* 本页数据 */] }
```

最后一页或越界页的 `nextOffset` 为 null，越界页 `items` 为空。分页限制只限制返回数据，不裁剪播放器本身的音乐库或队列。

## 固定接口

### getCapabilities()

返回通用成功字段及：

```js
{
  playbackProtocolVersion: 1,
  capabilities: {
    getMusicLibrary: true, getQueueState: true,
    searchMusic: true, cancelMusicSearch: true,
    playTrack: true, playPlaylist: true,
    addToQueue: true, toggleFavorite: true,
    getLyricsState: true, // 以下可选能力自播放器 2.10.110 起提供
    getPlayMode: true, setPlayMode: true,
    getPlaybackSources: true, setPlaybackSource: true, setS01SQuality: true
  },
  searchModes: ['gd', 'other'],
  maxPageSize: 100,
  searchResultTtlMs: 300000,
  maxSearchSessions: 8,
  maxConcurrentSearches: 4
}
```

首次调用任一新接口会建立音乐库变更快照并启用后续变更通知。仅使用旧播放接口时，不扫描音乐库；没有小手机或其他新接口消费者时，不增加音乐库轮询或后台搜索。初始化及卸载的可用性事件始终广播。

### getMusicLibrary(options = {})

| options | 返回的 items | 其他返回字段 |
| --- | --- | --- |
| `{kind:'favorites', offset?, limit?}`，默认 kind | 收藏的 Track | `kind`、`playlist` |
| `{kind:'playlists', offset?, limit?}` | 用户歌单摘要 | `kind` |
| `{kind:'playlist', playlistId, offset?, limit?}` | 指定歌单中的 Track | `kind`、`playlist` |

歌单摘要：`{playlistId, name, trackCount, isFavorites:false}`。

`playlist`：`{playlistId, name, trackCount, isFavorites}`。收藏保留 ID `selene-favorites`，可作为 `playlistId` 读取或播放；用户歌单列表不重复包含收藏歌单。空收藏/空歌单返回成功的空页，不进行网络请求。

### getQueueState(options = {})

options 支持上述分页字段。返回分页字段及：

```js
{
  queueIndex: 1,             // 当前歌曲在完整队列内的索引，非页内索引；不在队列时为 -1
  currentTrackId: 'track-9', // 当前歌曲的不透明 ID，无当前歌曲时为 ''
  currentTrack: {/* Track，trackRef.kind='current' */}, // 无当前歌曲时为 null
  items: [/* Track 另附 index 字段，表示其在完整队列内的索引 */]
}
```

暂停时仍保留选中歌曲及索引。队列歌曲重复时，每个真实队列对象有自己的引用，按准确条目播放，不靠标题猜测索引。

### searchMusic(query, options = {}) → Promise

query：去除首尾空白后为 1–200 字符的字符串。

| options 字段 | 语义 |
| --- | --- |
| `mode` | `gd` 或 `other`；默认使用播放器当前搜索入口。B站入口返回 `UNSUPPORTED_SEARCH` |
| `source` | `gd` 下为 `auto/netease/joox`，默认使用原搜索源偏好；`other` 下为 `tencent/auto`，默认 tencent |
| `channel` | 长度 1–64 的字符串，默认 `default`。同 channel 的新网络搜索立即替代旧请求，不影响其他 channel |
| `signal` | 可选 AbortSignal，包括同源 iframe 创建的信号 |
| `offset/limit` | 同上述分页 |
| `searchId` | 读取已完成搜索的下一页；须传相同 query，不重新请求音乐服务 |

成功返回通用及分页字段，加：

```js
{ searchId: 'search-1', expiresAt: 1790000000000, query: '关键词', mode: 'gd', source: 'auto', items: [/* Track，kind=search */] }
```

`expiresAt` 为过期时刻的 Unix 毫秒值。结果保存 5 分钟，最多保留 8 组，超过后先移除最旧结果。分页不会续期，过期项在访问或新搜索时清理，不增加清理定时器；引用过期后返回 `EXPIRED_SEARCH`。最多同时 4 个请求，超过返回 `BUSY`。

搜索只调用原 `searchSource/searchMetingSource/querySongHits/rankSearchResults` 等底层函数，沿用原来源、匹配、排序、缓存、限流与超时。手动搜索沿用原来的宽泛候选行为，不承诺自动选中精确录音。不会调用操作界面的 `search()`，不会覆盖播放器的 `results`、列表、搜索请求序号，不会自动播放、加载搜索封面或改变收藏/队列。

取消采用逻辑取消：立即返回 `CANCELED` 或 `STALE_SEARCH`，过期响应不能写入搜索会话，也不继续后续搜索源。已发出的底层请求可能按原超时结束并进入原共享缓存；不强行中断可能被正常播放器共用的请求。搜索失败返回经过整理的 `SEARCH_FAILED`；限流时可能附带顶层 `retryAt`（Unix 毫秒），不传出底层请求详情。

```js
const controller = new AbortController();
const request = player().searchMusic('歌曲 歌手', {
  mode: 'gd', channel: 'phone-music', signal: controller.signal, limit: 20
});
// 离开页面或用户取消时：controller.abort();
const found = await request;
if (found.ok && found.nextOffset !== null) {
  const next = await player().searchMusic(found.query, {
    searchId: found.searchId, offset: found.nextOffset, limit: 20
  });
}
```

### cancelMusicSearch(channel = 'default')

取消该 channel 正在进行的搜索。返回通用字段及 `{canceled:true/false}`。不删除已完成的搜索会话，不影响播放。

### playTrack(trackRef)

通过内部引用解析真实歌曲：收藏/歌单条目复用 `playPlaylistAt`，从该条目开始构建并播放整张原列表；队列条目选中准确索引；搜索结果和当前歌曲复用 `playListEntry/play`，不替换队列。音源仍由原状态机解析和回退。

成功返回 `{accepted:true, trackId, queueIndex}` 及通用字段。`trackId` 为实际选中对象的 v2 ID。命令接受不表示网络音源已经开始播放，请继续消费原 `selene-music-playback-state`。音源设置使原播放器拒绝启动时返回 `PLAYBACK_NOT_STARTED`；若原歌单队列已构建，则保留原队列行为。

### playPlaylist(playlistId, options = {})

playlistId 是真实用户歌单 ID 或 `selene-favorites`。options 可指定 `startIndex`（完整歌单内的零基索引，默认 0）或 `startTrackId`（该歌单读取到的 v2 trackId），二者互斥。复用原 `playPlaylistAt`，队列包含原歌单所有条目，之后按原播放模式续播；视频作为原队列条目保留，但不能作为此接口的起播歌曲。

返回同 `playTrack`。空歌单返回 `EMPTY_PLAYLIST`，不存在的起始歌曲返回 `NOT_FOUND`。

### addToQueue(trackRef)

复用原 `queuePlaylistSongs([song])`、去重、队列计数与队列持久化；去重规则与原歌单入队一致。不会自动开始播放。

返回通用字段及 `{added:true/false, total:完整队列长度}`。重复歌曲返回成功、`added:false`。

### toggleFavorite(trackRef)

复用原 `favorite()`，统一修改播放器真实收藏、更新原收藏显示并调用原保存机制。返回通用字段及 `{trackId, favorite:true/false}`。浏览器存储失败仍按原播放器规则提示并保留本次会话数据，成功返回不额外保证已落盘。

## 变更事件

事件：**`selene-music-library-state`**，由同源 ROOT 使用 `new ROOT.CustomEvent(name,{detail})` 广播。

```js
{
  protocolVersion: 2, instanceId: '实例标识',
  loaded: true, available: true, revision: 3, ok: true,
  changed: ['favorites'], // favorites | playlists | queue | availability，可同时出现多个
  counts: { favorites: 20, playlists: 4, queue: 12 }
}
```

初始化：`changed:['availability']`、revision=0。完成握手后，原界面或公开方法实际修改收藏、歌单、队列、相关可见歌曲元数据/队列选中索引时广播；同一轮同步变更合并并去重。仅更改主题、角色聊天等设置不会产生音乐库事件。不包含完整列表，不随播放进度高频广播。客户端在收到变更后只刷新当前可见页。

卸载前：`loaded=false、available=false`，`changed:['availability']`，取消所有新接口的在途搜索并清空搜索缓存；原播放事件仍独立广播其终止快照。扩展热重载或脚本重启后有新 `instanceId`，全部旧引用失效，客户端须重新握手和读取当前页。

## 错误码

| code | 含义 |
| --- | --- |
| `UNLOADED` | 播放器未就绪或旧实例已卸载 |
| `INVALID_OPTIONS` / `INVALID_QUERY` | 参数类型、分页范围或关键词不符合协议 |
| `INVALID_REF` / `STALE_REF` | 引用格式错误 / 引用来自其他实例 |
| `NOT_FOUND` | 列表、歌曲或起始歌曲已不存在 |
| `EMPTY_PLAYLIST` | 歌单无歌曲 |
| `UNSUPPORTED_TRACK` | 引用是视频条目 |
| `PLAYBACK_NOT_STARTED` | 原播放入口未启动所选歌曲 |
| `UNSUPPORTED_SEARCH` | 搜索入口或来源不受此接口支持 |
| `CANCELED` / `STALE_SEARCH` | 主动取消 / 同 channel 的新搜索替代旧请求 |
| `EXPIRED_SEARCH` | 搜索会话已过期、被淘汰或不存在 |
| `BUSY` | 超过最多 4 个并发搜索 |
| `SEARCH_FAILED` | 原搜索服务失败；稍后重试或按 retryAt 等待 |

## 可选歌词协议 v1（2.10.110+）

`ROOT.__SELENE_MUSIC_PLAYER__.getLyricsState()` 同步返回当前歌词的独立副本，不发起歌词请求：

```js
{
  protocolVersion: 1, loaded: true,
  trackId: 'netease:123', revision: 3,
  status: 'ready', message: '',
  lines: [{
    time: 12.5,
    lines: ['歌词原文', '对应翻译'],
    wordTimes: [{text: '歌词片段', start: 12.5, end: 13.2}]
  }]
}
```

`trackId` 与 v1 `getPlaybackState().trackId` 一致，区别于音乐库 v2 的 `track-N` 引用。`revision` 是当前播放器实例内递增的歌词变更序号，重载后重新开始。时间单位均为秒；`lines` 完整保留现有合并后的多行原文、翻译及空白间奏行，不取自显示层。

只有原歌词包含真实逐字时间信息时才提供 `wordTimes`。普通 LRC 不生成逐字时间。Enhanced LRC 的末段没有结束标签时沿用原数据的 `end: null`，表示结束时间未知；不使用悬浮歌词的估算时间冒充真实时间。

| status | 含义及 message 示例 |
| --- | --- |
| `idle` | 尚未播放、恢复待播放、播放状态重置；保留原提示 |
| `loading` | `正在准备播放…` 或 `加载歌词…` |
| `ready` | 有真实时间轴，通常 message 为空 |
| `instrumental` | `纯音乐 · 请欣赏` |
| `unavailable` | `暂无歌词`、`MP3 直链歌曲` 等当前不提供歌词的情况 |
| `error` | `歌词请求限流，请稍后再试` 或 `歌词暂时加载失败` |

非 `ready` 状态的 `lines` 为 `[]`。切歌、重新加载及重置时同步清空旧歌词；旧歌曲、旧 `playRequest`、已变更音源的异步结果不能覆盖当前歌词。

ROOT 事件 **`selene-music-lyrics-state`** 的 detail 仅包含上述 `protocolVersion / loaded / trackId / revision / status / message`，不携带完整时间轴。初始化、切歌、开始加载、完成、失败、状态重置、卸载时通知；歌词高亮和 `timeupdate` 不发此事件。卸载时发送 `loaded:false、trackId:''、status:'idle'、message:''`，旧句柄再读取也返回空歌词。

客户端先注册事件，再读取快照。事件到达时重新获取公开对象和歌词；逐句高亮使用 v1 播放时间查找最后一条 `line.time <= currentTime` 的歌词。

```js
const readLyrics = () => {
  const state = ROOT.__SELENE_MUSIC_PLAYER__?.getLyricsState?.();
  // 无对象、loaded=false 或非 ready 时清空旧歌词；否则使用 state.lines。
};
ROOT.addEventListener('selene-music-lyrics-state', readLyrics);
readLyrics();
// 小手机卸载时 removeEventListener；热重载后重新读取 capabilities 和初始状态。
```

## 可选播放模式和播放源控制（2.10.110+）

这些方法追加在同一个公开对象上。先按 `getCapabilities().capabilities` 检测各方法，旧播放器可能没有这些能力。

### getPlayMode() / setPlayMode(mode)

均同步返回 `{ok:true, mode}`。`mode` 只接受 `loop`（顺序循环）、`one`（单曲循环）、`shuffle`（随机播放）。设置复用 `settings.playMode / updatePlayMode() / save()`，原播放器和小手机共享同一个值，不立即切歌。

失败返回 `{ok:false, mode:当前模式, error:{code,message}}`；错误码为 `INVALID_MODE` 或 `UNLOADED`。不会保存无效值。

### getPlaybackSources()

同步返回当前歌曲可选音源、当前偏好、已确认播放的实际来源，以及可选 S01S 音质的独立副本：

```js
{
  ok: true, trackId: 'netease:123',
  selected: 'auto', actualSource: 'JOOX',
  options: [
    {id:'auto', label:'自动回退', available:true},
    {id:'netease', label:'网易云', available:true},
    {id:'joox', label:'JOOX', available:true},
    {id:'lx-tencent', label:'S01S · QQ', available:true}
  ],
  quality: 'auto',
  qualityOptions: [
    {id:'auto', label:'默认'}, {id:'standard', label:'标准'},
    {id:'hq', label:'高音质'}, {id:'sq', label:'SQ 无损'}, {id:'pq', label:'PQ'}
  ]
}
```

`options` 来自当前配置和原播放源面板共享的选项生成函数；GD 项读取 `GD_SOURCES`。禁用 S01S 后不提供 `lx-tencent`，`qualityOptions=[]`。音质项读取实际 `S01S_QUALITIES`，客户端使用返回的 id，不硬编码。

`selected` 是本曲音源偏好，来自 `playbackSourceChoice()`；`actualSource` 是原 `playbackLabel()` 对应的显示名称，例如 `JOOX`、`网易云`、`离线缓存`、`手动音源`、`S01S · QQ · SQ 无损`。它不是可传入 setter 的 id。尚未验证播放、切歌解析中或卸载时为空字符串，暂停保留已确认的来源。离线缓存、手动音源和自动回退仍按原规则优先，实际来源可能不同于所选偏好。

无歌曲、停用或不支持切源时返回同结构及 `ok:false,error:{code,message}`，`options=[]、qualityOptions=[]`。

### setPlaybackSource(source) / setS01SQuality(quality)

均返回 Promise，完成后返回与 `getPlaybackSources()` 相同的结构；失败有 `ok:false,error:{code,message}`。

- `setPlaybackSource(source)` 接受当前 `options` 中 `available:true` 的 id。与面板使用同一个切源函数，更新本曲 `playbackSources`；GD 选择清理对应旧 URL 响应缓存，并按原规则移除过期歌曲音频地址，再调用原 `play(song)` 重新解析和播放。保留搜索缓存、共享额度、离线/手动音源优先级、备用源及错误处理。
- `setS01SQuality(quality)` 接受当前 `qualityOptions` 的 id。与面板相同，先保存 `settings.s01sQuality`，然后选中本曲 `lx-tencent` 并立即重播。播放失败仍保留音质偏好；指定音质不可用继续原有回退，不保证实际来源一定为 S01S。

设置方法操作调用时的当前歌曲；解析期间被切歌、暂停或新请求替代，返回 `CANCELED`。卸载返回 `UNLOADED`。可能的其他错误码：`NO_TRACK`、`PLAYER_DISABLED`、`UNSUPPORTED_TRACK`（直链或视频）、`INVALID_SOURCE`、`SOURCE_UNAVAILABLE`（如 S01S 未启用）、`INVALID_QUALITY`、`PLAYBACK_NOT_STARTED`（包括浏览器拒绝授权）、`PLAYBACK_FAILED`。原播放器保留具体失败提示，接口不透传内部异常。

```js
const p = ROOT.__SELENE_MUSIC_PLAYER__;
p?.setPlayMode?.('shuffle');
const sources = p?.getPlaybackSources?.();
if (sources?.options.some(x => x.id === 'joox' && x.available)) {
  const result = await p.setPlaybackSource('joox');
  // 检查 result.ok；重播可能需要用户手势。
}
```

### 播放选项状态事件

ROOT 事件 **`selene-music-playback-options-state`**：

```js
{
  protocolVersion:1, loaded:true, trackId:'netease:123',
  playMode:'loop', selectedSource:'auto', actualSource:'JOOX', quality:'auto'
}
```

初始化、播放模式变化、切歌、音源/音质选择、实际来源确认或重置、S01S 配置变化及卸载时通知。原播放器按钮/设置与公开方法都能触发；相同状态去重，不随 `timeupdate` 或歌词高亮广播，也不携带音乐库。客户端收到事件后按需重新读取模式和选项。卸载时 `loaded:false、trackId:''、actualSource:''`；应清理歌曲选项并等待新实例。原播放、音乐库、歌词事件继续独立工作。
