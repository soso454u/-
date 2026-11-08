import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
function section(start, end) {
  const first = source.indexOf(start), last = source.indexOf(end, first);
  assert.ok(first >= 0 && last > first);
  return source.slice(first, last);
}
function lyrics(fetch = async () => { throw Error('unexpected request'); }, rate = { times: [], until: 0 }, meting = []) {
  const ROOT = { __SELENE_GD_RATE__: rate, AbortController, setTimeout, clearTimeout };
  return new Function('ROOT', 'fetch', 'URL', 'METING_METADATA_APIS', `
    const GD_API='https://music-api.gdstudio.xyz/api.php', audio={duration:240};
    let disposed=false,lyricTimeline=[];const lyricCache=new Map(),lyricRequests=new Map();
    ${section('function normalizeSongText', 'function activeLyricIndex')}
    ${section('function activeLyricIndex', 'function renderImmersiveLyrics')}
    ${section('function getResponseUrl','function sourceBitrates')}
    const coverResponses=new Map(),coverRequests=new Map();
    ${section('function metingSearchUrl','async function metingCover')}
    return {parseLrcGroups,mergeLyricTimeline,scoreLyricHit,lyricFitsAudio,lyricTimelinesMatch,resolveLyrics,gdFetch,lyricJson,
      index:(rows,time)=>{lyricTimeline=rows;return activeLyricIndex(time);}};
  `)(ROOT, fetch, URL, meting);
}
const ok = value => ({ ok: true, status: 200, json: async () => value });
const song = { title: 'Song', artist: 'Singer', source: 'netease', lyricId: 'lyric-7', mediaId: 'track-1', duration: 240 };

test('common LRC precision, repeated tags, offsets and blank interludes retain real line timings', () => {
  const { parseLrcGroups } = lyrics();
  const rows = parseLrcGroups('[offset:-100]\r[00:01.1][00:02,123]Hello\r[00:03:45]World\r[00:04]\r[00:67]invalid\r[1:02:03.456]Long');
  assert.deepEqual(rows, [
    { time: 1, lines: ['Hello'] }, { time: 2.023, lines: ['Hello'] },
    { time: 3.35, lines: ['World'] }, { time: 3.9, lines: [] },
    { time: 3723.356, lines: ['Long'] },
  ]);
});

test('translation gaps and tightly spaced lines never steal the next translation', () => {
  const { mergeLyricTimeline } = lyrics();
  assert.deepEqual(mergeLyricTimeline('[00:10]A\n[00:11]B\n[00:12]C', '[00:11]乙\n[00:12.010]丙'), [
    { time: 10, lines: ['A'] }, { time: 11, lines: ['B', '乙'] }, { time: 12, lines: ['C', '丙'] },
  ]);
  assert.deepEqual(mergeLyricTimeline('[00:01]A\n[00:01.100]B', '[00:01.060]乙')[0].lines, ['A']);
});

test('long outros are valid, out-of-range timings are rejected, and seeking uses the correct boundary', () => {
  const api = lyrics(), rows = api.parseLrcGroups('[00:05]A\n[01:00]B\n[01:10]');
  assert.equal(api.lyricFitsAudio('[01:00]last sung line', 240), true);
  assert.equal(api.lyricFitsAudio('[04:20]wrong version', 240), false);
  assert.equal(api.index(rows, 4.99), -1);
  assert.equal(api.index(rows, 60), 1);
  assert.equal(api.index(rows, 70), 2);
  assert.equal(api.index(rows, 5), 0);
  assert.equal(api.lyricTimelinesMatch('[00:10]A\n[00:20]B', '[00:11]甲\n[00:20]乙'), false);
});

test('cross-source matching requires exact singers, version and measured duration', () => {
  const { scoreLyricHit } = lyrics();
  assert.ok(Number.isFinite(scoreLyricHit({ name: 'Song', artist: ['Singer'], dt: 240500 }, song)));
  for (const item of [
    { name: 'Song', artist: ['Singer'] },
    { name: 'Song (Live)', artist: ['Singer'], duration: 240 },
    { name: 'Song', artist: ['Singer tribute'], duration: 240 },
    { name: 'Song', artist: ['Singer', 'Guest'], duration: 240 },
    { name: 'Song', artist: ['Singer'], duration: 260 },
  ]) assert.equal(scoreLyricHit(item, song), -Infinity);
});

test('current source lyric_id wins, concurrent loads share a request, and results are cached', async () => {
  const calls = [];
  const api = lyrics(async url => { calls.push(new URL(url)); await Promise.resolve(); return ok({ lyric: '[00:01]hello', tlyric: '[00:01]你好' }); });
  const [a, b] = await Promise.all([api.resolveLyrics(song), api.resolveLyrics(song)]);
  assert.deepEqual(a, b);assert.equal(calls.length, 1);
  assert.equal(calls[0].searchParams.get('id'), 'lyric-7');
  await api.resolveLyrics(song);assert.equal(calls.length, 1);
});

test('empty lyrics are cached and a pure instrumental does not trigger fallback', async () => {
  let count = 0;
  const api = lyrics(async () => { count++; return ok({ lyric: '' }); });
  await api.resolveLyrics({ ...song, artist: '' });await api.resolveLyrics({ ...song, artist: '' });
  assert.equal(count, 1);
  const instrumental = lyrics(async () => ok({ lyric: '[00:00]纯音乐，请欣赏' }));
  assert.equal((await instrumental.resolveLyrics(song)).instrumental, true);
});

test('missing primary lyrics use only a verified cross-source candidate; failures do not fan out', async () => {
  const calls = [];
  const api = lyrics(async url => {
    const q = new URL(url).searchParams;calls.push(q.get('types') + ':' + q.get('id'));
    if (q.get('types') === 'search') return ok([{ id: 8, lyric_id: 9, name: 'Song', artist: ['Singer'], duration: 240 }]);
    return ok({ lyric: q.get('id') === '9' ? '[00:10]correct' : '' });
  });
  const result = await api.resolveLyrics({ ...song, source: 'joox' });
  assert.equal(result.source, 'netease');assert.equal(result.id, '9');
  assert.deepEqual(calls, ['lyric:lyric-7', 'search:null', 'lyric:9']);
  let failures = 0;
  const failed = lyrics(async () => { failures++; throw Error('offline'); });
  await assert.rejects(failed.resolveLyrics(song), /offline/);
  await assert.rejects(failed.resolveLyrics(song), /offline/);
  assert.equal(failures, 2);
});

test('cancelled track stops fallback and GD 429/global request budget prevents more network traffic', async () => {
  let active = true, count = 0;
  const api = lyrics(async () => { count++; active = false; return ok({ lyric: '' }); });
  await api.resolveLyrics(song, () => active);assert.equal(count, 1);
  const rate = { times: [], until: 0 };
  const limited = lyrics(async () => { count++; return { status: 429, headers: { get: () => '300' } }; }, rate);
  await assert.rejects(limited.resolveLyrics(song), /限流/);
  await assert.rejects(limited.resolveLyrics({ ...song, lyricId: 'other' }), /限流/);
  assert.equal(count, 3);
  let sent = 0;
  const budget = lyrics(async () => { sent++; return ok({}); }, { times: Array(50).fill(Date.now()), until: 0 });
  await assert.rejects(budget.gdFetch('https://music-api.gdstudio.xyz/api.php'), error=>error.limitSource==='local'&&error.requestCount===50);
  assert.equal(sent, 0);
});

test('immersive empty/error/instrumental states replace loading text without a new timeline', () => {
  const box = { textContent: '', children: [], replaceChildren() { this.textContent = ''; } };
  const DOC = { querySelector: () => box, getElementById: () => ({ classList: { contains: () => false } }) };
  const render = new Function('DOC', `const ID='player',lyricTimeline=[];let lyricState='加载歌词…';${section('function renderImmersiveLyrics', 'function paintTime')};return state=>{lyricState=state;renderImmersiveLyrics(-1);};`)(DOC);
  for (const state of ['加载歌词…', '暂无歌词', '纯音乐 · 请欣赏', '歌词暂时加载失败']) {
    render(state);assert.equal(box.textContent, state);
  }
});

test('GD rate limiting uses independent timed lyrics without requesting another GD source',async()=>{
  const calls=[];
  const api=lyrics(async(url,options)=>{
    const u=new URL(url);calls.push(u);
    if(u.hostname==='music-api.gdstudio.xyz')return {status:429,headers:{get:()=> '300'}};
    assert.equal(u.hostname,'lrclib.net');assert.match(options.headers['Lrclib-Client'],/Selene Music/);
    return ok([{id:44,trackName:'Song',artistName:'Singer',albumName:'Album',duration:240,syncedLyrics:'[00:01]correct backup'}]);
  });
  const resolved=await api.resolveLyrics({...song,source:'joox'});assert.equal(resolved.source,'lrclib');assert.equal(resolved.id,'44');
  assert.equal(calls.length,2);assert.equal(calls.filter(url=>url.hostname==='music-api.gdstudio.xyz').length,1);
  await api.resolveLyrics({...song,source:'joox'});assert.equal(calls.length,2,'cached backup and GD errors prevent repeated requests');
});
test('independent lyrics reject covers, other versions, and a mismatched measured duration',async()=>{
  for(const change of [{artistName:'Cover Singer'},{trackName:'Song (Live)'},{duration:280}]){
    const api=lyrics(async url=>new URL(url).hostname==='music-api.gdstudio.xyz'?{status:429,headers:{get:()=> '300'}}:ok([{id:44,trackName:'Song',artistName:'Singer',duration:240,syncedLyrics:'[00:01]wrong',...change}]));
    await assert.rejects(api.resolveLyrics({...song,source:'joox'}),/限流/);
  }
});
test('preferred Meting lyrics use the returned signed URL for the exact track without spending GD quota',async()=>{
  const calls=[];
  const api=lyrics(async url=>{
    const u=new URL(url);calls.push(u);
    assert.equal(u.hostname,'meting.test');
    if(u.searchParams.get('type')==='search')return ok([
      {lrc:'https://meting.test/api?server=netease&type=lrc&id=cover&auth=bad'},
      {lrc:'https://meting.test/api?server=netease&type=lrc&id=track-1&auth=exact'}
    ]);
    assert.equal(u.searchParams.get('server'),'netease');assert.equal(u.searchParams.get('id'),'track-1');assert.equal(u.searchParams.get('type'),'lrc');
    assert.equal(u.searchParams.get('auth'),'exact');
    return {ok:true,text:async()=> '[00:01]same track'};
  },{times:[],until:0},['https://meting.test/api','https://fallback.test/api']);
  const resolved=await api.resolveLyrics(song);assert.equal(resolved.original,'[00:01]same track');assert.equal(calls.length,2);
});
test('lyric requests can use the full shared GD budget; artwork reservation does not fake a 40-request limit',async()=>{
  let calls=0;const api=lyrics(async()=>{calls++;return ok({lyric:'[00:01]available'});},{times:Array(40).fill(Date.now()),until:0});
  const result=await api.resolveLyrics(song);assert.equal(calls,1);assert.equal(result.original,'[00:01]available');
});
