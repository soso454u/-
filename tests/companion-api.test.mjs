import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source=readFileSync(new URL('../纯音乐播放器.js',import.meta.url),'utf8');
const section=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start)));
const base='https://ark.cn-beijing.volces.com/api/coding/v3';
function fixture({transport=async()=>new Response('{"data":[{"id":"ark-code-latest"}]}'),headers={'X-CSRF-Token':'csrf-test'},hasST=true,ctx=null,direct}={}){
  const calls=[],settings={companionApiUrl:base,companionApiKey:'test-private/key',companionModel:'ark-code-latest',companionMaxTokens:300};
  const ROOT={AbortController,setTimeout,clearTimeout,fetch:async(...args)=>{calls.push(args);return transport(...args);}};
  if(hasST){ROOT.SillyTavern={};ROOT.getRequestHeaders=()=>headers;}
  const context=()=>ctx;
  const api=new Function('ROOT','settings','context','Headers','fetch',`${section('function companionApiBase','function casualizeCompanionPunctuation')};return{companionApiBase,companionEndpoint,companionModelsEndpoint,requestCompanionApi,companionModelIds};`)(ROOT,settings,context,Headers,direct||(()=>{throw Error('unexpected browser direct request');}));
  return{...api,ROOT,settings,calls};
}

test('complete/base URLs preserve provider paths instead of appending v1 to v3',()=>{
  const api=fixture();
  for(const value of [base,base+'/',base+'/chat/completions',base+'/models']){
    assert.equal(api.companionEndpoint(value),base+'/chat/completions');
    assert.equal(api.companionModelsEndpoint(value),base+'/models');
  }
  assert.equal(api.companionEndpoint('https://example.com'),'https://example.com/v1/chat/completions');
  assert.equal(api.companionEndpoint('https://example.com/api/v3'),'https://example.com/api/v3/chat/completions');
  assert.equal(api.companionEndpoint('https://example.com/prefix/v1/'),'https://example.com/prefix/v1/chat/completions');
});

test('models use ST status with live CSRF, credentials and the caller key; no browser upstream call',async()=>{
  const api=fixture();await api.requestCompanionApi('models');
  const [url,options]=api.calls[0],body=JSON.parse(options.body);
  assert.equal(url,'/api/backends/chat-completions/status');
  assert.equal(options.method,'POST');assert.equal(options.credentials,'same-origin');
  assert.equal(options.headers.get('X-CSRF-Token'),'csrf-test');
  assert.equal(options.headers.has('Authorization'),false);
  assert.equal(body.custom_url,base);assert.equal(body.chat_completion_source,'custom');
  assert.equal(JSON.parse(body.custom_include_headers).Authorization,'Bearer test-private/key');
});

test('completion uses the same ST transport and preserves messages, model and output length',async()=>{
  const api=fixture({transport:async()=>new Response('{"choices":[{"message":{"content":"hello"}}]}')});
  const messages=[{role:'system',content:'character'},{role:'user',content:'hi'}];
  const data=await api.requestCompanionApi('completion',{model:'ark-code-latest',messages,max_tokens:300,temperature:.85,stream:false});
  const [url,options]=api.calls[0],body=JSON.parse(options.body);
  assert.equal(url,'/api/backends/chat-completions/generate');
  assert.deepEqual(body.messages,messages);assert.equal(body.model,'ark-code-latest');
  assert.equal(body.max_tokens,300);assert.equal(body.stream,false);assert.equal(body.custom_prompt_post_processing,'');
  assert.equal(data.choices[0].message.content,'hello');
});

test('context header getter keeps its owner and missing CSRF never triggers a direct retry',async()=>{
  const ctx={token:'owned-csrf',getRequestHeaders(){return{'X-CSRF-Token':this.token};}};
  const api=fixture({ctx});await api.requestCompanionApi('models');
  assert.equal(api.calls[0][1].headers.get('X-CSRF-Token'),'owned-csrf');
  const missing=fixture({headers:{}});
  await assert.rejects(missing.requestCompanionApi('models'),/CSRF/);assert.equal(missing.calls.length,0);
});

test('API errors inside HTTP 200 are detected and never reveal the key',async()=>{
  const api=fixture({transport:async()=>new Response(JSON.stringify({error:{status:401,message:'denied test-private/key'}}))});
  await assert.rejects(api.requestCompanionApi('models'),error=>error.status===401&&error.message.includes('[已隐藏]')&&!error.message.includes('test-private/key'));
  assert.equal(api.calls.length,1);
});

test('failed proxy calls never switch the Coding Plan URL or fall back to the browser',async()=>{
  const api=fixture({transport:async()=>{throw new TypeError('Failed to fetch');}});
  await assert.rejects(api.requestCompanionApi('models'),/酒馆后端连接失败/);
  assert.equal(api.calls.length,1);assert.equal(JSON.parse(api.calls[0][1].body).custom_url,base);
  const missing=fixture({transport:async()=>new Response('{"error":{"message":"models unavailable"}}',{status:404})});
  await assert.rejects(missing.requestCompanionApi('models'),error=>error.status===404);
  assert.equal(missing.calls.length,1);
});

test('blank local API keys explicitly override a stored ST key and nested model results are recognized',async()=>{
  const api=fixture();api.settings.companionApiKey='';await api.requestCompanionApi('models');
  assert.equal(JSON.parse(JSON.parse(api.calls[0][1].body).custom_include_headers).Authorization,'');
  assert.deepEqual(api.companionModelIds({result:{models:[{id:'b'},{model_id:'a'},{name:'a'},' c ',{}]}}),['a','b','c']);
});

test('non-ST environments retain direct compatibility with the normalized endpoint',async()=>{
  const calls=[],api=fixture({hasST:false,direct:async(...args)=>{calls.push(args);return new Response('{"data":[]}');}});
  await api.requestCompanionApi('models');assert.equal(calls[0][0],base+'/models');assert.equal(calls[0][1].method,'GET');
});

test('missing model-list support keeps manual selection available and restores the fetch button',async()=>{
  const settings={companionApiUrl:base,companionApiKey:'fake-key'},status={textContent:''},button={disabled:false};
  const dialog={querySelector:selector=>selector==='[data-model-status]'?status:button};
  let saved=false;
  const fetchModels=new Function('DOC','ID','settings','requestCompanionApi','companionModelIds','save','renderCompanionModelOptions','openCompanionModelPicker','toast',`${section('async function fetchCompanionModels','function openCompanionModelPicker')};return fetchCompanionModels;`)(
    {getElementById:()=>dialog},'player',settings,async()=>({data:[]}),()=>[],()=>{saved=true;},()=>{},()=>{},()=>{},
  );
  await fetchModels();assert.equal(button.disabled,false);assert.equal(saved,false);
  assert.match(status.textContent,/手动填写 ark-code-latest/);
});
