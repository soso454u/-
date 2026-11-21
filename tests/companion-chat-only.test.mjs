import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const source=readFileSync(new URL('../纯音乐播放器.js',import.meta.url),'utf8');
const section=(a,b)=>{const start=source.indexOf(a),end=source.indexOf(b,start);assert.ok(start>=0&&end>start);return source.slice(start,end);};
const narration='沈令仪把手里那半个橘子掰下一瓣塞进嘴里，酸得眉梢一动';
const mixed=`${narration}\n\n“还知道回来打招呼啊 ”`;
const info={name:'沈令仪',isMulti:true,isGroup:false,selected:{id:'shen',name:'沈令仪'},members:[{id:'shen',name:'沈令仪'},{id:'lin',name:'林夏'}],ctx:{name1:'小余',characterId:0}};
const DOC={createElement:()=>({value:'',set innerHTML(text){this.value=text.replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');}})};
const helpers=new Function('DOC',`
  const companionCharacter=()=>(${JSON.stringify(info)});
  ${section('  function casualizeCompanionPunctuation','  async function requestCustomCompanion')}
  return {companionChatMessageText,normalizeCompanionReply,companionChatOutputRule,cleanCompanionText};
`)(DOC);
const esc=text=>String(text).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const pipeline=new Function('helpers','info','esc',`
  const {companionChatMessageText,cleanCompanionText}=helpers;
  const companionCharacter=()=>info,companionPersonFace=()=>'',cleanCompanionPersonName=text=>text;
  ${section('  function companionAssistantParts','  function renderCompanionDialog')}
  return {companionConversationMarkup,companionMessageItems};
`)(helpers,info,esc);

test('the reported unmarked action paragraph is removed and only actual dialogue becomes a bubble',()=>{
  assert.equal(helpers.normalizeCompanionReply(mixed,info),'还知道回来打招呼啊');
  assert.equal(helpers.normalizeCompanionReply(`${narration}。“还知道回来打招呼啊”`,info),'还知道回来打招呼啊');
  assert.equal(helpers.normalizeCompanionReply(narration,info),'');
  const stored=[{role:'assistant',content:mixed,time:1}],html=pipeline.companionConversationMarkup(stored,info);
  assert.doesNotMatch(html,/橘子|眉梢/);assert.match(html,/还知道回来打招呼啊/);
  assert.equal((html.match(/companion-bubble-text/g)||[]).length,1);assert.equal(stored[0].content,mixed,'rendering never rewrites stored history');
  assert.deepEqual(pipeline.companionMessageItems({role:'assistant',content:narration},info),[]);
});

test('bracketed, italic and tagged stage directions are excluded without losing ordinary chat content',()=>{
  for(const raw of ['（抬头看向你）你好','*沈令仪笑了笑* “你好”','<action>她剥着橘子</action>你好','<动作>她剥着橘子</动作>你好','旁白：她把橘子塞进嘴里\n你好','沈令仪：她轻轻抬眼\n你好','（笑）你好','【把杯子放下】你好','*我剥着橘子*你好','沈令仪朝屏幕看了一眼。\n你好'])assert.equal(helpers.companionChatMessageText(raw,info),'你好');
  for(const text of ['我刚刚吃了个橘子，真的好酸','你说的“回来”是什么意思','我现在在听歌（不是在睡觉）','她说这首歌很好听','沈令仪是你给我起的外号吗'])assert.equal(helpers.companionChatMessageText(text,info),text);
  assert.equal(helpers.companionChatMessageText('**这首歌**很好听',info),'这首歌很好听');
  assert.equal(helpers.companionChatMessageText('「你好」',info),'你好');
});

test('group speaker identities survive filtering and user-authored actions remain untouched',()=>{
  const group={...info,isGroup:true};
  const raw='沈令仪：*她轻笑一声* “回来了？”\n林夏把杯子拿起\n林夏：“晚上好”';
  const clean=helpers.companionChatMessageText(raw,group);
  assert.equal(clean,'沈令仪：回来了？\n林夏：晚上好');
  const html=pipeline.companionConversationMarkup([{role:'assistant',content:raw}],group);
  assert.doesNotMatch(html,/轻笑|杯子/);assert.match(html,/data-sender="shen"/);assert.match(html,/data-sender="lin"/);
  const user=pipeline.companionMessageItems({role:'user',content:narration},info);assert.equal(user[0].content,narration);
});

function requests(raw=mixed){
  const calls=[],history=[{role:'user',content:'hi'},{role:'assistant',content:mixed},{role:'assistant',content:narration}];
  const api=new Function('helpers','info','raw','calls','history',`
    const {companionChatMessageText,companionChatOutputRule,cleanCompanionText,normalizeCompanionReply}=helpers;
    const settings={companionModel:'test',companionMaxTokens:300,companionPresetEnabled:false};
    const companionCharacter=()=>info,companionInstruction=()=> '自定义资料中有小说动作示例',companionMessages=()=>history;
    const companionMainContextText=()=> '正文中的动作仅是资料';
    const companionCompletionPayload=(model,messages)=>({model,messages}),companionResponseText=data=>data.text,companionEmptyReplyError=()=>Error('empty');
    const requestCompanionApi=async(kind,payload)=>{calls.push(payload);return {text:raw};};
    info.ctx.generateQuietPrompt=async payload=>{calls.push(payload);return raw;};
    ${section('  function companionHistoryText','  function companionBookNamesFrom')}
    ${section('  async function requestCustomCompanion','  async function generateCompanionReply')}
    return {requestCustomCompanion,requestSillyTavernCompanion,companionHistoryText};
  `)(helpers,structuredClone(info),raw,calls,history);
  return {...api,calls,history};
}

test('both generation paths enforce chat-only output after materials and filter old assistant narration',async()=>{
  const api=requests();
  assert.equal(await api.requestCustomCompanion(),'还知道回来打招呼啊');
  const messages=api.calls[0].messages;
  assert.match(messages.at(-1).content,/本轮输出要求：只有聊天消息/);
  assert.ok(messages.at(-1).role==='system');
  assert.deepEqual(messages.filter(message=>message.role==='assistant').map(message=>message.content),['还知道回来打招呼啊']);
  assert.doesNotMatch(api.companionHistoryText(),/橘子|眉梢/);
  assert.equal(await api.requestSillyTavernCompanion(),'还知道回来打招呼啊');
  assert.match(api.calls[1].quietPrompt,/本轮输出要求：只有聊天消息/);assert.doesNotMatch(api.calls[1].quietPrompt,/手里那半个橘子/);
  assert.equal(api.calls.length,2,'one completion per task, no automatic rewrite request');
  assert.equal(api.history[1].content,mixed);
});

test('action-only completions are rejected and song protocol lines remain available to the existing parser',async()=>{
  const api=requests(narration);
  await assert.rejects(api.requestCustomCompanion(),/动作、旁白.*已拦截/);
  await assert.rejects(api.requestSillyTavernCompanion(),/动作、旁白.*已拦截/);
  assert.equal(api.calls.length,2);
  const song='今晚想听这首\nSELENE_SONG：夜曲 | 周杰伦';
  assert.equal(helpers.companionChatMessageText(song,info),song);
});
