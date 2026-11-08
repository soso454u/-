import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { init } from '../server-plugin/selene-lx.mjs';

const script = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
function section(start, end) {
  const first = script.indexOf(start), last = script.indexOf(end, first);
  assert.ok(first >= 0 && last > first);
  return script.slice(first, last);
}

async function server() {
  let handler;
  await init({ post(path, fn) { assert.equal(path, '/url'); handler = fn; } });
  return async (body, handle = 'test') => {
    const headers = new Headers();
    let status;
    return handler({ body, user: { profile: { handle } } }, {
      set: (name, value) => headers.set(name, value),
      status(code) { status = code; return this; },
      json: value => Response.json(value, { status, headers }),
    });
  };
}

const meting = 'https://meting.test/api';
const track = { title: '测试歌曲', artist: '原唱歌手', source: 'joox', mediaId: 'joox-only', gdLyricId: 'gd-lyrics', duration: 226 };
const songId = '00000000000001';
function player(fetch, enabled = true, resolveGd = () => null) {
  const audio = { dataset: {}, duration: 226, pause() {} };
  const urls = [], lyrics = [], fallback = [], statuses = [];
  const build = new Function('ROOT', 'audio', 'fetch', 'enabled', 'urls', 'lyrics', 'fallback', 'statuses', 'resolveGd', `
    const SELENE_METING_API=${JSON.stringify(meting)},GD_SOURCES=['netease','joox','bilibili'],GD_SOURCE_LABELS={tencent:'QQ',netease:'网易云'};
    const settings={lxMusicEnabled:enabled},playbackSources=new WeakMap(),dataRequestControllers=new Set(),failedPlaybackUrls=new Set();
    const setStatus=message=>statuses.push(message),toast=(kind,message)=>statuses.push(message);
    let playRequest=0,disposed=false,pendingPlaybackSelection=false,playbackWanted=false,playbackPhase='',audioPriming=false;
    let playbackRecoveryCount=0,safariBlobRetryUsed=false,lyricTimeline=[],currentLyricWords='',lyricState='';
    const cancelPlaybackProbe=()=>{},applyAudioSessionMode=()=>{},pauseKeepAliveForTrack=()=>{},primeAudioFromGesture=()=>{},updatePlayButton=()=>{},show=()=>{},paintTime=()=>{};
    const playOfflineSong=async()=>null,gdFallback=async(song)=>{fallback.push(song);return resolveGd(song);};
    const isNotAllowed=()=>false,clearFailedPlayback=()=>{playbackWanted=false;},mediaDetail=e=>e.message;
    const playUrl=async(url,label,isolated,options)=>urls.push({url,label,isolated,options});
    const recordCompanionPlay=()=>{},maybeAutoCompanion=()=>{},applyCurrentCover=()=>{},loadLyrics=song=>lyrics.push(song.gdLyricId);
    const playlistSameOriginHeaders=()=>({'X-CSRF-Token':'test-token'}),console={warn(){}};
    ${section('function normalizeSongText', '// Share upstream cooldown')}
    ${section('function metingSearchUrl', 'async function coverSearch')}
    ${section('function playbackSourceChoice', 'async function gdCover')}
    ${section('const LX_SOURCES=', 'function parse(text)')}
    return {play,playLxSource,select:(song,source)=>playbackSources.set(song,source)};
  `);
  return { ...build({ AbortController, setTimeout, clearTimeout }, audio, fetch, enabled, urls, lyrics, fallback, statuses, resolveGd), urls, lyrics, fallback, statuses };
}

test('explicit LX playback resolves a strict QQ match and retains the original GD song identity', async t => {
  const upstream = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, `https://lxmusicapi.onrender.com/url/tx/${songId}/128k`);
    assert.equal(options.headers['X-Request-Key'], 'share-v3');
    assert.equal(options.redirect, 'error');
    return Response.json({ code: 0, url: 'http://cdn.test/stream?signature=test', extra: { expire: { time: Math.floor(Date.now() / 1000) + 60, canExpire: true } } });
  });
  const request = await server();
  let searches = 0;
  const fetch = async (url, options) => {
    if (url === '/api/plugins/selene-lx/url') {
      assert.equal(options.headers['X-CSRF-Token'], 'test-token');
      assert.equal(options.headers['X-Request-Key'], undefined);
      return request(JSON.parse(options.body));
    }
    searches++;
    assert.equal(url.searchParams.get('server'), 'tencent');
    assert.equal(url.searchParams.get('id'), `${track.title} ${track.artist}`);
    const match = { title: track.title, author: track.artist, url: `${meting}?server=tencent&type=url&id=${songId}` };
    return Response.json([
      { ...match, title: `${track.title} (Live)`, url: match.url.replace(songId, '00000000000002') },
      { ...match, author: '翻唱歌手', url: match.url.replace(songId, '00000000000003') },
      { ...match, url: match.url.replace('tencent', 'kugou').replace(songId, '00000000000004') },
      match,
    ]);
  };
  const api = player(fetch), song = { ...track };
  api.select(song, 'lx-tencent');
  const attempt = api.play(song);
  assert.equal(api.play(song), attempt);
  await attempt;
  assert.equal(searches, 1);
  assert.equal(upstream.mock.callCount(), 1);
  assert.equal(api.urls[0].url, 'https://cdn.test/stream?signature=test');
  assert.equal(api.urls[0].options.expectedDuration, 226);
  assert.deepEqual(api.lyrics, ['gd-lyrics']);
  assert.equal(api.fallback.length, 0);
  assert.deepEqual(song, { ...track, offline: false });

  const disabled = player(() => assert.fail('LX should be opt-in'), false);
  disabled.select(song, 'lx-tencent');
  await disabled.play(song);
  assert.deepEqual(disabled.fallback, [song]);
});

test('the server route validates inputs, coalesces pending requests and stops at upstream limits', async t => {
  let reply = { code: 0, url: 'https://cdn.test/stream' };
  const upstream = t.mock.method(globalThis, 'fetch', async () => Response.json(reply));
  const request = await server(), valid = { source: 'tx', songId, quality: '128k' };
  assert.equal((await request(valid, '')).status, 401);
  assert.equal((await request({ ...valid, songId: '../../bad' })).status, 400);
  assert.equal((await request({ ...valid, source: 'joox' })).status, 400);
  assert.equal(upstream.mock.callCount(), 0);
  const responses = await Promise.all([request(valid), request(valid)]);
  assert.ok(responses.every(response => response.status === 200 && response.headers.get('Cache-Control') === 'no-store'));
  assert.equal(upstream.mock.callCount(), 1);
  reply = { ...reply, extra: { expire: { time: Math.floor(Date.now() / 1000) - 1, canExpire: true } } };
  assert.equal((await (await request(valid)).json()).error, 'expired');
  reply = { code: 5 };
  assert.equal((await request(valid)).status, 429);
  assert.equal((await request({ ...valid, quality: '320k' })).status, 429);
  assert.equal(upstream.mock.callCount(), 3);
});

test('LX uses at most two qualities and stops immediately for rate limits and timeouts', async () => {
  const song = { ...track, source: 'netease', gdSource: 'netease', mediaId: '123' };
  const attempts = [];
  const api = player(async (url, options) => {
    assert.equal(url, '/api/plugins/selene-lx/url');
    attempts.push(JSON.parse(options.body));
    return attempts.length === 1
      ? Response.json({ error: 'unavailable', code: 2 }, { status: 422 })
      : Response.json({ error: 'rate-limit', retryAt: Date.now() + 30000 }, { status: 429 });
  });
  await assert.rejects(api.playLxSource(song, 'netease', () => true), /限流/);
  await assert.rejects(api.playLxSource(song, 'netease', () => true), /冷却/);
  assert.deepEqual(attempts, ['128k', '320k'].map(quality => ({ source: 'wy', songId: '123', quality })));
  assert.equal(api.urls.length, 0);
  let timeouts = 0;
  const timedOut = player(async () => { timeouts++; return Response.json({ error: 'timeout' }, { status: 504 }); });
  await assert.rejects(timedOut.playLxSource(song, 'netease', () => true), /超时/);
  assert.equal(timeouts, 1);
});

test('enabled automatic fallback tries LX only after GD fails and respects manual GD selection', async () => {
  const song = { ...track, source: 'netease', gdSource: 'netease', mediaId: '123' };
  const order = [];
  const api = player(async (url, options) => {
    assert.equal(url, '/api/plugins/selene-lx/url');
    assert.deepEqual(JSON.parse(options.body), { source: 'wy', songId: '123', quality: '128k' });
    order.push('LX');
    return Response.json({ code: 0, url: 'https://cdn.test/stream' });
  }, true, () => { order.push('GD'); throw Error('GD 不可用'); });
  await api.play(song);
  assert.deepEqual(order, ['GD', 'LX']);
  assert.equal(api.urls.length, 1);
  assert.match(api.statuses.at(-1), /LX Music · 网易云/);

  api.select(song, 'netease');
  await api.play(song);
  assert.deepEqual(order, ['GD', 'LX', 'GD']);
  const healthyGd = player(() => assert.fail('successful GD playback needs no LX request'), true, () => ({ offline: false }));
  await healthyGd.play({ ...song });
  assert.equal(healthyGd.fallback.length, 1);
});

test('an existing built-in proxy is tried after a missing plugin, without login credentials', async () => {
  const song = { ...track, source: 'netease', gdSource: 'netease', mediaId: '123' };
  const paths = [];
  const api = player(async (url, options) => {
    paths.push(url);
    if (url === '/api/plugins/selene-lx/url') return new Response(null, { status: 404 });
    assert.equal(options.credentials, 'omit');
    assert.deepEqual(options.headers, { 'X-Request-Key': 'share-v3' });
    assert.equal(options.redirect, 'manual');
    const time = Math.floor(Date.now() / 1000) + (url.endsWith('128k') ? -60 : 60);
    return Response.json({ code: 0, url: 'http://cdn.test/stream', extra: { expire: { time, canExpire: true } } });
  });
  await api.playLxSource(song, 'netease', () => true);
  assert.deepEqual(paths, [
    '/api/plugins/selene-lx/url',
    '/proxy/https://lxmusicapi.onrender.com/url/wy/123/128k',
    '/proxy/https://lxmusicapi.onrender.com/url/wy/123/320k',
  ]);
  assert.equal(api.urls[0].url, 'https://cdn.test/stream');

  const disabled = player(async url => new Response(null, { status: url.startsWith('/proxy/') ? 401 : 404 }));
  await assert.rejects(disabled.playLxSource(song, 'netease', () => true), /请安装 Selene LX Music 服务端插件/);
});
