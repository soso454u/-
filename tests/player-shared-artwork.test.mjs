import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const source=readFileSync(new URL('../纯音乐播放器.js',import.meta.url),'utf8');
function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a);return source.slice(a,b);}
const track=(id,cover='')=>({source:'tencent',id:`tencent:${id}`,mediaId:id,title:`Song ${id}`,artist:'Artist',cover});
function harness(songs,resolve=async()=> 'https://cover.test/resolved.jpg'){
  const settings={favorites:[],playlists:[{id:'playlist',songs}]},requests=[],images=[],writes=[],notifications=[];
  const api=new Function('settings','resolve','requests','images','writes','notifications',`
    const ID='player',playlistRows=settings.playlists[0].songs;
    let queue=[],queueIndex=-1,current=null,results=[],displayedSongRows=null,disposed=false,playRequest=1;
    const save=()=>writes.push(settings.playlists[0].songs.map(song=>song.cover)),scheduleMusicLibraryState=scope=>notifications.push(scope);
    const count=()=>{},playListEntry=song=>{current=song;},isVideoEntry=()=>false;
    const DOC={querySelectorAll:()=>images},setArtworkSource=(img,cover)=>{img.src=cover;};
    const resolveCover=async(...args)=>{requests.push(args);return resolve(...args);};
    const syncResultCover=()=>{},show=song=>{current=song;},render=()=>{};
    ${section('const playlistPlaybackOrigins=', 'function bindDesktopLyrics')}
    ${section('  // Cover metadata can be shared;', '  function render(')}
    ${section('async function applyCurrentCover', 'async function loadLyrics')}
    return {play:()=>{playPlaylistAt(playlistRows);displayedSongRows=queue;images.splice(0,images.length,...queue.map((song,i)=>({parentElement:{dataset:{i:String(i)}},src:song.cover,getAttribute(){return this.src||null;}})));},
      reuseLibraryCovers,shareLibraryCover,apply:()=>applyCurrentCover(current,playRequest),hydrate:rows=>hydrateSavedCovers(rows,'','queue'),
      queue:()=>queue,current:()=>current,stale:()=>{playRequest++;},dispose:()=>{disposed=true;playRequest++;},
    };
  `)(settings,resolve,requests,images,writes,notifications);
  return {...api,settings,requests,images,writes,notifications};
}

test('all playlist and restored queue rows reuse known artwork, including rows beyond the hydration limit',async()=>{
  const songs=Array.from({length:150},(_,i)=>track(String(i),`https://cover.test/${i}.jpg`)),api=harness(songs);
  api.play();assert.notEqual(api.queue()[0],songs[0]);assert.deepEqual(api.queue().map(x=>x.cover),songs.map(x=>x.cover));
  const restored=songs.map(({cover,...song})=>song);assert.equal(api.reuseLibraryCovers(restored),true);
  assert.deepEqual(restored.map(x=>x.cover),songs.map(x=>x.cover));await api.hydrate(restored);
  assert.equal(api.requests.length,0);assert.equal(api.writes.length,0);
});

test('artwork obtained after queue creation updates the playlist, queue and displayed row without another lookup',async()=>{
  const original=track('one'),api=harness([original]);api.play();
  await api.hydrate([original]);
  assert.equal(api.requests.length,1);assert.equal(original.cover,'https://cover.test/resolved.jpg');
  assert.equal(api.queue()[0].cover,original.cover);assert.equal(api.images[0].src,original.cover);assert.equal(api.writes.length,1);
  await api.hydrate(api.queue());await api.apply();assert.equal(api.requests.length,1);
});

test('new main-track artwork is saved back to its real playlist origin, without altering playback identities',async()=>{
  const original=track('one'),api=harness([original]);api.play();
  Object.assign(api.current(),{source:'joox',mediaId:'fallback',id:'joox:fallback'});
  await api.apply();assert.equal(original.cover,'https://cover.test/resolved.jpg');assert.equal(api.writes.length,1);
  assert.equal(original.source,'tencent');assert.equal(original.mediaId,'one');assert.equal(api.current().mediaId,'fallback');
});

test('a fallback source reuses the linked playlist artwork without revalidating or requesting it',async()=>{
  const original=track('one','https://cover.test/known.jpg'),api=harness([original]);api.play();
  Object.assign(api.current(),{source:'joox',mediaId:'fallback',id:'joox:fallback',cover:''});
  await api.apply();assert.equal(api.current().cover,original.cover);assert.equal(api.requests.length,0);
});

test('lookup never guesses by title or crosses platform IDs or versions, and keeps an existing cover',()=>{
  const original={...track('one','https://cover.test/known.jpg'),version:'Live'},api=harness([original]);
  const wrongSource={...original,source:'joox',cover:''},wrongVersion={...original,version:'Remix',cover:''},noId={title:original.title,artist:original.artist,cover:''};
  assert.equal(api.reuseLibraryCovers([wrongSource,wrongVersion,noId]),false);
  assert.equal(wrongSource.cover,'');assert.equal(wrongVersion.cover,'');assert.equal(noId.cover,'');
  const custom={...original,cover:'https://cover.test/custom.jpg'};api.reuseLibraryCovers([custom]);assert.equal(custom.cover,'https://cover.test/custom.jpg');
});

test('obsolete and unloaded main-track resolutions cannot replace the new artwork or persist a result',async()=>{
  for(const stop of ['stale','dispose']){
    let finish;const original=track('one'),api=harness([original],()=>new Promise(resolve=>{finish=resolve;}));api.play();
    const pending=api.apply();api[stop]();finish('https://cover.test/obsolete.jpg');await pending;
    assert.equal(original.cover,'');assert.equal(api.queue()[0].cover,'');assert.equal(api.writes.length,0);
  }
});
