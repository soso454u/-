import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const source=readFileSync(new URL('../纯音乐播放器.js',import.meta.url),'utf8');
const section=(start,end)=>{const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a,`missing ${start}`);return source.slice(a,b);};
const song=n=>({id:`netease:${n}`,mediaId:String(n),title:`Song ${n}`,artist:'Artist',source:'netease',duration:180,audio:'https://private.test/stream?token=secret',customAudio:'https://private.test/stream?key=private',cover:'https://cover.test/a.jpg'});
function harness(provider=async()=>[]){
  const events=[],calls=[],settings={favorites:[song(1),song(2)],playlists:[{id:'list',name:'Playlist',songs:[song(3),song(4)]}],searchMode:'gd',searchSource:'auto',companionApiKey:'NEVER_RETURN'};
  const ROOT={crypto:{randomUUID:()=> 'runtime-1'},CustomEvent:class{constructor(type,{detail}){this.type=type;this.detail=detail;}},dispatchEvent:e=>events.push(e)};
  const DOC={getElementById:()=>({}),querySelector:()=>null};
  const api=new Function('ROOT','DOC','settings','calls','provider',`
    const ID='player',GD_SOURCES=['netease','joox'];let publicMusicLibrary=null,disposed=false,playbackPublicReady=true,current=null,queue=[],queueIndex=-1;
    const getSongTitle=s=>s.title||'',getSongArtist=s=>s.artist||'',getSongAlbum=s=>s.album||'',songDuration=s=>Number(s?.duration)||0;
    const isVideoEntry=s=>s?.source==='bilibili-video',offlineKey=s=>s.title+'::'+s.artist;
    const playlistPlaybackOrigins=new WeakMap();
    const strip=s=>({...s}),currentIsFavorite=s=>(settings.favorites||[]).some(x=>x.id===s.id);
    const save=()=>{calls.push('save');scheduleMusicLibraryState();},refreshLibraryHearts=()=>{},setStatus=()=>{},toast=()=>{};
    const syncPlaybackQueue=()=>calls.push('persistQueue'),count=()=>{syncPlaybackQueue();scheduleMusicLibraryState('queue');};
    const playListEntry=s=>{calls.push(['play',s.id]);current=s;};
    const searchSource=async(source,query)=>{calls.push(['search',source,query]);return provider(source,query);};
    const searchMetingSource=async(source,query,options)=>{calls.push(['meting',source,query]);return provider(source,query,options);};
    const querySongHits=(rows,query)=>rows.filter(s=>s.title===query),normalizeSongText=s=>s.toLowerCase(),rankSearchResults=rows=>rows;
    ${section('function playPlaylistAt(', 'function bindDesktopLyrics')}
    ${section('function favorite(s)', 'function count()')}
    ${section('function queuePlaylistSongs', 'function showPlaylists')}
    ${section('  // Library protocol v2.', '  // Read only the existing main-track runtime;')}
    return {getCapabilities:getMusicCapabilities,getMusicLibrary:getPublicMusicLibrary,getQueueState:getPublicQueueState,searchMusic:searchPublicMusic,cancelMusicSearch:cancelPublicMusicSearch,
      playTrack:playPublicTrack,playPlaylist:playPublicPlaylist,addToQueue:addPublicToQueue,toggleFavorite:togglePublicFavorite,
      scheduleMusicLibraryState,flushMusicLibraryState,session:()=>publicMusicLibrary,unload(){disposed=true;disposeMusicLibrary();playbackPublicReady=false;},
      reverse(){settings.favorites.reverse();save();},changeSettings(){settings.theme='black';save();},state:()=>({current,queue,queueIndex}),
    };
  `)(ROOT,DOC,settings,calls,provider);
  return {...api,events,calls,settings};
}
const tick=()=>Promise.resolve();

test('pages are detached plain metadata without stream URLs, configuration, audio or collection references',()=>{
  const api=harness();assert.equal(api.getCapabilities().playbackProtocolVersion,1);
  const first=api.getMusicLibrary({limit:1});assert.equal(first.total,2);assert.equal(first.nextOffset,1);
  assert.doesNotMatch(JSON.stringify(first),/private\.test|secret|NEVER_RETURN|customAudio/);
  const ref=structuredClone(first.items[0].trackRef);first.items[0].title='external mutation';first.items[0].trackRef.kind='current';first.items.length=0;
  assert.equal(api.settings.favorites[0].title,'Song 1');
  api.reverse();assert.equal(api.playTrack(ref).ok,true);assert.equal(api.state().current.title,'Song 1');
  assert.equal(api.getMusicLibrary({offset:999}).items.length,0);
  assert.equal(api.getMusicLibrary({limit:1000}).error.code,'INVALID_OPTIONS');
});

test('playlist and queue playback use the real builders, exact queue occurrence and original persistence',()=>{
  const api=harness();const lists=api.getMusicLibrary({kind:'playlists'});assert.equal(lists.items[0].playlistId,'list');
  const tracks=api.getMusicLibrary({kind:'playlist',playlistId:'list'}).items;
  assert.equal(api.playPlaylist('list',{startTrackId:tracks[1].trackId}).ok,true);
  assert.deepEqual(api.state().queue.map(x=>x.title),['Song 3','Song 4']);assert.equal(api.state().queueIndex,1);
  const state=api.getQueueState();assert.equal(state.queueIndex,1);assert.equal(state.currentTrackId,state.items[1].trackId);
  assert.equal(api.playTrack(state.items[0].trackRef).ok,true);assert.equal(api.state().queueIndex,0);
  const extra=api.getMusicLibrary().items[0].trackRef;
  assert.equal(api.addToQueue(extra).added,true);assert.equal(api.addToQueue(extra).added,false);assert.equal(api.state().queue.length,3);
  assert.ok(api.calls.includes('persistQueue'));
});

test('favorites use original mutation/save, and events coalesce actual changes without reporting unrelated settings',async()=>{
  const api=harness();const ref=api.getMusicLibrary({kind:'playlist',playlistId:'list'}).items[0].trackRef;
  api.changeSettings();await tick();assert.equal(api.events.length,0);
  const result=api.toggleFavorite(ref);assert.equal(result.favorite,true);assert.equal(api.settings.favorites[0].id,'netease:3');
  assert.equal(api.events.length,1);assert.deepEqual(api.events[0].detail.changed,['favorites']);assert.equal(result.revision,1);
  api.toggleFavorite(ref);assert.equal(api.settings.favorites.some(s=>s.id==='netease:3'),false);assert.equal(api.events.length,2);
  assert.equal(api.events[0].type,'selene-music-library-state');assert.equal(api.events[0].detail.items,undefined);
  await tick();assert.equal(api.events.length,2);
});

test('forged URLs, removed and stale references never dispatch playback',()=>{
  const api=harness();let ref=api.getMusicLibrary().items[0].trackRef;
  assert.equal(api.playTrack('https://attacker.test/a.mp3').error.code,'INVALID_REF');
  assert.equal(api.playTrack({...ref,instanceId:'previous-runtime',audio:'https://attacker.test/'}).error.code,'STALE_REF');
  api.toggleFavorite(ref);assert.equal(api.playTrack(ref).error.code,'NOT_FOUND');
  ref=api.getMusicLibrary().items[0].trackRef;
  assert.equal(api.playTrack({...ref,audio:'https://attacker.test/'}).ok,true);assert.equal(api.state().current.audio.includes('private.test'),true);
});

test('search shares existing source selection/ranking without touching playback, queues or saved collections',async()=>{
  const api=harness(async(provider,query)=>[{...song(provider==='netease'?10:11),title:query}]);
  const before=structuredClone(api.settings),result=await api.searchMusic('requested',{limit:1});
  assert.equal(result.ok,true);assert.equal(result.total,2);assert.equal(result.nextOffset,1);
  assert.deepEqual(api.settings,before);assert.equal(api.state().current,null);assert.deepEqual(api.state().queue,[]);assert.equal(api.events.length,0);
  const page=await api.searchMusic('requested',{searchId:result.searchId,offset:1,limit:1});assert.equal(page.items.length,1);
  assert.equal(api.calls.filter(x=>Array.isArray(x)&&x[0]==='search').length,2);
  assert.equal(api.playTrack(page.items[0].trackRef).ok,true);
  api.session().searches.get(result.searchId).expiresAt=0;
  assert.equal(api.playTrack(result.items[0].trackRef).error.code,'EXPIRED_SEARCH');
});

test('same-channel searches cancel promptly, obsolete providers cannot publish, and AbortSignal is detached',async()=>{
  const pending=new Map(),api=harness((provider,query)=>new Promise(resolve=>pending.set(query,resolve)));
  const old=api.searchMusic('old',{source:'netease'}),fresh=api.searchMusic('new',{source:'netease'});
  assert.equal((await old).error.code,'STALE_SEARCH');
  pending.get('old')([song(9)]);await tick();assert.equal(api.session().searches.size,0);
  pending.get('new')([song(10)]);assert.equal((await fresh).ok,true);
  const controller=new AbortController(),canceled=api.searchMusic('abort',{source:'netease',signal:controller.signal});controller.abort();
  assert.equal((await canceled).error.code,'CANCELED');pending.get('abort')([song(11)]);await tick();
  assert.equal(api.session().searches.size,1);assert.equal(api.session().jobs.size,0);
});

test('errors are sanitized, search sessions are bounded, and unload cancels jobs and disables old handles',async()=>{
  const api=harness(async(_provider,query)=>{if(query==='fail')throw Error('secret=https://private.test/token');return [song(10)];});
  const failure=await api.searchMusic('fail');assert.equal(failure.error.code,'SEARCH_FAILED');assert.doesNotMatch(JSON.stringify(failure),/secret|private/);
  for(let n=0;n<9;n++)await api.searchMusic(String(n),{source:'netease'});
  assert.equal(api.session().searches.size,8);api.unload();assert.equal(api.session().searches.size,0);
  assert.equal(api.getMusicLibrary().error.code,'UNLOADED');assert.equal(api.playPlaylist('list').error.code,'UNLOADED');
  assert.equal(api.events.at(-1).detail.available,false);assert.deepEqual(api.events.at(-1).detail.changed,['availability']);
});


test('QQ search uses the existing metadata engine and independent channels respect the concurrency bound',async()=>{
  const pending=new Map(),api=harness((provider,query)=>{if(query==='qq')return [song(50)];return new Promise(resolve=>pending.set(query,resolve));});
  const qq=await api.searchMusic('qq',{mode:'other'});assert.equal(qq.ok,true);assert.deepEqual(api.calls[0],['meting','tencent','qq']);
  const jobs=[0,1,2,3].map(n=>api.searchMusic(String(n),{source:'netease',channel:'channel-'+n}));
  assert.equal((await api.searchMusic('extra',{channel:'fifth'})).error.code,'BUSY');
  assert.equal(api.cancelMusicSearch('channel-0').canceled,true);assert.equal((await jobs[0]).error.code,'CANCELED');
  for(let n=1;n<4;n++)pending.get(String(n))([song(n)]);
  assert.ok((await Promise.all(jobs.slice(1))).every(result=>result.ok));
  pending.get('0')([]);
});

test('unloading in-flight searches settles callers immediately and late responses cannot restore a session',async()=>{
  let resolve;const api=harness(()=>new Promise(done=>{resolve=done;}));
  const pending=api.searchMusic('pending',{source:'netease'});api.unload();
  assert.equal((await pending).error.code,'UNLOADED');resolve([song(100)]);await tick();
  assert.equal(api.session().searches.size,0);assert.equal(api.session().jobs.size,0);
});


test('an unavailable provider with no fallback results returns a structured failure instead of a false empty success',async()=>{
  const api=harness(async provider=>{if(provider==='netease')throw Error('provider unavailable');return [];});
  assert.equal((await api.searchMusic('empty fallback')).error.code,'SEARCH_FAILED');
});
