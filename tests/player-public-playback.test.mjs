import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source=readFileSync(new URL('../纯音乐播放器.js',import.meta.url),'utf8');
const section=(start,end)=>{const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a);return source.slice(a,b);};
function harness(){
  const events=[],calls=[],audio={paused:true,ended:false,error:null,readyState:4,currentTime:12,duration:180,playbackRate:1,pause(){this.paused=true;calls.push('pause');}};
  const ROOT={CustomEvent:class{constructor(type,{detail}){this.type=type;this.detail=detail;}},dispatchEvent:event=>events.push(event)};
  const DOC={getElementById:()=>({}),querySelector:()=>({getAttribute:()=> 'https://cdn.test/cover.jpg'})};
  const api=new Function('ROOT','DOC','audio','calls',`
    const ID='qa';let playbackPublicReady=true,lastPlaybackStateKey='',disposed=false,current=null,
      audioPriming=false,pendingPlaybackSelection=false,resumePoint=null,playbackWanted=false,playbackPhase='idle',playRequest=0;
    const cancelPlaybackProbe=()=>calls.push('cancel'),updatePlayButton=()=>emitPlaybackState(),
      resumeMainAudioFromMediaSession=async()=>{calls.push('resume');playbackWanted=true;playbackPhase='loading';},
      switchMediaTrack=step=>calls.push(['switch',step]),seekMediaTo=value=>{calls.push(['seek',value]);audio.currentTime=Math.max(0,Math.min(audio.duration,value));};
    ${section('  // Read only the existing main-track runtime','  function publicState()')}
    return {getPlaybackState,emitPlaybackState,handlePublicPlaybackEvent,play:playPublicPlayback,pause:pausePublicPlayback,
      togglePlayback:togglePublicPlayback,previousTrack:previousPublicTrack,nextTrack:nextPublicTrack,seekTo:seekPublicPlayback,
      set(values){if('current'in values)current=values.current;if('phase'in values)playbackPhase=values.phase;
        if('wanted'in values)playbackWanted=values.wanted;if('priming'in values)audioPriming=values.priming;
        if('pending'in values)pendingPlaybackSelection=values.pending;if('saved'in values)resumePoint=values.saved;
        if('disposed'in values)disposed=values.disposed;},request:()=>playRequest};
  `)(ROOT,DOC,audio,calls);
  return {...api,audio,calls,events};
}
const song={id:'netease:123',title:'真实歌名',artist:'真实歌手',duration:180,cover:'https://cdn.test/cover.jpg'};

test('empty state uses the exact v1 protocol and never exposes idle audio as a song',()=>{
  const api=harness();api.audio.paused=false;
  assert.deepEqual(api.getPlaybackState(),{protocolVersion:1,loaded:true,trackId:'',title:'',artist:'',artwork:'',playing:false,loading:false,currentTime:0,duration:0,playbackRate:1});
});

test('only verified main-track playback is playing; priming, preloading, buffering, failures and pauses are excluded',()=>{
  const api=harness();api.set({current:song,phase:'playing',wanted:true});api.audio.paused=false;
  assert.equal(api.getPlaybackState().playing,true);
  for(const [values,audio] of [
    [{priming:true},{}],[{priming:false,pending:true},{}],[{pending:false,phase:'loading'},{}],
    [{phase:'idle'},{}],[{phase:'playing'},{paused:true}],[{},{paused:false,error:{code:4}}],
    [{},{error:null,ended:true}],[{},{ended:false,readyState:2}],[{wanted:false},{readyState:4}],
  ]){api.set(values);Object.assign(api.audio,audio);assert.equal(api.getPlaybackState().playing,false);}
  api.set({wanted:true,phase:'loading'});assert.equal(api.getPlaybackState().loading,true);
});

test('selected and restored songs do not inherit the previous source clock or infinite durations',()=>{
  const api=harness();api.set({current:song,pending:true});
  assert.equal(api.getPlaybackState().currentTime,0);assert.equal(api.getPlaybackState().duration,180);
  api.set({pending:false,saved:{song,position:42}});assert.equal(api.getPlaybackState().currentTime,42);
  api.set({saved:null});api.audio.duration=Infinity;api.audio.currentTime=NaN;
  assert.equal(api.getPlaybackState().duration,0);assert.equal(api.getPlaybackState().currentTime,0);
});

test('controls reuse resume, cancellation, queue switching and clamped seek, and stale handles are inert',async()=>{
  const api=harness();await api.play();await api.play();assert.deepEqual(api.calls,['resume']);
  api.set({current:song});api.pause();assert.deepEqual(api.calls.slice(-2),['cancel','pause']);assert.equal(api.request(),1);
  await api.togglePlayback();assert.equal(api.calls.at(-1),'resume');
  api.togglePlayback();assert.equal(api.calls.at(-1),'pause');
  api.previousTrack();api.nextTrack();assert.deepEqual(api.calls.slice(-2),[['switch',-1],['switch',1]]);
  api.seekTo(1000);assert.equal(api.audio.currentTime,180);api.seekTo(-5);assert.equal(api.audio.currentTime,0);
  const count=api.calls.length;for(const invalid of [NaN,Infinity,'5'])api.seekTo(invalid);
  api.set({pending:true});api.seekTo(10);assert.equal(api.calls.length,count);
  api.set({disposed:true,pending:false});await api.play();api.pause();await api.togglePlayback();api.previousTrack();api.nextTrack();api.seekTo(20);
  assert.equal(api.calls.length,count);assert.equal(api.getPlaybackState().loaded,false);
});

test('broadcasts use ROOT, deduplicate unchanged progress, force seeks and publish terminal unload state',async()=>{
  const api=harness();api.set({current:song,phase:'playing',wanted:true});api.audio.paused=false;
  api.emitPlaybackState();assert.equal(api.events[0].type,'selene-music-playback-state');
  api.audio.currentTime+=1;api.emitPlaybackState();assert.equal(api.events.length,1);
  api.handlePublicPlaybackEvent({type:'seeked'});await Promise.resolve();assert.equal(api.events.length,2);
  api.set({phase:'loading'});api.emitPlaybackState();assert.equal(api.events.at(-1).detail.loading,true);
  api.set({disposed:true});api.emitPlaybackState(true);
  assert.deepEqual(Object.fromEntries(['loaded','playing','loading'].map(k=>[k,api.events.at(-1).detail[k]])),{loaded:false,playing:false,loading:false});
});
