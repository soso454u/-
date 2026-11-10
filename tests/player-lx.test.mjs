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
const songId = '00000000000001';
function workerQuery(url, options) {
  assert.equal(`${url.origin}${url.pathname}`, worker);
  assert.equal(options.method, 'GET');
  assert.equal(options.credentials, 'omit');
  assert.equal(options.cache, 'no-store');
  assert.equal(options.headers, undefined);
  assert.equal(options.body, undefined);
  return Object.fromEntries(url.searchParams);
}
function player(fetch, enabled, resolveGd = () => null, playMedia = () => {}) {
  const audio = { dataset: {}, duration: 226, pause() {} };
  const urls = [], lyrics = [], fallback = [], statuses = [];
  const build = new Function('ROOT', 'audio', 'fetch', 'enabled', 'urls', 'lyrics', 'fallback', 'statuses', 'resolveGd', 'playMedia', `
    const SELENE_METING_API=${JSON.stringify(meting)},GD_SOURCES=['netease','joox'],GD_SOURCE_LABELS={tencent:'QQ',netease:'网易云'},METING_METADATA_APIS=[SELENE_METING_API];
    const getResponseUrl=value=>value||'';
    ${section('const defaults =', 'const KEEPALIVE_NAME').replace('DEFAULT_COMPANION_PRESET', "''")}
    const isVideoEntry=()=>false,bilibiliPlayer={close(){}};
    const settings=enabled===undefined?defaults:{...defaults,lxMusicEnabled:enabled},playbackSources=new WeakMap(),dataRequestControllers=new Set(),failedPlaybackUrls=new Set();
    const setStatus=message=>statuses.push(message),toast=(kind,message)=>statuses.push(message);
    let playRequest=0,disposed=false,pendingPlaybackSelection=false,playbackWanted=false,playbackPhase='',audioPriming=false;
    let playbackRecoveryCount=0,playbackBlobRetryUsed=false,lyricTimeline=[],currentLyricWords='',lyricState='';
    const cancelPlaybackProbe=()=>{},applyAudioSessionMode=()=>{},pauseKeepAliveForTrack=()=>{},primeAudioFromGesture=()=>{},updatePlayButton=()=>{},show=()=>{},paintTime=()=>{};
    const playOfflineSong=async()=>null,gdFallback=async(song,attempt,isActive,excluded,sources)=>{fallback.push(sources);return resolveGd(sources,song);};
    const isNotAllowed=e=>e.name==='NotAllowedError',clearFailedPlayback=()=>{playbackWanted=false;},mediaDetail=e=>e.message;
    const playUrl=async(url,label,isolated,options)=>{urls.push({url,label,isolated,options});return playMedia(url);};
    const recordCompanionPlay=()=>{},maybeAutoCompanion=()=>{},applyCurrentCover=()=>{},loadLyrics=song=>lyrics.push(song.gdLyricId);
    const console={warn(){}};
    ${section('function normalizeSongText', '// Share upstream cooldown')}
    ${section('function metingSearchUrl', 'async function coverSearch')}
    ${section('function playbackSourceChoice', 'async function gdCover')}
    ${section('const LX_SOURCES=', 'function parse(text)')}
    return {play,playLxSource,searchMetingSource,select:(song,source)=>playbackSources.set(song,source)};
  `);
  return { ...build({ AbortController, setTimeout, clearTimeout }, audio, fetch, enabled, urls, lyrics, fallback, statuses, resolveGd, playMedia), urls, lyrics, fallback, statuses };
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
      { ...match, title: `${track.title} (Live)`, url: match.url.replace(songId, '00000000000002') },
      { ...match, author: '翻唱歌手', url: match.url.replace(songId, '00000000000003') },
      { ...match, url: match.url.replace('tencent', 'kugou').replace(songId, '00000000000004') },
      { ...match, duration: 30, url: match.url.replace(songId, '00000000000005') },
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

test('previously imported QQ rows try their saved audio and recover by exact QQ ID without searching for a singer', async () => {
  const audio = 'https://meting.test/api?server=tencent&type=url&id=00000000000001';
  const song = { source: 'tencent', id: `tencent:${songId}:翻唱歌手`, mediaId: songId, title: '夜曲（现场）', artist: '翻唱歌手', duration: 226, audio };
  const fetch = async (url, options) => {
    assert.deepEqual(workerQuery(url, options), { source: 'tx', id: songId, quality: '128k' });
    return Response.json({ code: 0, url: 'https://cdn.test/live.m4a' });
  };
  const api = player(fetch, true, () => assert.fail('the exact QQ recording should be attempted before GD'), url => { if (url === audio) throw Error('old link expired'); });
  await api.play({ ...song });
  assert.deepEqual(api.urls.map(({ url }) => url), [audio, 'https://cdn.test/live.m4a']);
  assert.equal(api.urls[0].options.expectedDuration, 226);
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
