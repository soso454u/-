import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const player = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
const helperStart = player.indexOf('function companionPickedEntries');
const helperEnd = player.indexOf('function companionTicketList', helperStart);
const markStart = player.indexOf('function markCompanionPicked');
const markEnd = player.indexOf('function addCurrentToOurSongs', markStart);
const uniqueStart = player.indexOf('async function uniqueCompanionRecommendation');
const uniqueEnd = player.indexOf('function fulfillCompanionSongRequest', uniqueStart);

assert.notEqual(helperStart, -1, 'recommendation history helpers should exist');
assert.notEqual(helperEnd, -1, 'recommendation history helper boundary should exist');
assert.notEqual(markStart, -1, 'picked-song recorder should exist');
assert.notEqual(markEnd, -1, 'picked-song recorder boundary should exist');
assert.notEqual(uniqueStart, -1, 'unique recommendation helper should exist');
assert.notEqual(uniqueEnd, -1, 'unique recommendation helper boundary should exist');

const normalizeSongText = value => String(value || '').toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '');
const offlineKey = song => `${normalizeSongText(song?.title)}::${normalizeSongText(song?.artist)}`;
let memories = {};

const {
  companionPickedEntries,
  companionWasPicked,
  companionPickedPrompt,
  companionExplicitlyRequestedChoice,
} = new Function(
  'companionMemoryList',
  'offlineKey',
  'normalizeSongText',
  `${player.slice(helperStart, helperEnd)};return {companionPickedEntries,companionWasPicked,companionPickedPrompt,companionExplicitlyRequestedChoice};`,
)(() => memories, offlineKey, normalizeSongText);

test('prompt contains only the latest 30 picks while hard dedupe checks all history', () => {
  memories = Object.fromEntries(Array.from({ length: 35 }, (_, index) => {
    const song = { title: `Song ${index + 1}`, artist: 'Artist' };
    return [offlineKey(song), { song, pickedByCharacter: 1, lastPickedAt: index + 1 }];
  }));

  const info = { name: 'Selene' };
  const prompt = companionPickedPrompt(info, 30).split('\n');
  assert.equal(prompt.length, 30);
  assert.match(prompt[0], /Song 35/);
  assert.doesNotMatch(prompt.join('\n'), /Song 1》/);
  assert.equal(companionWasPicked({ title: 'Song 1', artist: 'Artist' }, info), true);
});

test('only an explicitly named song is allowed to bypass history', () => {
  const choice = { title: '稻香', artist: '周杰伦' };
  assert.equal(companionExplicitlyRequestedChoice(choice, '播放稻香'), true);
  assert.equal(companionExplicitlyRequestedChoice(choice, '再换一首歌'), false);
  assert.equal(companionExplicitlyRequestedChoice(choice, '放一首周杰伦的歌'), false);
});

test('marking a character pick refreshes song data and its last-picked timestamp', () => {
  const song = { title: 'New Song', artist: 'Artist', url: 'new-url' };
  const key = offlineKey(song);
  const list = { [key]: { song: { title: 'New Song', artist: 'Artist', url: 'old-url' }, pickedByCharacter: 1 } };
  let saves = 0;
  const markCompanionPicked = new Function(
    'companionCharacter',
    'companionMemoryList',
    'offlineKey',
    'strip',
    'save',
    `${player.slice(markStart, markEnd)};return markCompanionPicked;`,
  )(() => ({}), () => list, offlineKey, value => ({ ...value }), () => saves++);
  const before = Date.now();

  markCompanionPicked(song, { name: 'Selene' });

  assert.equal(list[key].pickedByCharacter, 2);
  assert.equal(list[key].song.url, 'new-url');
  assert.ok(list[key].lastPickedAt >= before);
  assert.equal(saves, 1);
});

function fixture({ reply = '听这首吧\nSELENE_SONG: 新歌 | 周杰伦', picked = () => false, lookup, start = true } = {}) {
  const generated=[],played=[],marked=[],messages=[],reports=[],notices=[];
  const info={name:'Selene'};
  const section=(start,end)=>player.slice(player.indexOf(start),player.indexOf(end));
  const make=new Function('deps',`
    const {generateCompanionReply,companionCharacter,companionWasPicked,companionExplicitlyRequestedChoice,
      searchCompanionChoice,play,markCompanionPicked,companionMessages,console,offlineKey}=deps;
    let companionRequest=0,companionBusy=false;
    const disposed=false,current=null,companionMessageQueue=[],settings={companionApiKey:'test-key'};
    const renderCompanionDialog=()=>{},companionConversationKey=()=> 'contact',companionRecommendationTask=options=>options;
    const normalizeCompanionReply=text=>text,save=()=>{},setCompanionMessages=()=>{},speakCompanionReply=async()=>{};
    const DOC={querySelector:()=>null},ID='player';
    const showCompanionPickToast=text=>deps.notices.push(text),dismissCompanionPickToast=()=>{};
    ${section('function companionApiError','function companionRequestContext')}
    ${section('async function runCompanionTask','async function createCompanionTicket')}
    ${section('function companionSongField','function companionLatestRoundText')}
    ${section('function reportCompanionPick','function fulfillCompanionSongRequest')}
    return uniqueCompanionRecommendation;
  `);
  return {generated,played,marked,messages,reports,notices,request:make({
    generateCompanionReply:async (prompt, mode)=>{
      generated.push({prompt,mode});
      if(reply instanceof Error)throw reply;
      return typeof reply==='function'?reply():reply;
    },
    companionCharacter:()=>info,companionWasPicked:picked,companionExplicitlyRequestedChoice,offlineKey,
    searchCompanionChoice:lookup|| (async choice=>choice),
    play:async(song,recovering,options)=>{played.push({song,options});return start;},
    markCompanionPicked:song=>marked.push(song),
    companionMessages:()=>messages,notices,console:{warn:(_label,report)=>reports.push(report)},
  })};
}

test('role and mood picks each make one request and suppress the extra playback reaction', async () => {
  for(const mood of ['', '雨天']){
    const api=fixture({reply:'听这首吧\n**SELENE_SONG:** 《新歌》｜周杰伦'});
    await api.request({mood});
    assert.equal(api.generated.length,1);
    assert.equal(api.generated[0].prompt.mood,mood);
    assert.equal(api.generated[0].mode,true);
    assert.deepEqual(api.played,[{song:{title:'新歌',artist:'周杰伦'},options:{companionPick:true}}]);
    assert.equal(api.marked.length,1);
    assert.equal(api.messages[0].content,'听这首吧');
    assert.deepEqual(api.reports,[]);
  }
});

test('each failure reports its stage without another model call', async () => {
  const cases=[
    [{reply:'好呀，没有选歌'}, /识别歌曲/],
    [{reply:Object.assign(Error('denied test-key at https://example.invalid/?token=private'),{status:401})}, /模型请求 · HTTP 401.*已隐藏/],
    [{picked:()=>true}, /重复检查/],
    [{lookup:async()=>({title:'旧歌',artist:'周杰伦'}),picked:song=>song.title==='旧歌'}, /重复检查/],
    [{lookup:async()=>null}, /搜索歌曲.*没有找到/],
    [{lookup:async()=>{throw Error('搜索服务暂不可用');}}, /搜索歌曲.*服务暂不可用/],
    [{start:false}, /播放音源/],
  ];
  for(const [options,expected] of cases){
    const api=fixture(options);
    await api.request({mood:'雨天'});
    assert.equal(api.generated.length,1);
    assert.match(api.notices[0],expected);
    assert.deepEqual(api.notices,api.reports);
    assert.doesNotMatch(api.reports[0],/test-key|token=private/);
    assert.equal(api.marked.length,0);
    assert.equal(api.messages.length,0);
  }
});

test('pending music lookup blocks additional picks until the first request finishes',async()=>{
  let resolveSearch;
  const api=fixture({lookup:()=>new Promise(resolve=>{resolveSearch=resolve;})});
  const first=api.request({});
  await Promise.resolve();
  await api.request({mood:'开心'});
  assert.equal(api.generated.length,1);
  resolveSearch({title:'新歌',artist:'周杰伦'});
  await first;
  assert.equal(api.messages.length,1);
});

test('a song explicitly named by the user may be replayed', async () => {
  const api=fixture({reply:'SELENE_SONG: 稻香 | 周杰伦',picked:()=>true});
  await api.request({userText:'播放稻香'});
  assert.equal(api.generated.length,1);
  assert.equal(api.played[0].song.title,'稻香');
});

test('recommendations use the current contact card and the actual group participants',()=>{
  const start=player.indexOf('function companionRecommendationTask'),end=player.indexOf('function rankCompanionResults',start);
  const prompt=new Function('current','companionCharacter','companionLatestRoundText','companionPickedPrompt','companionRoleCardText','companionGroupCardText','companionMood',`${player.slice(start,end)};return companionRecommendationTask;`)(
    null,()=>({}),()=>'',()=>'',info=>`selected-card:${info.selected?.name||info.name}`,info=>`group-cards:${info.targetMembers.map(member=>member.name).join(',')}`,()=>'',
  );
  const single=prompt({info:{isMulti:true,selected:{name:'独立联系人'},character:{name:'主角色'}}});
  assert.match(single,/selected-card:独立联系人/);assert.doesNotMatch(single,/selected-card:主角色/);
  const group=prompt({info:{isGroup:true,targetMembers:[{name:'甲'},{name:'乙'}]}});
  assert.match(group,/group-cards:甲,乙/);assert.match(group,/SELENE_SONG: 官方歌名 \| 官方歌手或作曲者/);
});
