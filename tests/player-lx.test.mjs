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
const worker = 'https://selene-lx-worker.soivt44.workers.dev/api/lx/url';
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
function player(fetch, enabled, resolveGd = () => null, playMedia = () => {}, savedSongs = [], { now = Date.now, offline = () => null } = {}) {
  const audio = { dataset: {}, duration: 226, pause() {} };
  const urls = [], lyrics = [], fallback = [], statuses = [], saves = [], countdowns = [];
  const build = new Function('ROOT', 'audio', 'fetch', 'enabled', 'urls', 'lyrics', 'fallback', 'statuses', 'resolveGd', 'playMedia', 'savedSongs', 'saves', 'Date', 'offline', 'countdowns', `
    const SELENE_METING_API=${JSON.stringify(meting)},GD_SOURCES=['netease','joox'],GD_SOURCE_LABELS={tencent:'QQ',netease:'网易云'},METING_METADATA_APIS=[SELENE_METING_API],METING_COVER_APIS=METING_METADATA_APIS;
    const getResponseUrl=value=>value||'';
    ${section('const defaults =', 'const KEEPALIVE_NAME').replace('DEFAULT_COMPANION_PRESET', "''")}
    const isVideoEntry=()=>false,bilibiliPlayer={close(){}};
    const settings={...defaults,lxMusicEnabled:enabled??defaults.lxMusicEnabled,playlists:[{songs:savedSongs}]},playbackSources=new WeakMap(),dataRequestControllers=new Set(),failedPlaybackUrls=new Set();
    let queue=[],queueIndex=-1;
    const count=()=>{},playListEntry=play,save=()=>saves.push(structuredClone(savedSongs));
    const setStatus=(message,persistent,retryAt)=>{statuses.push(message);if(retryAt)countdowns.push(retryAt);},toast=(kind,message)=>statuses.push(message);
    let playRequest=0,disposed=false,pendingPlaybackSelection=false,playbackWanted=false,playbackPhase='',audioPriming=false;
    let playbackRecoveryCount=0,playbackBlobRetryUsed=false,lyricTimeline=[],currentLyricWords='',lyricState='';
    const cancelPlaybackProbe=()=>{},applyAudioSessionMode=()=>{},pauseKeepAliveForTrack=()=>{},primeAudioFromGesture=()=>{},updatePlayButton=()=>{},show=()=>{},paintTime=()=>{};
    const playOfflineSong=async()=>offline(),gdFallback=async(song,attempt,isActive,excluded,sources)=>{fallback.push(sources);return resolveGd(sources,song);};
    const isNotAllowed=e=>e.name==='NotAllowedError',clearFailedPlayback=()=>{playbackWanted=false;},mediaDetail=e=>e.message;
    const playUrl=async(url,label,isolated,options)=>{urls.push({url,label,isolated,options});return playMedia(url);};
    const recordCompanionPlay=()=>{},maybeAutoCompanion=()=>{},applyCurrentCover=()=>{},loadLyrics=song=>lyrics.push(song.gdLyricId);
    const console={warn(){}};
    ${section('function normalizeSongText', '// Share upstream cooldown')}
    ${section('function metingSearchUrl', 'async function coverSearch')}
    ${section('function playbackSourceChoice', 'async function gdCover')}
    ${section('const playlistPlaybackOrigins=', 'function bindDesktopLyrics')}
    ${section('const LX_SOURCES=', 'function parse(text)')}
    return {play,playLxSource,searchMetingSource,playSaved:()=>{playPlaylistAt(savedSongs);return pendingPlay?.promise;},select:(song,source)=>playbackSources.set(song,source)};
  `);
  return { ...build({ AbortController, setTimeout, clearTimeout }, audio, fetch, enabled, urls, lyrics, fallback, statuses, resolveGd, playMedia, savedSongs, saves, { now, parse: Date.parse }, offline, countdowns), urls, lyrics, fallback, statuses, saves, countdowns };
}

test('explicit LX playback resolves a strict QQ match and retains the original GD song identity', async () => {
  let searches = 0, lookups = 0;
  const fetch = async (url, options) => {
    if (url.origin !== new URL(meting).origin) {
      lookups++;
      assert.deepEqual(workerQuery(url, options), { source: 'tx', id: songId, quality: '128k' });
      return Response.json({ code: 0, url: 'http://cdn.test/stream?signature=test', expire: { time: Math.floor(Date.now() / 1000) + 60, canExpire: true } });
    }
    searches++;
    assert.equal(url.searchParams.get('server'), 'tencent');
    assert.equal(url.searchParams.get('id'), `${track.title} ${track.artist}`);
    const match = { title: track.title, author: track.artist, url: `${meting}?server=tencent&type=url&id=${songId}` };
    return Response.json([
      { ...match, title: `${track.title} (Live)`, url: match.url.replace(songId, '001AT6MC1nTzDO') },
      { ...match, author: '翻唱歌手', url: match.url.replace(songId, '002rsns11f5THY') },
      { ...match, url: match.url.replace('tencent', 'kugou').replace(songId, '004CCcys3axgTS') },
      { ...match, duration: 30, url: match.url.replace(songId, '001YNWTM3LsioN') },
      match,
    ]);
  };
  const api = player(fetch), song = { ...track };
  api.select(song, 'lx-tencent');
  const attempt = api.play(song);
  assert.equal(api.play(song), attempt);
  await attempt;
  assert.equal(searches, 1);
  assert.equal(lookups, 1);
  assert.equal(api.urls[0].url, 'http://cdn.test/stream?signature=test');
  assert.equal(api.urls[0].options.expectedDuration, 226);
  assert.deepEqual(api.lyrics, ['gd-lyrics']);
  assert.equal(api.fallback.length, 0);
  assert.deepEqual(song, { ...track, offline: false });

  const disabled = player(() => assert.fail('disabled LX should not make requests'), false);
  disabled.select(song, 'lx-tencent');
  await disabled.play(song);
  assert.deepEqual(disabled.fallback, [['netease', 'joox']]);
});

test('cross-platform matching obtains real NetEase and Kugou IDs from the selected platform', async () => {
  for (const [platform, source, id] of [['netease', 'wy', '123'], ['kugou', 'kg', 'abcd'.repeat(8)]]) {
    const api = player(async (url, options) => {
      if (url.origin !== new URL(meting).origin) {
        assert.deepEqual(workerQuery(url, options), { source, id, quality: '128k' });
        return Response.json({ code: 0, url: 'https://cdn.test/stream' });
      }
      assert.equal(url.searchParams.get('server'), platform);
      const wrongId = id.replace(/./, '9');
      const row = { title: track.title, author: track.artist, url: `${meting}?type=url&server=${platform}&id=${id}` };
      return Response.json([
        { ...row, url: row.url.replace('/api?', '/other?').replace(id, wrongId) },
        row,
      ]);
    });
    await api.playLxSource({ ...track, source: 'tencent', mediaId: songId }, platform, () => true);
    assert.equal(api.urls.length, 1);
  }
});

test('LX uses at most two qualities and stops immediately for rate limits and timeouts', async () => {
  const song = { ...track, source: 'netease', gdSource: 'netease', mediaId: '123' };
  const attempts = [];
  const api = player(async (url, options) => {
    attempts.push(workerQuery(url, options));
    return attempts.length === 1
      ? Response.json({ error: 'unavailable', code: 2 }, { status: 422 })
      : new Response(null, { status: 429, headers: { 'Retry-After': '30' } });
  });
  await assert.rejects(api.playLxSource(song, 'netease', () => true), /限流/);
  await assert.rejects(api.playLxSource(song, 'netease', () => true), /冷却/);
  assert.deepEqual(attempts, ['128k', '320k'].map(quality => ({ source: 'wy', id: '123', quality })));
  assert.equal(api.urls.length, 0);
  let timeouts = 0;
  const timedOut = player(async () => { timeouts++; return Response.json({ error: 'timeout' }, { status: 504 }); });
  await assert.rejects(timedOut.playLxSource(song, 'netease', () => true), /超时/);
  assert.equal(timeouts, 1);
});

test('default playback tries GD NetEase, then LX QQ with a matched QQ ID', async () => {
  const song = { ...track, source: 'netease', gdSource: 'netease', mediaId: '123' };
  const order = [];
  const api = player(async (url, options) => {
    if (url.origin === new URL(meting).origin) {
      assert.equal(url.searchParams.get('server'), 'tencent');
      return Response.json([{ title: song.title, author: song.artist, url: `${meting}?server=tencent&type=url&id=${songId}` }]);
    }
    assert.deepEqual(workerQuery(url, options), { source: 'tx', id: songId, quality: '128k' });
    order.push('lx-tencent');
    return Response.json({ code: 0, url: 'https://cdn.test/stream' });
  }, undefined, sources => { order.push(...sources); throw Error('GD 不可用'); });
  await api.play(song);
  assert.deepEqual(order, ['netease', 'lx-tencent']);
  assert.equal(api.urls.length, 1);
  assert.match(api.statuses.at(-1), /LX Music · QQ/);

  api.select(song, 'joox');
  await api.play(song);
  assert.deepEqual(order, ['netease', 'lx-tencent', 'joox']);
  const healthyGd = player(() => assert.fail('successful GD playback needs no LX request'), true, () => ({ offline: false }));
  await healthyGd.play({ ...track, source: 'joox' });
  assert.deepEqual(healthyGd.fallback, [['netease']]);
});

test('a failed LX lookup leaves the remaining GD sources available unless GD is on cooldown', async () => {
  for (const rateLimited of [false, true]) {
    const order = [];
    const api = player(async (url, options) => {
      assert.deepEqual(workerQuery(url, options), { source: 'tx', id: songId, quality: '128k' });
      order.push('lx-tencent');
      return new Response(null, { status: 502 });
    }, undefined, sources => {
      order.push(...sources);
      if (rateLimited) throw Object.assign(Error('网易云不可用'), { retryAt: Date.now() + 60000 });
      return { source: 'joox', offline: false };
    });
    await api.play({ ...track, source: 'tencent', mediaId: songId, gdSource: 'tencent' });
    assert.deepEqual(order, ['lx-tencent', 'netease', 'joox']);
    if (rateLimited) assert.match(api.statuses.at(-1), /HTTP 502.*网易云不可用/);
  }
});

test('previously imported QQ rows recover the original MID from saved audio before trying the audio URL', async () => {
  const audio = `${meting}?server=tencent&type=url&id=${songId}`;
  const song = { source: 'tencent', id: 'tencent:123:翻唱歌手', mediaId: '123', title: '夜曲（现场）', artist: '翻唱歌手', duration: 226, audio };
  const fetch = async (url, options) => {
    assert.deepEqual(workerQuery(url, options), { source: 'tx', id: songId, quality: '128k' });
    return Response.json({ code: 0, url: 'https://cdn.test/live.m4a' });
  };
  const api = player(fetch, true, () => assert.fail('the exact QQ recording should be attempted before GD'), url => { if (url === audio) throw Error('old link expired'); });
  await api.play({ ...song });
  assert.deepEqual(api.urls.map(({ url }) => url), ['https://cdn.test/live.m4a']);
  assert.equal(api.urls[0].options.expectedDuration, 226);
});

test('an unavailable QQ MID is repaired on the saved playlist row only after matching and playing the same recording', async () => {
  const oldMid = '003OldMID00000';
  const title = '海市蜃楼', artist = '三叔说', verifiedMid = '0040h3yY3Zk0fM';
  const metingUrl = (type, id) => `${meting}?server=tencent&type=${type}&id=${id}`;
  const cover = metingUrl('pic', '004L9Ksu1EjdDr');
  const saved = { source: 'tencent', id: `tencent:${oldMid}:${artist}`, mediaId: oldMid, title, artist, cover, customAudio: '' };
  const sameTitleOtherRecording = { ...saved, version: 'Live' };
  const lookups = [];
  let searches = 0;
  const api = player(async (url, options) => {
    if (url.origin === new URL(meting).origin) {
      searches++;
      assert.equal(url.searchParams.get('id'), `${title} ${artist}`);
      const row = { title, author: artist, pic: cover };
      return Response.json([
        { ...row, title: `${title} (DJ德朋版)`, url: metingUrl('url', '002Vk4aA1CW0Mz') },
        { ...row, version: '混音', url: metingUrl('url', '002xa45j167iPD') },
        { ...row, title: `${title} (Live)`, url: metingUrl('url', '001cnXR31bKYXs') },
        { ...row, author: '一颗狼星', url: metingUrl('url', '001pnsCG2W3HB2') },
        { ...row, pic: metingUrl('pic', '001lgEri3agq00'), url: metingUrl('url', '004GjQy01AqWSU') },
        { ...row, url: metingUrl('url', verifiedMid) },
      ]);
    }
    const query = workerQuery(url, options);
    lookups.push([query.id, query.quality]);
    if (query.id === oldMid) return Response.json({ code: 2, error: 'unavailable' }, { status: 422 });
    assert.equal(query.id, verifiedMid);
    return Response.json({ code: 0, url: 'https://cdn.test/verified.m4a' });
  }, true, () => assert.fail('an exact playable QQ recording needs no GD fallback'), () => {
    if(lookups.length===3)assert.equal(api.saves.length, 0);
  }, [saved, sameTitleOtherRecording]);

  await api.playSaved();
  assert.equal(api.saves[0][0].qqMid, verifiedMid);
  assert.equal(saved.id, `tencent:${oldMid}:${artist}`);
  assert.equal(saved.mediaId, oldMid);
  assert.equal(sameTitleOtherRecording.qqMid, undefined);
  await api.playSaved();
  assert.equal(searches, 1);
  assert.deepEqual(lookups, [[oldMid, '128k'], [oldMid, '320k'], [verifiedMid, '128k'], [verifiedMid, '128k']]);
});

test('a QQ playlist row without a MID searches first and rejects ambiguous versions', async () => {
  const saved = { title: '下完这场雨', artist: '后弦', id: 'tencent:下完这场雨:后弦', source: 'tencent', mediaId: '' };
  const candidates = [
    { title: saved.title, author: saved.artist, songmid: songId },
    { title: saved.title, author: saved.artist, mid: '004CCcys3axgTS' },
  ];
  for (const ambiguous of [false, true]) {
    const api = player(async (url, options) => {
      if (url.origin === new URL(meting).origin) return Response.json(ambiguous ? candidates : candidates.slice(0, 1));
      assert.equal(ambiguous, false, 'ambiguous results must not be sent to LX');
      assert.equal(workerQuery(url, options).id, songId);
      return Response.json({ code: 0, url: 'https://cdn.test/verified.m4a' });
    }, true, () => { throw Error('备用源不可用'); });
    const row = { ...saved };
    await api.play(row);
    assert.equal(row.qqMid, ambiguous ? undefined : songId);
    assert.equal(api.urls.length, ambiguous ? 0 : 1);
    if (ambiguous) assert.match(api.statuses.at(-1), /未找到同一录音.*备用源不可用/);
  }
});

test('autoplay denial produces a visible retry warning instead of silently stopping', async () => {
  const api = player(() => assert.fail('autoplay denial is not a provider failure'), true, () => assert.fail('no fallback'), () => { throw new DOMException('denied', 'NotAllowedError'); });
  await api.play({ ...track, customAudio: 'https://cdn.test/live.m4a' });
  assert.match(api.statuses.at(-1), /浏览器阻止播放，请再次点击播放按钮/);
});

test('expired addresses are skipped, fresh addresses are never persisted, and HTTP failures stop lookup', async () => {
  const song = { ...track, source: 'netease', gdSource: 'netease', mediaId: '123' };
  const qualities = [];
  const api = player(async (url, options) => {
    qualities.push(workerQuery(url, options).quality);
    const expire = qualities.length === 1 ? Math.floor(Date.now() / 1000) - 60 : Date.now() + 60000;
    return Response.json({ code: 0, url: `https://cdn.test/stream?token=${qualities.length}`, expire });
  });
  api.select(song, 'lx-netease');
  await api.play(song);
  await api.play(song);
  assert.deepEqual(qualities, ['128k', '320k', '128k']);
  assert.deepEqual(api.urls.map(({ url }) => url), ['https://cdn.test/stream?token=2', 'https://cdn.test/stream?token=3']);
  assert.equal(song.audio, undefined);

  let failures = 0;
  const broken = player(async () => { failures++; return new Response(null, { status: 502 }); });
  await assert.rejects(broken.playLxSource(song, 'netease', () => true), /HTTP 502/);
  assert.equal(failures, 1);
});

test('QQ search keeps the exact playable ID and uses the existing LX Worker on selection', async () => {
  const calls=[];
  const api=player(async (url,options)=>{
    calls.push(url);
    if(url.origin===new URL(meting).origin){
      assert.equal(url.searchParams.get('type'),'search');
      assert.equal(url.searchParams.get('server'),'tencent');
      return Response.json([
        {title:'Bad ID',url:`${meting}?type=url&server=tencent&id=1`},
        {title:'Album ID',pic:`${meting}?type=pic&server=tencent&id=${songId}`},
        {title:'Wrong service',url:`${meting}?type=url&server=netease&id=${songId}`},
        {title:'歌名',author:'歌手',url:`${meting}?type=url&server=tencent&id=${songId}&auth=demo`},
      ]);
    }
    assert.deepEqual(workerQuery(url,options),{source:'tx',id:songId,quality:'128k'});
    return Response.json({code:0,url:'https://cdn.test/qq.mp3'});
  },true,()=>assert.fail('QQ discovery should use its exact LX ID'));
  const [song,...extra]=await api.searchMetingSource('tencent','歌名');
  assert.deepEqual(extra,[]);
  assert.equal(song.id,`tencent:${songId}`);
  assert.equal(song.mediaId,songId);
  assert.equal(song.audio,'');
  await api.play(song);
  assert.equal(calls.length,2);
  assert.equal(api.urls[0].url,'https://cdn.test/qq.mp3');
});

test('LX reports the rejection and allows another song immediately without a server deadline', async () => {
  const song = { ...track, source: 'netease', gdSource: 'netease', mediaId: '123' };
  for (const [body, status, source, reason] of [
    [{ code: '1' }, 502, 'upstream', /上游.*IP/],
    [{ error: 'blocked' }, 403, 'upstream', /上游.*IP/],
    [{ code: 5 }, 429, 'upstream', /上游限流/],
    [{ code: 429, msg: 'Upstream HTTP 429' }, 429, 'upstream', /上游限流/],
    [{ code: 429, msg: 'Too many requests' }, 429, 'worker', /转发服务限流/],
    [null, 429, 'unknown', /来源未确认/],
  ]) {
    let calls = 0;
    const now = 1800000000000;
    const api = player(async () => {
      if (++calls > 1) return Response.json({ code: 0, url: 'https://cdn.test/stream' });
      return body ? Response.json(body, { status }) : new Response(null, { status });
    }, true, undefined, undefined, [], { now: () => now });
    await assert.rejects(api.playLxSource(song, 'netease', () => true), { message: reason, limitSource: source, status, retryAt: 0 });
    assert.equal(calls, 1, 'the failed selection does not retry another quality');
    const next = { ...song, mediaId: '456', title: '下一首' };
    assert.deepEqual(await api.playLxSource(next, 'netease', () => true), { offline: false });
    assert.equal(calls, 2);
  }
});

test('LX waits only for a valid future deadline in the response', async () => {
  const song = { ...track, source: 'netease', gdSource: 'netease', mediaId: '123' };
  const now = 1800000000000;
  for (const [retryAt, header, seconds] of [
    [now + 60000, '5', 60],
    [(now + 70000) / 1000, '5', 70],
    [now - 10000, '45', 45],
    ['invalid', new Date(now + 90000).toUTCString(), 90],
    [null, '-2100', 0],
    [null, '0', 0],
    [now - 10000, new Date(now - 5000).toUTCString(), 0],
  ]) {
    const api = player(async () => Response.json({ code: 5, retryAt }, { status: 429, headers: { 'Retry-After': header } }),
      true, undefined, undefined, [], { now: () => now });
    await assert.rejects(api.playLxSource(song, 'netease', () => true), { retryAt: seconds ? now + seconds * 1000 : 0 });
  }
});

test('the Worker can return no playable URL as HTTP 502 with code 2 without starting a cooldown', async () => {
  const song = { ...track, source: 'netease', gdSource: 'netease', mediaId: '123' };
  const qualities = [];
  const api = player(async (url, options) => {
    qualities.push(workerQuery(url, options).quality);
    return Response.json({ code: 2, msg: 'Upstream did not return a playable URL' }, { status: 502 });
  });
  for (let attempt = 0; attempt < 2; attempt++) {
    await assert.rejects(api.playLxSource(song, 'netease', () => true), error => {
      assert.match(error.message, /没有返回有效期内的播放地址/);
      assert.equal(error.retryAt, undefined);
      return true;
    });
  }
  assert.deepEqual(qualities, ['128k', '320k', '128k', '320k']);
});

test('manual LX and QQ search playback continue to independent sources during LX cooldown', async () => {
  const now = 1800000000000;
  let requests = 0, cached = false, gdAvailable = false;
  const api = player(async () => {
    requests++;
    return Response.json({ code: 1 }, { status: 502, headers: { 'Retry-After': '300' } });
  }, true, () => {
    if (gdAvailable) return { offline: false };
    throw Object.assign(Error('GD 限流'), { retryAt: now + 600000 });
  }, undefined, [], { now: () => now, offline: () => cached ? { offline: true } : null });
  const song = { ...track, source: 'tencent', mediaId: songId, lxSearch: true };
  api.select(song, 'lx-tencent');
  await api.play(song);
  assert.match(api.statuses.at(-1), /上游.*IP.*GD 限流/);
  assert.deepEqual(api.countdowns, [now + 300000]);
  assert.deepEqual(api.fallback, [['netease', 'joox']]);

  const manual = { ...song, lxSearch: false, customAudio: 'https://cdn.test/manual.mp3' };
  api.select(manual, 'lx-tencent');
  assert.equal(await api.play(manual), true);
  assert.equal(api.urls.at(-1).url, manual.customAudio);
  cached = true;
  assert.equal(await api.play({ ...song }), true);
  assert.match(api.statuses.at(-1), /离线缓存/);
  cached = false;
  gdAvailable = true;
  assert.equal(await api.play({ ...song }), true);
  assert.equal(api.statuses.at(-1), '正在播放');
  assert.deepEqual(api.countdowns, [now + 300000]);
  assert.equal(requests, 1);
});

test('LX notice counts down from the deadline and cancels updates when replaced', () => {
  const timers = new Map();
  const createElement = () => ({
    classList: { toggle() {} }, setAttribute() {}, children: [], textContent: '',
    append(node) { this.children.push(node); },
    remove() { notice = undefined; },
  });
  let now = 1800000000000, notice, nextTimer = 0;
  const status = createElement();
  const player = {
    querySelector: selector => ({ '.status': status, '.selene-playback-notice': notice, '.lyrics': { after(node) { notice = node; } } })[selector],
  };
  const ROOT = {
    setInterval(callback) { timers.set(++nextTimer, callback); return nextTimer; },
    clearInterval(id) { timers.delete(id); },
  };
  const setStatus = new Function('ROOT', 'DOC', 'ID', 'Date', `
    ${section('let playbackNoticeTimer=0;', 'function applyTheme')}
    return setStatus;
  `)(ROOT, { getElementById: () => player, createElement }, 'player', { now: () => now });
  setStatus('LX Music 上游限流', true, now + 30000);
  assert.match(notice.children[0].textContent, /剩余 30 秒/);
  const tick = [...timers.values()][0];
  now += 29001;
  tick();
  assert.match(notice.children[0].textContent, /剩余 1 秒/);
  now++;
  now += 998;
  tick();
  assert.match(notice.children[0].textContent, /冷却已结束/);
  assert.equal(timers.size, 0);
  setStatus('LX Music 上游限流', true, now + 30000);
  assert.equal(timers.size, 1);
  setStatus('正在播放');
  assert.equal(notice, undefined);
  assert.equal(timers.size, 0);
});
