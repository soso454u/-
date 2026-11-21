import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const source=readFileSync(new URL('../纯音乐播放器.js',import.meta.url),'utf8');
function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a);return source.slice(a,b);}
function harness(resolve=async()=>({original:'',translation:''})){
  const events=[],painted=[],audio={duration:180,currentTime:0};
  let api;
  const ROOT={CustomEvent:class{constructor(type,{detail}){this.type=type;this.detail=detail;}},dispatchEvent(event){events.push({...event,snapshot:api?.getLyricsState()});}};
  const DOC={getElementById:()=>null,querySelector:()=>null};
  api=new Function('ROOT','DOC','audio','resolve','painted',`
    const ID='test';let playbackPublicReady=true,disposed=false,current=null,playRequest=0,
      lyricState='暂无歌词',lyricTimeline=[],currentLyricWords='',lyricsRevision=0,lastLyricsStateKey='',lastLyricsTimeline=null;
    DOC.getElementById=id=>id===ID?{}:null;
    const emitPlaybackOptionsState=()=>{};const isVideoEntry=s=>s.source==='bilibili-video',songDuration=s=>s.duration||0,
      resolveLyrics=resolve,s01sLyrics=new WeakMap(),paintTime=()=>painted.push(currentLyricWords),
      updateCurrentFavorite=()=>{},clearMediaPosition=()=>{},updateMediaMetadata=()=>{},
      trackCompanionListeningTime=()=>{},pauseKeepAliveForTrack=()=>{},settings={};
    let companionListeningAwaitingPlay=false,keepAliveSuspendedForTrack=false;
    const console={warn(){}};
    ${section('function lrcTime','function songDuration')}
    ${section('  // Lyrics protocol v1','  // Read only the existing main-track runtime')}
    ${section('  function show(s,','  const clock =').replace('const e=DOC.getElementById(ID);','const e=null;')}
    ${section('  async function loadLyrics','  const LX_SOURCES=')}
    return {getLyricsState,emitLyricsState,resetLyrics,
      select(song,message){++playRequest;show(song,message);},
      load:()=>loadLyrics(current,playRequest),mutate:values=>Object.assign(current,values),
      cancel:()=>++playRequest,
      unload(){disposed=true;resetLyrics();playbackPublicReady=false;},
      internal:()=>({lyricTimeline,currentLyricWords}),
      highlight(text){currentLyricWords=text;paintTime();},
    };
  `)(ROOT,DOC,audio,resolve,painted);
  return {...api,events,painted,audio};
}
const song=id=>({id:`netease:${id}`,source:'netease',mediaId:String(id)});
const defer=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};

test('exposes the merged multiline timeline and genuine word timing as independent copies',async()=>{
  const api=harness(async()=>({original:'[00:12.5]<00:12.5>原文<00:13.2>\n[00:12.5]第二行\n[00:20]普通歌词\n[00:25]',translation:'[00:12.5]翻译'}));
  assert.deepEqual(api.getLyricsState(),{protocolVersion:1,loaded:true,trackId:'',revision:0,status:'idle',message:'暂无歌词',lines:[]});
  api.select(song(1));await api.load();
  const state=api.getLyricsState();
  assert.equal(state.status,'ready');assert.equal(state.trackId,'netease:1');assert.equal(state.message,'');
  assert.deepEqual(state.lines,[
    {time:12.5,lines:['原文','第二行','翻译'],wordTimes:[{text:'原文',start:12.5,end:13.2}]},
    {time:20,lines:['普通歌词']},{time:25,lines:[]},
  ]);
  state.lines[0].lines.push('外部修改');state.lines[0].wordTimes[0].start=999;state.lines.pop();
  assert.deepEqual(api.getLyricsState().lines,api.internal().lyricTimeline);
  for(const event of api.events){assert.equal(event.type,'selene-music-lyrics-state');assert.equal('lines'in event.detail,false);assert.equal(event.detail.revision,event.snapshot.revision);}
  const revision=api.getLyricsState().revision,count=api.events.length;
  for(let i=0;i<10;i++){api.audio.currentTime=i;api.highlight('当前高亮');api.emitLyricsState();api.getLyricsState();}
  assert.equal(api.events.length,count);assert.equal(api.getLyricsState().revision,revision);
});

test('reports loading, instrumental, unavailable, rate limits and failures without placeholder lyrics',async()=>{
  for(const [result,status,message] of [
    [{original:'',translation:''},'unavailable','暂无歌词'],
    [{original:'[00:00]纯音乐，请欣赏',translation:'',instrumental:true},'instrumental','纯音乐 · 请欣赏'],
    [Object.assign(Error('429'),{retryAt:123}),'error','歌词请求限流，请稍后再试'],
    [Error('offline'),'error','歌词暂时加载失败'],
  ]){
    const pending=defer(),api=harness(()=>pending.promise);api.select(song(1));const load=api.load();
    assert.equal(api.getLyricsState().status,'loading');assert.equal(api.getLyricsState().message,'加载歌词…');
    if(result instanceof Error)pending.reject(result);else pending.resolve(result);
    await load;const state=api.getLyricsState();
    assert.equal(state.status,status);assert.equal(state.message,message);assert.deepEqual(state.lines,[]);
    assert.equal(api.events.at(-1).detail.status,status);
  }
  for(const track of [{id:'direct:1',source:'direct'},{id:'video:1',source:'bilibili-video'}]){
    const api=harness();api.select(track,'暂无歌词');assert.equal(api.getLyricsState().status,'unavailable');assert.deepEqual(api.getLyricsState().lines,[]);
  }
});

test('switching clears lyrics before notifications and rejects old results and errors, including A→B→A',async()=>{
  for(const rejectOld of [false,true]){
    const pending=[],api=harness(()=>{const p=defer();pending.push(p);return p.promise;}),a=song(1),b=song(2);
    api.select(a);const old=api.load();api.select(b);const next=api.load();
    pending[1].resolve({original:'[00:01]新歌',translation:''});await next;
    api.select(a);assert.deepEqual(api.getLyricsState().lines,[]);assert.equal(api.internal().currentLyricWords,'');
    assert.equal(api.events.at(-1).snapshot.trackId,a.id);assert.deepEqual(api.events.at(-1).snapshot.lines,[]);
    const count=api.events.length;
    if(rejectOld)pending[0].reject(Error('old failure'));else pending[0].resolve({original:'[00:01]旧歌',translation:''});
    await old;assert.equal(api.events.length,count);assert.deepEqual(api.getLyricsState().lines,[]);
    const revisions=api.events.map(e=>e.detail.revision);assert.deepEqual(revisions,revisions.map((_,i)=>i+1));
  }
});

test('canceled requests, mutated sources and unloading cannot publish stale lyrics',async()=>{
  for(const stop of ['cancel','mutate','unload']){
    const pending=defer(),api=harness(()=>pending.promise);api.select(song(1));const load=api.load();
    if(stop==='mutate')api.mutate({source:'joox',mediaId:'new'});else api[stop]();
    const count=api.events.length;
    pending.resolve({original:'[00:01]过期',translation:''});await load;
    assert.equal(api.events.length,count);assert.deepEqual(api.getLyricsState().lines,[]);
    if(stop==='unload'){
      assert.deepEqual(api.getLyricsState(),{protocolVersion:1,loaded:false,trackId:'',revision:api.events.at(-1).detail.revision,status:'idle',message:'',lines:[]});
      assert.equal(api.events.at(-1).detail.loaded,false);
    }
  }
});
