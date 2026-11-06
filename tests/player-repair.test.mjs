import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const source=readFileSync(new URL('../纯音乐播放器.js',import.meta.url),'utf8');
function section(a,b){const start=source.indexOf(a),end=source.indexOf(b,start);assert.ok(start>=0&&end>start);return source.slice(start,end);}
const matching=section('function normalizeSongText','// Share the GD budget');
const urlHelpers=section('function getResponseUrl','async function gdCover');

test('GD URL payloads accept signed URLs, protocol-relative links, arrays and nested data',()=>{
  const get=new Function(`${urlHelpers};return getResponseUrl;`)();
  const signed='https://cdn.test/song.m4a?key=a%2Bb&sig=x=y';
  for(const value of [signed,{url:signed},{data:[{url:signed}]},[{data:{url:signed}}]])assert.equal(get(value),signed);
  assert.equal(get({data:{url:' //cdn.test/audio.mp3?x=1&amp;y=2 '}}),'https://cdn.test/audio.mp3?x=1&y=2');
  for(const value of [{url:''},{error:'unavailable'},'javascript:alert(1)','not audio'])assert.equal(get(value),'');
});
function jooxResolver(available){
  const calls=[],played=[];
  const api=new Function('gdJson','playUrl',`
    const GD_SOURCES=['netease','joox','bilibili'],GD_SOURCE_LABELS={joox:'JOOX'},isNotAllowed=e=>e.name==='NotAllowedError';
    ${matching};${urlHelpers};${section('function gdSong','async function searchSource')};
    ${section('async function resolveGdSourceTracks','async function gdMetadata')}
    return gdFallback;
  `)(async params=>{calls.push(params);return params.br===available?{data:[{url:'//cdn.test/joox.m4a?sign=unchanged',br:params.br}]}:{url:''};},async url=>played.push(url));
  return {api,calls,played};
}
test('JOOX empty 320k addresses fall through to 192k on the same selected ID',async()=>{
  const {api,calls,played}=jooxResolver('192');
  const song=await api({title:'夜曲',artist:'周杰倫',source:'joox',gdSource:'joox',mediaId:'J-exact',lyricId:'L-exact'},0,()=>true,new Set(),['joox']);
  assert.deepEqual(calls.map(x=>x.br),['320','192']);assert.ok(calls.every(x=>x.id==='J-exact'));assert.equal(song.mediaId,'J-exact');assert.equal(song.lyricId,'L-exact');assert.deepEqual(played,['https://cdn.test/joox.m4a?sign=unchanged']);
});
test('JOOX GD default quality is tried once after compressed quality links are empty',async()=>{
  const {api,calls}=jooxResolver('999');
  const song=await api({title:'夜曲',artist:'周杰倫',source:'joox',gdSource:'joox',mediaId:'J-exact'},0,()=>true,new Set(),['joox']);
  assert.equal(song.bitrate,'999');assert.deepEqual(calls.map(x=>x.br),['320','192','128','999']);
});

test('failed source resolution clears the priming media and loading state',()=>{
  const player={paused:false,src:'silent-ten-hours',pause(){this.paused=true;},removeAttribute(){this.src='';},load(){}};
  const repair=new Function('audio',`let cancelPlaybackProbe=()=>{},audioPriming=true,pendingPlaybackSelection=true,playbackWanted=true,playbackPhase='loading',lyricState='加载歌词…';const releaseOfflineObjectUrl=()=>{},updatePlayButton=()=>{},paintTime=()=>{},clearMediaPosition=()=>{};${section('function clearFailedPlayback','function recoverStuckPlayback')};return ()=>{clearFailedPlayback();return {audioPriming,pendingPlaybackSelection,playbackWanted,playbackPhase,lyricState};};`)(player);
  const state=repair();assert.equal(player.src,'');assert.equal(player.paused,true);assert.equal(state.playbackPhase,'idle');assert.equal(state.audioPriming,false);assert.equal(state.playbackWanted,false);assert.equal(state.lyricState,'尚未开始播放');
});

test('clearing caches aborts stale requests and cannot reset the shared GD quota or lose saved music',async()=>{
  const requests=[],offline=[],rate={times:Array(50).fill(Date.now()),until:Date.now()+300000},manual='https://manual.test/custom.mp3';
  const settings={favorites:[{title:'Saved',source:'joox',audio:'https://expired.test/file',customAudio:manual}],playlists:[{songs:[{title:'Playlist',source:'netease',audio:'https://expired.test/other'}]}],companionApiKey:'test-key',companionConversations:{keep:[{content:'keep'}]}};
  const api=new Function('ROOT','gdFetch','settings','offlineRequest',`
    const GD_API='https://music-api.gdstudio.xyz/api.php',gdRate=ROOT.__SELENE_GD_RATE__,lyricCache=new Map(),lyricRequests=new Map(),failedPlaybackUrls=new Set();
    let current=null,queue=[],results=[],searchRequest=0,safariBlobRetryUsed=false;const audioSession=null,DOC={querySelector:()=>null},ID='test',stopPlayback=()=>{},save=()=>{},paintTime=()=>{},setStatus=()=>{},toast=()=>{};
    ${section('const gdResponses=','async function gdFetch')};
    ${section('async function clearPlayerCaches','function resetPlayerDefaults')};
    return {gdJson,clearPlayerCaches,cache:gdResponses,pending:gdRequests};
  `)({AbortController,setTimeout,clearTimeout,__SELENE_GD_RATE__:rate},()=>new Promise(resolve=>requests.push(resolve)),settings,async(...args)=>offline.push(args));
  const params={types:'search',source:'netease',name:'Song'};
  const old=api.gdJson(params);await api.clearPlayerCaches();const fresh=api.gdJson(params);
  requests[0]({ok:true,json:async()=>['stale']});await old;assert.equal(api.cache.size,0);assert.equal(api.pending.size,1);
  requests[1]({ok:true,json:async()=>['fresh']});await fresh;assert.deepEqual([...api.cache.values()][0].value,['fresh']);
  assert.equal(rate.times.length,50);assert.ok(rate.until>Date.now());assert.deepEqual(offline,[['readwrite','clear']]);
  assert.equal(settings.favorites[0].audio,'');assert.equal(settings.favorites[0].customAudio,manual);assert.equal(settings.playlists[0].songs[0].audio,'');assert.equal(settings.companionApiKey,'test-key');assert.equal(settings.companionConversations.keep[0].content,'keep');
});


test('GD extra_data duration participates in strict version and lyric matching',()=>{
  const duration=new Function(`${matching};return songDuration;`)();
  assert.equal(duration({extra_data:{duration:226}}),226);
});
