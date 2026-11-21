import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const source=readFileSync(new URL('../纯音乐播放器.js',import.meta.url),'utf8');
const section=(a,b)=>{const start=source.indexOf(a),end=source.indexOf(b,start);assert.ok(start>=0&&end>start);return source.slice(start,end);};
function harness({helper={},load=async()=>({entries:{}})}={}){
  const character={name:'沈令仪',avatar:'沈令仪.png',description:'旧副本',data:{description:'{{char}}喜欢和{{user}}谈音乐',personality:'直率',scenario:'角色卡原场景',mes_example:'角色卡示例',extensions:{world:'角色主书'}}};
  const ctx={name1:'小余',characterId:0,characters:[character],chat:[],chatMetadata:{scenario:'当前聊天场景',mes_example:'本聊天示例'},powerUserSettings:{persona_description:'{{user}}喜欢安静',persona_description_lorebook:'Persona书'},loadWorldInfo:load};
  const info={name:character.name,character,ctx,isMulti:false,isGroup:false};
  const ROOT={TavernHelper:helper},DOC={getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[]};
  const api=new Function('ROOT','DOC','info',`
    const baseCompanionCharacter=()=>info,companionCharacter=()=>info,companionMessages=()=>[],companionMemberCharacter=member=>member?.character||null;
    const companionRoleCardText=()=> '角色资料',companionMultiWorldText=async()=>'',cleanCompanionPersonName=x=>x;
    ${section('  function companionLiveDescription','  function companionMemberCharacter')}
    ${section('  function companionProseContext','  function companionInstruction')}
    ${section('  function companionBookNamesFrom','  const COMPANION_ROSTER_SCAN_VERSION')}
    ${section('  async function companionWorldText','  function companionApiBase')}
    return {companionCardText,companionUserPersona,companionAttachedBookNames,companionRosterBookNames,companionWorldMatch,companionWorldEntryActive,companionWorldText,companionProseContext,companionMainContextRows};
  `)(ROOT,DOC,info);
  return {...api,character,ctx,info};
}

test('canonical card fields, chat overrides and User Persona keep their own identities',()=>{
  const api=harness(),text=api.companionCardText(api.character,api.info);
  assert.match(text,/沈令仪喜欢和小余谈音乐/);assert.doesNotMatch(text,/旧副本|角色卡原场景/);
  assert.match(text,/当前聊天场景/);assert.match(text,/本聊天示例/);assert.match(text,/示例对话（不是已发生事件）/);
  assert.match(api.companionUserPersona(api.info),/小余喜欢安静/);
  const other={name:'林夏',data:{description:'{{char}}的资料',scenario:'另一位的场景'}};
  const otherText=api.companionCardText(other,api.info);assert.match(otherText,/林夏的资料/);assert.match(otherText,/另一位的场景/);assert.doesNotMatch(otherText,/当前聊天场景/);
});

test('binding reads cover character primary/additional, Persona, chat and globals without creating books',async()=>{
  const calls=[],api=harness({helper:{
    getCharWorldbookNames(name){calls.push(name);return {primary:'角色主书',additional:['角色附加书']};},
    getChatWorldbookName:()=> '聊天书',getGlobalWorldbookNames:()=> ['全局书','角色主书'],
    getOrCreateChatWorldbook(){assert.fail('must not create a worldbook');},
  }});
  assert.deepEqual(await api.companionAttachedBookNames(api.info),['角色主书','角色附加书','Persona书','聊天书','全局书']);
  assert.deepEqual(calls,['沈令仪']);
  assert.deepEqual(await api.companionRosterBookNames(api.info),['角色主书','角色附加书']);
});

test('read-only matching respects disabled/filter/stateful entries, depth, regex and secondary keys',()=>{
  const api=harness(),entry={content:'setting',key:['/night/i'],selective:true,keysecondary:['rain'],selectiveLogic:0};
  assert.equal(api.companionWorldEntryActive(entry,'NIGHT rain',api.info),true);
  assert.equal(api.companionWorldEntryActive(entry,'NIGHT sun',api.info),false);
  for(const extra of [{disable:true},{enabled:false},{sticky:2},{cooldown:2},{useProbability:true,probability:50},{group:'random'},{triggers:['swipe']},{characterFilter:{names:['另一人'],isExclude:false}}])assert.equal(api.companionWorldEntryActive({...entry,constant:true,...extra},'NIGHT rain',api.info),false);
  const scan={task:'',rows:['old trigger','new message']};
  assert.equal(api.companionWorldEntryActive({content:'setting',key:['trigger'],scanDepth:1},scan,api.info),false);
  assert.equal(api.companionWorldEntryActive({content:'setting',key:['trigger'],scanDepth:2},scan,api.info),true);
  assert.equal(api.companionWorldEntryActive({content:'setting',key:['小余'],scanDepth:0,matchPersonaDescription:true},scan,api.info),true);
  assert.equal(api.companionWorldEntryActive({content:'setting',key:['当前聊天场景'],scanDepth:0,matchScenario:true},scan,api.info),true);
  assert.equal(api.companionWorldMatch('catalog','cat',{matchWholeWords:true}),false);
});

test('one failed book does not remove other matched books, and phone output wrappers stay out of prompts',async()=>{
  const original={uid:1,constant:true,comment:'人物背景',content:'{{char}}保持自己的判断'};
  const api=harness({helper:{getCharWorldbookNames:()=>({primary:'角色主书',additional:['坏书','好书']})},load:async name=>{
    if(name==='坏书')throw Error('unavailable');
    return {entries:{1:original,2:{uid:2,constant:true,comment:'IM丨线上规则',content:'输出手机 JSON'},3:{uid:3,disable:true,constant:true,content:'禁用设定'}}};
  }});
  const text=await api.companionWorldText(api.info);
  assert.match(text,/沈令仪保持自己的判断/);assert.doesNotMatch(text,/输出手机 JSON|禁用设定/);
  assert.equal((text.match(/保持自己的判断/g)||[]).length,1);assert.equal(original.content,'{{char}}保持自己的判断');
  api.ctx.chat=[{is_user:true,mes:'公开内容<think>隐藏思考</think><chat>另一段手机私聊</chat>'},{is_system:true,mes:'系统内部消息'}];
  assert.deepEqual(api.companionMainContextRows(api.info),[{role:'user',content:'公开内容[手机内容不在本会话知情范围]'}]);
});
