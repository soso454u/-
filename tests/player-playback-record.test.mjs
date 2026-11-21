import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
const section = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const key = 'selene-music-playback-v1';
let token = 0;
const storage = (entries = new Map()) => ({
  getItem: key => entries.get(key) ?? null,
  setItem: (key, value) => entries.set(key, value),
});
const makeRuntime = new Function('ROOT', 'accountStorage', `
  const DOC={querySelector:()=>null},ID='player',audio={currentTime:0,duration:200};
  let current=null,queue=[],queueIndex=-1,disposed=false,storageWriteWarningShown=false;
  let lyricState='',pendingPlaybackSelection=false,audioPriming=false,playbackWanted=false;
  const reuseLibraryCovers=()=>false;
  const context=()=>({accountStorage}), isVideoEntry=s=>s?.source==='bilibili-video';
  const seekMediaTo=seconds=>audio.currentTime=seconds;
  const show=s=>{current=s;},paintTime=()=>{},updatePlayButton=()=>{},setStatus=()=>{};
  const toast=()=>{},bilibiliPlayer={close(){}},syncKeepAliveWithPlayback=()=>{};
  const calls=[],play=(song,recovering,options)=>calls.push({song,options});
  ${section('const PLAYBACK_RECORD_KEY=', 'function currentIsFavorite')}
  ${section('function audioInputUrl', 'function directAudioSong')}
  ${section('async function resumeMainAudioFromMediaSession', 'function setupMediaSession')}
  loadPlaybackRecord();
  return {
    snapshot:()=>structuredClone(playbackRecord),
    enqueue:(...songs)=>{queue.push(...songs);syncPlaybackQueue();},
    start:index=>{queueIndex=index;show(queue[index]);audio.currentTime=.5;pendingPlaybackSelection=false;recordPlaybackStart(current);},
    progress:seconds=>{audio.currentTime=seconds;checkpointPlayback(true);},
    selectUnverified:index=>{show(queue[index]);pendingPlaybackSelection=true;},
    reopen:()=>restorePlaybackSelection(),
    resume:resumeMainAudioFromMediaSession,
    completeResume:()=>{audio.currentTime=.5;pendingPlaybackSelection=false;recordPlaybackStart(current);return audio.currentTime;},
    audio,calls,
  };
`);
const root = localStorage => ({localStorage,crypto:{randomUUID:()=>`fixture-${++token}`}});
const a = {id:'netease:1',mediaId:'1',title:'First',artist:'Artist',source:'netease',audio:'https://temporary.test/a.mp3',blob:'binary-placeholder'};
const b = {id:'tencent:2',mediaId:'2',title:'Second',source:'tencent',qqMid:'test-mid',cover:'data:image/png;base64,fixture'};

test('a fresh browser restores the account queue, verifies playback before remembering it and seeks on resume', async () => {
  const account = storage();
  const first = makeRuntime(root(storage()), account);
  first.enqueue(a,b);
  first.start(0);
  first.start(1);
  first.progress(37.25);
  first.selectUnverified(0);
  first.progress(0); // A failed/cancelled replacement must not erase the last successful position.
  const server = JSON.parse(account.getItem(key));
  assert.deepEqual(server.record.recent.map(r=>r.song.title), ['Second','First']);
  assert.ok(server.record.recent.every(r=>r.playedAt>0));
  assert.doesNotMatch(JSON.stringify(server), /temporary\.test|binary-placeholder|base64/);
  const second = makeRuntime(root(storage()), account);
  second.reopen();
  assert.equal(second.audio.currentTime,0);
  assert.equal(second.calls.length,0);
  await second.resume();
  assert.equal(second.calls[0].song.title, 'Second');
  assert.equal(second.calls[0].options.resumeSaved, true);
  assert.equal(second.completeResume(),37.2);
  assert.deepEqual(second.snapshot().queue.map(s=>s.title), ['First','Second']);
  assert.deepEqual(second.snapshot().recent.map(r=>r.song.title), ['Second','First']);
});

test('quick-close recovery follows the same account, and a newer snapshot from another device wins', () => {
  const browser=storage(),saved=new Map(),disk=storage(saved);
  let pausedWrites=false;
  const pending = {...disk,setItem:(k,v)=>{if(!pausedWrites)disk.setItem(k,v);}};
  const first=makeRuntime(root(browser),pending);
  first.enqueue(a,b);first.start(0);
  pausedWrites=true;
  first.progress(19);
  assert.equal(makeRuntime(root(browser),pending).snapshot().last.position,19);
  assert.equal(makeRuntime(root(browser),storage()).snapshot().last,null);
  const second=makeRuntime(root(storage()),disk);
  second.start(1);second.progress(43);
  assert.equal(makeRuntime(root(browser),pending).snapshot().last.song.title,'Second');
});

test('without account storage, a queue and explicit direct link survive locally even before any song plays', async () => {
  const browser=storage(),runtime=makeRuntime(root(browser));
  const link='https://audio.test/music?token=signature';
  runtime.enqueue({...a,source:'bilibili-video',bvid:'BV1xx411c7mD'}, {title:'Direct',source:'direct',audio:link});
  const restarted=makeRuntime(root(browser));
  await restarted.resume();
  assert.equal(restarted.calls[0].song.audio,link);
  assert.equal(restarted.snapshot().recent.length,0);
  assert.equal(restarted.snapshot().queue.length,2);
});
