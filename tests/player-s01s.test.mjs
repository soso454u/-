import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const script = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
function section(start, end) {
  const first = script.indexOf(start), last = script.indexOf(end, first);
  assert.ok(first >= 0 && last > first);
  return script.slice(first, last);
}

const meting = 'https://meting.test/api';
const worker = 'https://tang.api.s01s.cn/music_open_api.php';
const track = { title: '测试歌曲', artist: '原唱歌手', source: 'joox', mediaId: 'joox-only', gdLyricId: 'gd-lyrics', duration: 226 };
const songId = '002FsceO4WxKyF';
function workerQuery(url, options) {
  assert.equal(`${url.origin}${url.pathname}`, worker);
  assert.equal(options.method, 'GET');
  assert.equal(options.credentials, 'omit');
  assert.equal(options.cache, 'no-store');
  assert.equal(options.headers, undefined);
  assert.equal(options.body, undefined);
  return Object.fromEntries(url.searchParams);
}
function player(fetch, enabled, resolveGd = () => null, playMedia = () => {}, savedSongs = [], { now = Date.now, offline = () => null, delay = setTimeout } = {}) {
  const audio = { dataset: {}, duration: 226, pause() {} };
  const urls = [], lyrics = [], fallback = [], statuses = [], saves = [], countdowns = [];
  const build = new Function('ROOT', 'audio', 'fetch', 'enabled', 'urls', 'lyrics', 'fallback', 'statuses', 'resolveGd', 'playMedia', 'savedSongs', 'saves', 'Date', 'offline', 'countdowns', `
    const SELENE_METING_API=${JSON.stringify(meting)},GD_SOURCES=['netease','joox'],GD_SOURCE_LABELS={tencent:'QQ',netease:'网易云'},METING_METADATA_APIS=[SELENE_METING_API],METING_COVER_APIS=METING_METADATA_APIS;
    const getResponseUrl=value=>value||'';
    ${section('const defaults =', 'const KEEPALIVE_NAME').replace('DEFAULT_COMPANION_PRESET', "''")}
    const isVideoEntry=()=>false,bilibiliPlayer={close(){}};
    const settings={...defaults,lxMusicEnabled:enabled??defaults.lxMusicEnabled,playlists:[{songs:savedSongs}]},playbackSources=new WeakMap(),dataRequestControllers=new Set(),failedPlaybackUrls=new Set();
    let queue=[],queueIndex=-1,verifiedPlaybackSong=null,resumePoint=null;
    const checkpointPlayback=()=>{},recordPlaybackStart=()=>false;let current=null;
    const reuseLibraryCovers=()=>false,count=()=>{},playListEntry=play,save=()=>saves.push(structuredClone(savedSongs));
    const setStatus=(message,persistent,retryAt)=>{statuses.push(message);if(retryAt)countdowns.push(retryAt);},toast=(kind,message)=>statuses.push(message);
    let playRequest=0,disposed=false,pendingPlaybackSelection=false,playbackWanted=false,playbackPhase='',audioPriming=false;
    let playbackRecoveryCount=0,playbackBlobRetryUsed=false,lyricTimeline=[],currentLyricWords='',lyricState='';
    const emitPlaybackOptionsState=()=>{},emitLyricsState=()=>{},resetLyrics=(message='暂无歌词')=>{lyricTimeline=[];currentLyricWords='';lyricState=message;};
    const cancelPlaybackProbe=()=>{},applyAudioSessionMode=()=>{},pauseKeepAliveForTrack=()=>{},primeAudioFromGesture=()=>{},updatePlayButton=()=>{},show=(song,message)=>{current=song;if(message!==undefined)resetLyrics(message);},paintTime=()=>{};
    const playOfflineSong=async()=>offline(),gdFallback=async(song,attempt,isActive,excluded,sources)=>{fallback.push(sources);return resolveGd(sources,song);};
    const isNotAllowed=e=>e.name==='NotAllowedError',clearFailedPlayback=()=>{playbackWanted=false;},mediaDetail=e=>e.message;
    const playUrl=async(url,label,isolated,options)=>{urls.push({url,label,isolated,options});return playMedia(url);};
    const recordCompanionPlay=()=>{},maybeAutoCompanion=()=>{},applyCurrentCover=()=>{};
    const resolveLyrics=async()=>{lyrics.push('fallback');return {original:'[00:01]备用歌词',translation:''};};
    ${section('function lyricFitsAudio','function lyricTimelinesMatch')}
    ${section('async function loadLyrics','const LX_SOURCES=')}
    const console={warn(){}};
    ${section('function normalizeSongText', '// Share upstream cooldown')}
    ${section('function metingSearchUrl', 'async function coverSearch')}
    ${section('function playbackSourceChoice', 'async function gdCover')}
    ${section('const playlistPlaybackOrigins=', 'function bindDesktopLyrics')}
    ${section('const LX_SOURCES=', 'function parse(text)')}
    return {play,playLxSource,searchMetingSource,cancel:()=>{playbackWanted=false;++playRequest;},playSaved:()=>{playPlaylistAt(savedSongs);return pendingPlay?.promise;},select:(song,source)=>playbackSources.set(song,source),quality:value=>settings.s01sQuality=value,timeline:()=>lyricTimeline};
  `);
  return { ...build({ AbortController, setTimeout: delay, clearTimeout }, audio, fetch, enabled, urls, lyrics, fallback, statuses, resolveGd, playMedia, savedSongs, saves, { now, parse: Date.parse }, offline, countdowns), urls, lyrics, fallback, statuses, saves, countdowns };
}

const qqSong = () => ({ ...track, source: 'tencent', mediaId: songId, gdSource: 'tencent' });
const payload = extra => ({ song_mid: songId, song_play_url: 'http://cdn.test/default.m4a', song_play_time: 226, song_lyric: '[00:01]为你弹奏萧邦的夜曲', ...extra });

test('S01S uses GET mid only, upgrades audio to HTTPS and uses the same response lyrics', async () => {
  let calls = 0;
  const api = player(async (url, options) => {
    calls++;
    assert.deepEqual(workerQuery(url, options), { mid: songId });
    return Response.json(payload());
  });
  const song = qqSong();
  await api.play(song);
  assert.equal(calls, 1);
  assert.equal(api.urls[0].url, 'https://cdn.test/default.m4a');
  assert.deepEqual(api.timeline()[0].lines, ['为你弹奏萧邦的夜曲']);
  assert.deepEqual(api.lyrics, []);
  assert.equal(song.audio, undefined);
});

test('each quality selects its own field without additional API requests', async () => {
  for (const [quality, field] of Object.entries({ auto: 'song_play_url', standard: 'song_play_url_standard', hq: 'song_play_url_hq', sq: 'song_play_url_sq', pq: 'song_play_url_pq' })) {
    let calls = 0;
    const api = player(async () => { calls++; return Response.json(payload({ [field]: 'https://cdn.test/' + quality })); });
    api.quality(quality);
    await api.play(qqSong());
    assert.equal(calls, 1);
    assert.equal(api.urls[0].url, 'https://cdn.test/' + quality);
  }
});

test('missing selected quality and service errors continue through the existing independent fallback', async () => {
  for (const response of [
    Response.json(payload({ song_play_url_pq: '' })),
    Response.json({ message: 'unavailable' }, { status: 503 }),
    Response.json({ song_mid: 'wrong', song_play_url: 'https://cdn.test/wrong' }),
  ]) {
    let calls = 0;
    const api = player(async () => { calls++; return response; }, true, () => ({ source: 'netease', offline: false }));
    api.quality('pq');
    await api.play(qqSong());
    assert.equal(calls, 1);
    assert.deepEqual(api.fallback, [['netease', 'joox']]);
    assert.deepEqual(api.urls, []);
  }
});

test('default quality can recover from an unusable format using a compatible URL from the same response', async () => {
  let calls = 0;
  const api = player(async () => { calls++; return Response.json(payload({ song_play_url: 'https://cdn.test/unsupported.flac', song_play_url_hq: 'https://cdn.test/compatible.m4a' })); },
    true, () => null, url => { if (url.endsWith('.flac')) throw Error('decode'); });
  await api.play(qqSong());
  assert.equal(calls, 1);
  assert.deepEqual(api.urls.map(row => row.url), ['https://cdn.test/unsupported.flac', 'https://cdn.test/compatible.m4a']);
});

test('missing or mistimed S01S lyrics use the normal lyric fallback', async () => {
  for (const song_lyric of ['', '[10:00]不匹配的歌词']) {
    const api = player(async () => Response.json(payload({ song_lyric })));
    await api.play(qqSong());
    assert.deepEqual(api.lyrics, ['fallback']);
    assert.deepEqual(api.timeline()[0].lines, ['备用歌词']);
  }
});

test('switching from S01S to another source clears its lyrics', async () => {
  const api = player(async () => Response.json(payload()), true, () => ({ source: 'netease', offline: false }));
  const song = qqSong();
  await api.play(song);
  api.select(song, 'netease');
  await api.play(song);
  assert.deepEqual(api.lyrics, ['fallback']);
  assert.deepEqual(api.timeline()[0].lines, ['备用歌词']);
});

test('cancellation and browser playback denial do not apply the response lyrics', async () => {
  let complete;
  let begin;
  const started = new Promise(resolve => { begin = resolve; });
  const api = player(() => new Promise(resolve => { complete = resolve; begin(); }));
  const pending = api.play(qqSong());
  await started;
  api.cancel();
  complete(Response.json(payload()));
  await pending;
  assert.deepEqual(api.urls, []);
  assert.deepEqual(api.timeline(), []);

  const denied = player(async () => Response.json(payload()), true, () => assert.fail('No fallback on browser denial'), () => { throw new DOMException('denied', 'NotAllowedError'); });
  await denied.play(qqSong());
  assert.match(denied.statuses.at(-1), /浏览器阻止播放/);
  assert.deepEqual(denied.timeline(), []);
});
