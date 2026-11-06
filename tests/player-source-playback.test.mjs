import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source=readFileSync(new URL('../纯音乐播放器.js',import.meta.url),'utf8');
function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a);return source.slice(a,b);}
const matching=section('function normalizeSongText','// Share the GD budget');
function matcher(){return new Function(`${matching};${section('function querySongHits','async function search(word')};return {scoreSongHit,bestSongHit,querySongHits,rankSearchResults,normalizeSongText};`)();}
const jay={title:'七里香',artist:'周杰伦',duration:299,album:'七里香'};

test('explicit singers reject covers and substring identities; known Jay aliases match',()=>{
  const api=matcher();
  for(const artist of ['翻唱者','周杰伦翻唱团','周杰','周杰伦/翻唱者',''])assert.equal(api.scoreSongHit({...jay,artist},jay),-Infinity);
  for(const artist of ['周杰倫','Jay Chou'])assert.ok(Number.isFinite(api.scoreSongHit({...jay,artist},jay)));
  assert.equal(api.querySongHits([{...jay,artist:'翻唱者'}],'七里香 周杰伦').length,0);
  assert.equal(api.querySongHits([{...jay,artist:'周杰倫'}],'七里香 周杰伦').length,1);
});

test('version, album version and available duration evidence constrain candidates',()=>{
  const api=matcher();
  for(const song of [{...jay,version:'DJ'},{...jay,album:'Live演唱会'},{...jay,title:'七里香 (伴奏)'},{...jay,duration:230}])assert.equal(api.scoreSongHit(song,jay),-Infinity);
  for(const version of ['Live','Cover','Remix']){
    const requested={...jay,title:`七里香 (${version})`};
    assert.ok(Number.isFinite(api.scoreSongHit({...requested},requested)));
    assert.equal(api.querySongHits([requested],`${requested.title} 周杰伦`).length,1);
  }
  assert.equal(api.bestSongHit([{...jay,id:1,album:'精选'},{...jay,id:2}],jay).id,2);
});

function searchHarness(responses,settings={}){
  const calls=[],api=matcher();let played;
  const search=new Function('GD_SOURCES','searchSource','querySongHits','play','DOC','ROOT','render','setStatus','toast','hydrateResultCovers','settings','rankSearchResults','normalizeSongText',`
    let searchRequest=0,disposed=false,results=[];const ID='test';
    ${section('async function search(word','async function hydrateResultCovers')}
    return {search,results:()=>results};
  `)(['netease','joox','bilibili'],async(source,word)=>{calls.push(source);return responses[source]||[];},api.querySongHits,async song=>{played=song;},{querySelector:()=>null},{setTimeout:()=>{}},()=>{},()=>{},()=>{},()=>{},settings,api.rankSearchResults,api.normalizeSongText);
  return {...search,calls,played:()=>played};
}
test('search stops at correct Netease result; wrong singer falls through to JOOX',async()=>{
  const first=searchHarness({netease:[{...jay,source:'netease'}],joox:[jay]});
  await first.search('七里香 周杰伦',true);assert.deepEqual(first.calls,['netease']);
  const fallback=searchHarness({netease:[{...jay,artist:'翻唱者'}],joox:[{...jay,source:'joox'}]});
  await fallback.search('七里香 周杰伦',true);assert.deepEqual(fallback.calls,['netease','joox']);assert.equal(fallback.played().source,'joox');
});

test('manual artist-only search displays the provider song list without requiring a title',async()=>{
  const songs=[{...jay,title:'七里香'},{...jay,title:'晴天'},{...jay,title:'稻香 (Live)'}];
  const api=searchHarness({netease:songs});
  await api.search('周杰伦');assert.deepEqual(api.results(),songs);assert.deepEqual(api.calls,['netease','joox','bilibili']);assert.equal(api.played(),undefined);
});
test('manual partial or remembered titles retain relevant provider candidates and alternate versions',async()=>{
  const songs=[{title:'今天你要嫁给我',artist:'陶喆/蔡依林'},{title:'今天我要嫁给你',artist:'冯小慈'},{title:'今天你要嫁给我 (Live)',artist:'陶喆/蔡依林'}];
  for(const query of ['今天你就要嫁给我','今天我要','嫁给我']){
    const api=searchHarness({netease:songs});await api.search(query);assert.deepEqual(api.results(),songs);assert.equal(api.played(),undefined);
  }
});
test('empty manual results fall back sequentially; structured automatic picks remain strict',async()=>{
  const songs=[{...jay,source:'joox'}];
  const manual=searchHarness({joox:songs});await manual.search('周杰伦');assert.deepEqual(manual.calls,['netease','joox','bilibili']);assert.deepEqual(manual.results(),songs);
  const auto=searchHarness({netease:[{...jay,artist:'翻唱者'}],joox:songs});
  await auto.search('七里香 周杰伦',true,true,'',false,jay);assert.deepEqual(auto.calls,['netease','joox']);assert.equal(auto.played().artist,'周杰伦');
});

function resolver(){
  const calls=[];
  const resolve=new Function('gdJson',`${matching};${section('function gdSong','async function searchSource')};${section('async function resolveGdSourceTracks','async function resolveGdSourceTrack(')};const getResponseUrl=x=>x.url;return resolveGdSourceTracks;`)(async params=>{
    calls.push(params);
    return params.types==='search'?[{id:'J-7',name:'七里香',artist:['周杰倫'],album:'七里香',duration:299,pic_id:'cover-J',lyric_id:'lyric-J'}]:{url:'https://cdn.test/J.mp3'};
  });
  return {resolve,calls};
}
test('source changes replace IDs, cover and lyrics together; one quality requested on demand',async()=>{
  const api=resolver(),tracks=await api.resolve({...jay,source:'netease',mediaId:'N-1',cover:'https://old.test/N.jpg',lyricId:'lyric-N'},'joox',false);
  const track=tracks[0];assert.equal(track.id,'joox:J-7');assert.equal(track.mediaId,'J-7');assert.equal(track.gdLyricId,'lyric-J');assert.equal(track.lyricId,'lyric-J');assert.equal(track.coverId,'cover-J');assert.equal(track.cover,'');assert.equal(track.artist,'周杰倫');
  assert.deepEqual(api.calls.map(x=>x.types),['search','url']);assert.equal(api.calls[1].br,'320');
});

class FakeAudio extends EventTarget{
  currentTime=0;paused=true;readyState=4;duration=299;src='';currentSrc='';ended=false;seeking=false;error=null;loads=0;
  load(){this.loads++;this.currentTime=0;}
  play(){this.paused=false;this.currentSrc=this.src;return this.denial?Promise.reject(this.denial):Promise.resolve();}
  pause(){this.paused=true;}
  emit(event){this.dispatchEvent(new Event(event));}
}
function playback(){
  const player=new FakeAudio(),doc=new EventTarget(),callbacks=new Map(),statuses=[],recoveries=[];doc.visibilityState='visible';
  let now=0,next=0;
  const ROOT={Audio:FakeAudio,setInterval:cb=>{callbacks.set(++next,cb);return next;},clearInterval:id=>callbacks.delete(id)};
  const api=new Function('ROOT','DOC','audio','Date','setStatus','recoverStuckPlayback','releaseOfflineObjectUrl','updatePlayButton','console',`
    let cancelPlaybackProbe=null,audioPriming=false,playbackPhase='idle',companionListeningAwaitingPlay=true;
    const failedPlaybackUrls=new Set(),isNotAllowed=e=>e.name==='NotAllowedError',mediaText=()=> '解码错误';
    ${section('function playUrl(','async function resolveGdSourceTracks')}
    return {playUrl,cancel:()=>cancelPlaybackProbe?.(),phase:()=>playbackPhase,failed:()=>failedPlaybackUrls};
  `)(ROOT,doc,player,{now:()=>now},x=>statuses.push(x),(error,url)=>recoveries.push({error,url}),()=>{},()=>{},{info(){}});
  return {...api,player,doc,statuses,recoveries,tick(ms=250,time=player.currentTime){now+=ms;player.currentTime=time;for(const cb of [...callbacks.values()])cb();},timers:callbacks};
}
async function flush(){await Promise.resolve();await Promise.resolve();}
test('play promise, metadata and playing cannot certify a frozen Safari clock',async()=>{
  const api=playback();let success=false;
  const pending=api.playUrl('https://cdn.test/track.mp3').then(()=>success=true);
  api.player.emit('loadedmetadata');api.player.emit('playing');await flush();assert.equal(success,false);
  api.tick(250,.1);await flush();assert.equal(success,false);
  api.tick(250,.4);await pending;assert.equal(api.phase(),'playing');api.cancel();assert.equal(api.timers.size,0);
});
test('brief waiting recovers, sustained stall fails once, including after playback starts',async()=>{
  const api=playback(),pending=api.playUrl('https://cdn.test/track.mp3');
  api.tick(250,.25);api.tick(250,.5);await pending;
  api.player.emit('waiting');api.tick(5000,.5);assert.equal(api.recoveries.length,0);assert.equal(api.phase(),'loading');
  api.tick(250,.75);api.tick(250,1);assert.equal(api.phase(),'playing');
  api.player.emit('stalled');api.tick(20001,1);assert.equal(api.recoveries.length,1);api.tick(30000,1);assert.equal(api.recoveries.length,1);assert.equal(api.timers.size,0);
});
test('frozen startup rejects after grace; pause/cancel and autoplay denial do not fall through',async()=>{
  const api=playback(),pending=api.playUrl('https://cdn.test/track.mp3');
  api.tick(20001,0);await assert.rejects(pending,/无播放进度/);assert.equal(api.recoveries.length,0);
  const paused=playback(),cancelled=paused.playUrl('https://cdn.test/track.mp3');paused.cancel();await assert.rejects(cancelled,{name:'AbortError'});assert.equal(paused.timers.size,0);
  const denied=playback();denied.player.denial=Object.assign(Error('tap required'),{name:'NotAllowedError'});
  await assert.rejects(denied.playUrl('https://cdn.test/track.mp3'),{name:'NotAllowedError'});assert.equal(denied.failed().size,0);assert.equal(denied.timers.size,0);
});
test('resume keeps source/time intact; seeks and hidden timer throttling cannot fake playback or a stall',async()=>{
  const api=playback();api.player.src='https://cdn.test/track.mp3';api.player.currentTime=40;
  const pending=api.playUrl(api.player.src,'继续',false,{resume:true});assert.equal(api.player.loads,0);assert.equal(api.player.currentTime,40);
  api.player.emit('seeking');api.tick(250,100);api.player.emit('seeked');api.tick(250,100.25);api.tick(250,100.5);await pending;
  api.doc.visibilityState='hidden';api.tick(600000,100.5);assert.equal(api.recoveries.length,0);
  api.doc.visibilityState='visible';api.doc.dispatchEvent(new Event('visibilitychange'));api.tick(250,100.75);assert.equal(api.recoveries.length,0);api.cancel();
});
test('media errors are terminal for one candidate and leave no watchdog behind',async()=>{
  const api=playback(),pending=api.playUrl('https://cdn.test/bad.flac');api.player.error={code:3};api.player.emit('error');await assert.rejects(pending,/解码/);assert.equal(api.timers.size,0);
});

test('GD identical search requests share in-flight work and reuse the bounded cache',async()=>{
  let calls=0;
  const api=new Function('ROOT','gdFetch',`const GD_API='https://music-api.gdstudio.xyz/api.php';${section('const gdResponses=','async function gdFetch')}return gdJson;`)({AbortController,setTimeout,clearTimeout},async()=>{calls++;await Promise.resolve();return {ok:true,json:async()=>[{id:1}]};});
  await Promise.all([api({types:'search',source:'netease',name:'七里香'}),api({types:'search',source:'netease',name:'七里香'})]);
  await api({types:'search',source:'netease',name:'七里香'});assert.equal(calls,1);
});

test('explicit versions match version metadata and equivalent Live notation without filtering them out',()=>{
  const api=matcher(),requested={title:'七里香 (Live)',artist:'周杰伦'};
  const found={title:'七里香',artist:'周杰伦',version:'Live'};
  assert.equal(api.querySongHits([found],'七里香 Live 周杰伦').length,1);
  assert.ok(Number.isFinite(api.scoreSongHit({...found,title:'七里香 (现场)'},requested)));
  assert.equal(api.querySongHits([found],'七里香 周杰伦').length,0);
});
test('a short preview with correct metadata is rejected using the actual audio duration',async()=>{
  const api=playback(),pending=api.playUrl('https://cdn.test/preview.mp3','预览',false,{expectedDuration:299});
  api.player.duration=30;api.tick(250,.25);await assert.rejects(pending,/时长/);assert.equal(api.timers.size,0);
});
test('Safari gesture priming calls play synchronously on the same main audio element',async()=>{
  const player=new FakeAudio();let called=false;
  player.play=()=>{called=true;return Promise.resolve();};
  const prime=new Function('ROOT','audio','ensureKeepAliveUrl',`let disposed=false,audioPriming=false,playbackPhase='idle';${section('function primeAudioFromGesture','function recoverStuckPlayback')};return primeAudioFromGesture;`)({navigator:{userActivation:{isActive:true}}},player,()=> 'blob:silent');
  prime();assert.equal(called,true);assert.equal(player.src,'blob:silent');assert.equal(player.muted,false);await flush();assert.equal(player.paused,true);
});
test('post-start recovery is bounded to one source-resolution pass per user selection',()=>{
  let resolutions=0,pauses=0;const statuses=[];
  const recover=new Function('play','audio','setStatus',`let disposed=false,playbackWanted=true,current={title:'七里香'},playbackRecoveryCount=0,playbackPhase='playing';const failedPlaybackUrls=new Set(),updatePlayButton=()=>{},mediaDetail=e=>e.message;${section('function recoverStuckPlayback','function playUrl(')};return recoverStuckPlayback;`)(()=>resolutions++,{pause:()=>pauses++},x=>statuses.push(x));
  recover(Error('卡住'),'one');recover(Error('再次卡住'),'two');recover(Error('旧事件'),'one');assert.equal(resolutions,1);assert.equal(pauses,1);
});

test('late result artwork cannot overwrite the identity of a track that switched source',async()=>{
  const song={...jay,source:'netease',mediaId:'N-1',cover:''},rows=[song];let complete;
  const hydrate=new Function('rows','gdCover',`let results=rows;const coverDelay=async()=>{},render=()=>{};${section('async function hydrateResultCovers','function render(')};return hydrateResultCovers;`)(rows,()=>new Promise(resolve=>complete=resolve));
  const pending=hydrate(rows);Object.assign(song,{source:'joox',mediaId:'J-7',cover:''});complete('https://old.test/N.jpg');await pending;assert.equal(song.cover,'');
});
test('resuming a cancelled selection resolves that selection instead of playing an older source',async()=>{
  const calls=[];
  const resume=new Function('play',`let current={title:'new selection'},playbackWanted=false,pendingPlaybackSelection=true,audioPriming=false;const audio={error:null,currentSrc:'https://old.test/track.mp3',src:'https://old.test/track.mp3'},syncKeepAliveWithPlayback=()=>{},applyAudioSessionMode=()=>{},pauseKeepAliveForTrack=()=>{},updateMediaMetadata=()=>{};${section('async function resumeMainAudioFromMediaSession','function setupMediaSession')};return resumeMainAudioFromMediaSession;`)(async song=>calls.push(song.title));
  await resume();assert.deepEqual(calls,['new selection']);
});

test('manual source selection queries only the chosen provider',async()=>{
  const joox={...jay,id:'joox:J7',source:'joox'},api=searchHarness({netease:[jay],joox:[joox]},{searchSource:'joox'});
  await api.search('周杰伦夜曲');assert.deepEqual(api.calls,['joox']);assert.deepEqual(api.results(),[joox]);
});
test('Netease covers do not hide a requested singer on JOOX; fuzzy candidates remain visible',async()=>{
  const cover={title:'夜曲',artist:'翻唱歌手',id:'netease:N1',source:'netease'},original={title:'夜曲',artist:'周杰倫',id:'joox:J1',source:'joox'};
  const api=searchHarness({netease:[cover],joox:[original]});await api.search('周杰伦夜曲');
  assert.deepEqual(api.calls,['netease','joox']);assert.deepEqual(api.results(),[original,cover]);assert.equal(api.played(),undefined);
});
test('title-only discovery includes later sources without guessing who the original singer is',async()=>{
  const cover={title:'夜曲',artist:'翻唱歌手',id:'N1',source:'netease'},other={title:'夜曲',artist:'周杰伦',id:'J1',source:'joox'};
  const api=searchHarness({netease:[cover],joox:[other]});await api.search('夜曲');
  assert.deepEqual(api.calls,['netease','joox','bilibili']);assert.deepEqual(api.results(),[cover,other]);
});
