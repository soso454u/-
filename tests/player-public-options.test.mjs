import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const source=readFileSync(new URL('../纯音乐播放器.js',import.meta.url),'utf8');
function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a);return source.slice(a,b);}
const track=()=>({id:'netease:1',mediaId:'1',source:'netease',audio:'https://old.test/audio'});
function harness(playback=async()=>true){
  const events=[],calls=[],cache=new Map([
    ['https://api.test/?types=url&source=netease',{}],
    ['https://api.test/?types=url&source=joox',{}],
    ['https://api.test/?types=search&source=netease',{}],
  ]);
  const ROOT={CustomEvent:class{constructor(type,{detail}){this.type=type;this.detail=detail;}},dispatchEvent:event=>events.push(event)};
  const button={dataset:{},setAttribute(){}};
  const api=new Function('ROOT','calls','gdResponses','playback','button',`
    const ID='test',DOC={getElementById:()=>({}),querySelector:()=>button},GD_SOURCES=['netease','joox'],GD_SOURCE_LABELS={netease:'网易云',joox:'JOOX'},
      settings={playMode:'loop',lxMusicEnabled:true},playbackSources=new WeakMap();
    let playbackPublicReady=true,disposed=false,current=null,verifiedPlaybackSong=null,audioPriming=false,pendingPlaybackSelection=false,playRequest=0,lastPlaybackOptionsStateKey='';
    const audio={src:'',dataset:{}},isVideoEntry=s=>s.source==='bilibili-video';
    const save=()=>{calls.push('save');emitPlaybackOptionsState();};
    const toast=()=>{};
    const play=song=>{playRequest++;verifiedPlaybackSong=null;calls.push(['play',song]);return playback(song).then(started=>{if(started){verifiedPlaybackSong=song;audio.src='https://new.test/audio';}return started;});};
    ${section('  function updatePlayMode','  function nextSong')}
    ${section('  function playbackSourceChoice','  function playbackSourceOrder')}
    ${section('  const S01S_QUALITIES=','  function lxRetryDeadline')}
    ${section('  function playbackSourceOptions','  function bindPlaybackSources')}
    ${section('  // Optional playback controls','  // Lyrics protocol v1')}
    return {getPlayMode:getPublicPlayMode,setPlayMode:setPublicPlayMode,getPlaybackSources:getPublicPlaybackSources,
      setPlaybackSource:setPublicPlaybackSource,setS01SQuality:setPublicS01SQuality,emitPlaybackOptionsState,settings,audio,
      select(song){current=song;verifiedPlaybackSong=null;emitPlaybackOptionsState();},
      menuSelect:source=>selectPlaybackSource(current,source),menuQuality:quality=>selectS01SQuality(current,quality),
      cancel:()=>playRequest++,unload(){disposed=true;emitPlaybackOptionsState();playbackPublicReady=false;},
    };
  `)(ROOT,calls,cache,playback,button);
  return {...api,events,calls,cache,button};
}

test('mode updates one saved setting and the existing UI path, with validated input and deduplicated events',()=>{
  const api=harness();assert.deepEqual(api.getPlayMode(),{ok:true,mode:'loop'});
  for(const mode of ['one','shuffle','loop']){assert.deepEqual(api.setPlayMode(mode),{ok:true,mode});assert.equal(api.settings.playMode,mode);assert.equal(api.button.dataset.mode,mode);}
  const count=api.events.length;api.setPlayMode('loop');api.emitPlaybackOptionsState();assert.equal(api.events.length,count);
  assert.equal(api.calls.filter(x=>x==='save').length,4);
  assert.equal(api.setPlayMode('invalid').error.code,'INVALID_MODE');assert.equal(api.settings.playMode,'loop');
  api.unload();assert.equal(api.setPlayMode('one').error.code,'UNLOADED');assert.equal(api.getPlayMode().ok,false);
});

test('sources and qualities follow live configuration, reject unsupported operations and return fresh copies',async()=>{
  const api=harness();assert.equal(api.getPlaybackSources().error.code,'NO_TRACK');
  api.select(track());let state=api.getPlaybackSources();
  assert.deepEqual(state.options.map(x=>x.id),['auto','netease','joox','lx-tencent']);
  assert.deepEqual(state.qualityOptions.map(x=>x.id),['auto','standard','hq','sq','pq']);
  state.options[0].label='changed';state.qualityOptions.pop();assert.equal(api.getPlaybackSources().options[0].label,'自动回退');
  assert.equal((await api.setPlaybackSource('https://fake.test')).error.code,'INVALID_SOURCE');
  assert.equal((await api.setS01SQuality('unknown')).error.code,'INVALID_QUALITY');
  api.settings.lxMusicEnabled=false;
  assert.deepEqual(api.getPlaybackSources().options.map(x=>x.id),['auto','netease','joox']);assert.deepEqual(api.getPlaybackSources().qualityOptions,[]);
  assert.equal((await api.setPlaybackSource('lx-tencent')).error.code,'SOURCE_UNAVAILABLE');
  assert.equal((await api.setS01SQuality('hq')).error.code,'SOURCE_UNAVAILABLE');
  for(const source of ['direct','bilibili-video']){api.select({...track(),source});assert.equal((await api.setPlaybackSource('auto')).error.code,'UNSUPPORTED_TRACK');}
});

test('public and menu source choices reuse cache invalidation and replays; qualities persist and select S01S',async()=>{
  const api=harness();
  api.select(track());let state=await api.setPlaybackSource('joox');
  assert.equal(state.ok,true);assert.equal(state.selected,'joox');assert.equal(state.actualSource,'网易云');
  assert.equal(api.cache.has('https://api.test/?types=url&source=joox'),false);
  assert.equal(api.cache.has('https://api.test/?types=url&source=netease'),true);
  assert.equal(api.cache.has('https://api.test/?types=search&source=netease'),true);
  assert.equal(api.calls[0][1].audio,'');
  // Choosing JOOX is a preference; the existing engine still determines the actual source.
  state=await api.setS01SQuality('sq');assert.equal(state.ok,true);assert.equal(state.quality,'sq');assert.equal(state.selected,'lx-tencent');
  assert.equal(api.settings.s01sQuality,'sq');
  assert.ok(api.calls.includes('save'));assert.equal(api.calls.filter(x=>Array.isArray(x)&&x[0]==='play').length,2);
  await api.menuSelect('netease');assert.equal(api.getPlaybackSources().selected,'netease');
  await api.menuQuality('hq');assert.equal(api.getPlaybackSources().quality,'hq');
  assert.equal(api.events.at(-1).type,'selene-music-playback-options-state');
  const count=api.events.length;for(let i=0;i<10;i++){api.audio.currentTime=i;api.emitPlaybackOptionsState();}
  assert.equal(api.events.length,count);
  api.unload();assert.equal(api.events.at(-1).detail.loaded,false);assert.equal(api.events.at(-1).detail.trackId,'');assert.equal(api.events.at(-1).detail.actualSource,'');
});

test('failed, replaced and unloaded replays return structured errors without changing another track',async()=>{
  let finish;const api=harness(()=>new Promise(resolve=>{finish=resolve;}));api.select(track());
  const pending=api.setPlaybackSource('joox');api.select({...track(),id:'netease:2'});finish(true);
  assert.equal((await pending).error.code,'CANCELED');
  const failed=harness(async()=>false);failed.select(track());assert.equal((await failed.setPlaybackSource('auto')).error.code,'PLAYBACK_NOT_STARTED');
  const thrown=harness(async()=>{throw Error('internal secret');});thrown.select(track());
  const error=await thrown.setPlaybackSource('auto');assert.equal(error.error.code,'PLAYBACK_FAILED');assert.doesNotMatch(JSON.stringify(error),/internal secret/);
  const unloading=api.setPlaybackSource('auto');api.unload();finish(true);assert.equal((await unloading).error.code,'UNLOADED');
});
