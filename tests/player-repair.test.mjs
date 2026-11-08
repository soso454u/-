import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const source=readFileSync(new URL('../纯音乐播放器.js',import.meta.url),'utf8');
function section(a,b){const start=source.indexOf(a),end=source.indexOf(b,start);assert.ok(start>=0&&end>start);return source.slice(start,end);}
const matching=section('function normalizeSongText','// Share upstream cooldown');
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
  assert.equal(song.bitrate,'999');assert.deepEqual(calls.map(x=>x.br),['320','192','128','740','999']);
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
    const GD_API='https://music-api.gdstudio.xyz/api.php',gdRate=ROOT.__SELENE_GD_RATE__,lyricCache=new Map(),lyricRequests=new Map(),coverResponses=new Map(),coverRequests=new Map(),failedPlaybackUrls=new Set();
    let current=null,queue=[],results=[],searchRequest=0,safariBlobRetryUsed=false,resultCoverObserver=null;const audioSession=null,DOC={querySelector:()=>null},ID='test',stopPlayback=()=>{},save=()=>{},paintTime=()=>{},setStatus=()=>{},toast=()=>{};
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

test('playback defaults to automatic fallback independently of search; per-song overrides remain exclusive',()=>{
  const {order,choices}=new Function(`const GD_SOURCES=['netease','joox','bilibili'],playbackSources=new WeakMap(),settings={searchSource:'joox'};${urlHelpers};return {order:song=>playbackSourceOrder(song,playbackSourceChoice(song)),choices:playbackSources};`)();
  const song={source:'joox'};
  assert.deepEqual(order(song),['joox','netease','bilibili']);
  assert.deepEqual(order({source:'netease'}),['netease','joox','bilibili']);
  choices.set(song,'joox');assert.deepEqual(order(song),['joox']);
  choices.set(song,'netease');assert.deepEqual(order(song),['netease']);
  choices.set(song,'auto');assert.deepEqual(order(song),['joox','netease','bilibili']);
});
test('GD opaque track IDs are preserved verbatim and deprecated url_id never replaces them',async()=>{
  const id='joox:opaque+/==#',calls=[];
  const resolve=new Function('gdJson',`${matching};${urlHelpers};${section('function gdSong','async function searchSource')};${section('async function resolveGdSourceTracks','async function resolveGdSourceTrack(')};return resolveGdSourceTracks;`)(async params=>{calls.push(params);return {url:'https://cdn.test/track.mp3'};});
  const track=(await resolve({source:'joox',gdSource:'joox',mediaId:id,id:`joox:${id}`,title:'夜曲',artist:'周杰倫',url_id:'obsolete-id',lyricId:'separate-lyric'},'joox',false))[0];
  assert.equal(calls[0].source,'joox');assert.equal(calls[0].id,id);assert.equal(track.mediaId,id);assert.equal(track.lyricId,'separate-lyric');
});
test('manual JOOX playback cannot fall through to Bilibili and identifies its own empty URL failure',async()=>{
  const calls=[];
  const fallback=new Function('resolveGdSourceTracks',`const GD_SOURCES=['netease','joox','bilibili'],GD_SOURCE_LABELS={joox:'JOOX',netease:'网易云',bilibili:'哔哩哔哩'},isNotAllowed=()=>false;${urlHelpers};${section('async function gdFallback','async function gdMetadata')};return song=>gdFallback(song,0,()=>true,new Set(),playbackSourceOrder(song,'joox'));`)(async(_,source)=>{calls.push(source);const tracks=[];tracks.reason='empty-url';return tracks;});
  await assert.rejects(fallback({source:'joox'}),error=>/JOOX.*未返回播放地址/.test(error.message)&&!/哔哩哔哩/.test(error.message));
  assert.deepEqual([...new Set(calls)],['joox']);assert.equal(calls.length,5);
});
test('a final Bilibili miss cannot overwrite an earlier JOOX playback error',async()=>{
  const calls=[];
  const fallback=new Function('resolveGdSourceTracks','playUrl',`const GD_SOURCES=['netease','joox','bilibili'],GD_SOURCE_LABELS={joox:'JOOX',netease:'网易云',bilibili:'哔哩哔哩'},isNotAllowed=()=>false,songDuration=()=>0;${urlHelpers};${section('async function gdFallback','async function gdMetadata')};return gdFallback;`)(async(_,source)=>{calls.push(source);if(source==='joox')return [{audio:'https://cdn.test/bad.mp3',source}];const tracks=[];tracks.reason='no-match';return tracks;},async()=>{throw Error('音频格式无法解码');});
  await assert.rejects(fallback({source:'joox'}),error=>{
    assert.match(error.message,/^JOOX：音频格式无法解码/);assert.match(error.message,/哔哩哔哩：未找到同歌手/);assert.deepEqual(error.failures.map(x=>x.source),['joox','netease','bilibili']);return true;
  });
  assert.equal(calls[0],'joox');assert.equal(calls.filter(x=>x==='bilibili').length,1,'a missing identity stops quality requests for that source');
});

test('artist aliases and collaborator formatting are tolerant while identity remains explicit',()=>{
  const api=new Function(`${matching};return {scoreSongHit,scoreLyricHit,getSongArtist};`)();
  const song={title:'夜曲',artist:'周杰伦',duration:226,album:'十一月的萧邦'};
  for(const artist of ['周杰倫 (Jay Chou)','Jay Chou（周杰倫）','周杰倫 / Jay Chou','周杰倫 Jay Chou'])assert.ok(Number.isFinite(api.scoreSongHit({...song,artist},song)),artist);
  assert.equal(api.getSongArtist({singer:{name:'周杰倫'}}),'周杰倫');
  assert.ok(Number.isFinite(api.scoreSongHit({...song,artist:'周杰倫 + 合作歌手',duration:230},song)));
  for(const artist of ['周杰伦翻唱团','翻唱者','Jay Chou Tribute','周杰倫 (Cover)','Cover (周杰伦)'])assert.equal(api.scoreSongHit({...song,artist},song),-Infinity);
  assert.equal(api.scoreSongHit({...song,artist:'周杰倫/合作歌手',duration:0},song),-Infinity,'additional credits need duration evidence');
  assert.equal(api.scoreLyricHit({...song,artist:'周杰倫/合作歌手'},song),-Infinity,'audio tolerance does not mix cross-version lyrics');
  assert.equal(api.scoreLyricHit({...song,duration:235},song),-Infinity);
});

test('a dead selected JOOX record tries another matched release before leaving JOOX',async()=>{
  const calls=[],played=[];
  const fallback=new Function('gdJson','playUrl',`const GD_SOURCES=['netease','joox','bilibili'],GD_SOURCE_LABELS={joox:'JOOX'},isNotAllowed=()=>false;${matching};${urlHelpers};${section('function gdSong','async function searchSource')};${section('async function resolveGdSourceTracks','async function gdMetadata')};return gdFallback;`)(async params=>{
    calls.push(params);
    if(params.types==='search')return [
      {id:'wrong',name:'夜曲',artist:['翻唱者']},
      {id:'dead',name:'夜曲',artist:['周杰倫'],lyric_id:'old-lyrics'},
      {id:'working',name:'夜曲',artist:['周杰倫 (Jay Chou)'],lyric_id:'new-lyrics',pic_id:'new-cover'}
    ];
    return {url:params.id==='working'?'https://cdn.test/working.mp3':''};
  },async url=>played.push(url));
  const song=await fallback({title:'夜曲',artist:'周杰倫',source:'joox',gdSource:'joox',mediaId:'dead'},0,()=>true,new Set(),['joox']);
  assert.equal(song.mediaId,'working');assert.equal(song.lyricId,'new-lyrics');assert.equal(song.coverId,'new-cover');
  assert.ok(calls.every(call=>call.source==='joox'));assert.ok(calls.length<=9);assert.deepEqual(played,['https://cdn.test/working.mp3']);
});

test('JOOX caps unavailable releases to three identities and sixteen URL requests',async()=>{
  const ids=[];
  const fallback=new Function('gdJson','playUrl',`const GD_SOURCES=['joox'],GD_SOURCE_LABELS={joox:'JOOX'},isNotAllowed=()=>false;${matching};${urlHelpers};${section('function gdSong','async function searchSource')};${section('async function resolveGdSourceTracks','async function gdMetadata')};return gdFallback;`)(async params=>{
    if(params.types==='search')return Array.from({length:10},(_,i)=>({id:String(i),name:'夜曲',artist:['周杰倫']}));
    ids.push(params.id);return {url:''};
  },async()=>assert.fail('empty URLs cannot be played'));
  await assert.rejects(fallback({title:'夜曲',artist:'周杰倫',source:'joox',gdSource:'joox',mediaId:'0'}),/JOOX/);
  assert.deepEqual([...new Set(ids)],['0','1','2']);assert.equal(ids.length,16,'five qualities per identity plus one source-wide refresh');
});

test('an API transport error does not fan out into more qualities of the same provider',async()=>{
  let calls=0;
  const fallback=new Function('resolveGdSourceTracks',`const GD_SOURCES=['joox'],GD_SOURCE_LABELS={joox:'JOOX'};${urlHelpers};${section('async function gdFallback','async function gdMetadata')};return gdFallback;`)(async()=>{calls++;throw Error('HTTP 403');});
  await assert.rejects(fallback({source:'joox'}),/JOOX：HTTP 403/);assert.equal(calls,1);
});

test('empty playback URL responses are not cached between settled requests',async()=>{
  let now=10000,calls=0;
  const get=new Function('ROOT','gdFetch','Date',`const GD_API='https://music-api.gdstudio.xyz/api.php',gdRate={times:[],until:0};${urlHelpers};${section('const gdResponses=','async function gdFetch')};return gdJson;`)({AbortController,setTimeout,clearTimeout},async()=>{calls++;return {ok:true,json:async()=>({url:''})};},{now:()=>now});
  const params={types:'url',source:'joox',id:'same',br:'320'};
  await get(params);await get(params);assert.equal(calls,2);now+=3001;await get(params);assert.equal(calls,3);
});

test('broken platform artwork uses verified backup artwork without altering track or lyric IDs',async()=>{
  const song={title:'夜曲',artist:'周杰伦',album:'十一月的萧邦',duration:226,source:'joox',mediaId:'J',lyricId:'L',cover:'https://broken.test/old.jpg'},calls=[];
  const resolve=new Function('gdCover','coverSearch','imageLoads',`${matching};${urlHelpers};const METING_METADATA_APIS=['https://backup.test/api'];${section('function metingSearchUrl','async function coverSearch')};${section('async function metingCover','function imageLoads')};${section('async function resolveCover','async function applyCurrentCover')};return resolveCover;`)(async()=>{calls.push('gd');return 'https://broken.test/gd.jpg';},async()=>[
    {name:'夜曲',artist:'翻唱者',album:song.album,pic:'https://good.test/wrong-artist.jpg'},
    {name:'夜曲',artist:'周杰倫',album:'不同专辑',pic:'https://good.test/wrong-album.jpg'},
    {name:'夜曲 (Live)',artist:'周杰倫',album:song.album,pic:'https://good.test/live.jpg'},
    {name:'夜曲',artist:'周杰倫 (Jay Chou)',album:song.album,pic:'https://good.test/original.jpg'}
  ],async url=>url.startsWith('https://good.test/'));
  assert.equal(await resolve(song),'https://good.test/original.jpg');assert.equal(song.mediaId,'J');assert.equal(song.lyricId,'L');assert.equal(song.cover,'https://broken.test/old.jpg');assert.deepEqual(calls,[]);
});

test('healthy artwork avoids all backup requests and failed backup searches are deduplicated',async()=>{
  const resolve=new Function('imageLoads','gdCover','metingCover',`${section('async function resolveCover','async function applyCurrentCover')};return resolveCover;`)(async()=>true,()=>assert.fail('unnecessary GD call'),()=>assert.fail('unnecessary backup call'));
  assert.equal(await resolve({cover:'https://good.test/cover.jpg'}),'https://good.test/cover.jpg');
  let calls=0;
  const search=new Function('ROOT','fetch',`let dataCacheGeneration=0;const coverResponses=new Map(),coverRequests=new Map(),dataRequestControllers=new Set();${section('async function coverSearch','async function metingCover')};return coverSearch;`)({AbortController,setTimeout,clearTimeout},async()=>{calls++;return {ok:false,status:503};});
  await Promise.all([search('https://backup.test/api'),search('https://backup.test/api')]);await search('https://backup.test/api');assert.equal(calls,1);
});
