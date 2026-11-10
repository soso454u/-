import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const source=readFileSync(new URL('../纯音乐播放器.js',import.meta.url),'utf8');
const section=(a,b)=>{const start=source.indexOf(a),end=source.indexOf(b,start);assert.ok(start>=0&&end>start);return source.slice(start,end);};
const matching=section('function normalizeSongText','// Share upstream cooldown');
const urls=section('function getResponseUrl','async function gdCover');
const song={title:'夜曲',artist:'周杰倫',source:'joox',gdSource:'joox',mediaId:'selected'};
const quiet={warn(){}};
function requests(fetch){
  const delays=[];
  const root={AbortController,clearTimeout,setTimeout(fn,delay){
    if(delay<2000){delays.push(delay);return setTimeout(fn,0);}
    return setTimeout(fn,delay);
  }};
  const api=new Function('ROOT','fetch','console',`
    const GD_API='https://music-api.gdstudio.xyz/api.php',gdRate={times:[],until:0};
    ${urls};${section('const gdResponses=','async function lyricJson')};
    return {get:gdJson,fetch:gdFetch,cache:gdResponses,pending:gdRequests,rate:gdRate};
  `)(root,fetch,quiet);
  return {...api,delays,logs:()=>root.__SELENE_GD_DIAGNOSTICS__||[]};
}
function fallback(get,play=async()=>{},active=()=>true,requested=song){
  return new Function('gdJson','playUrl','console',`
    const GD_SOURCES=['netease','joox'],GD_SOURCE_LABELS={joox:'JOOX',netease:'网易云'},isNotAllowed=e=>e.name==='NotAllowedError';
    ${matching};${urls};${section('function gdSong','async function searchSource')};
    ${section('async function resolveGdSourceTracks','async function gdMetadata')};return gdFallback;
  `)(get,play,quiet)(requested,0,active,new Set(),['joox','netease']);
}

test('signed and empty URL responses share only in-flight work, while searches retain caching',async()=>{
  let calls=0;
  const api=requests(async()=>{const n=++calls;await Promise.resolve();return new Response(JSON.stringify(n===1?{url:''}:{url:`https://cdn.test/track?vkey=${n}`}));});
  const params={types:'url',source:'joox',id:'selected',br:'320'};
  const [a,b]=await Promise.all([api.get(params),api.get(params)]);assert.deepEqual(a,b);assert.equal(calls,1);
  assert.equal((await api.get(params)).url,'https://cdn.test/track?vkey=2');
  assert.equal((await api.get(params)).url,'https://cdn.test/track?vkey=3');assert.equal(api.cache.size,0);
  const search={types:'search',source:'joox',name:'夜曲'};await api.get(search);await api.get(search);assert.equal(calls,4);
});

test('an explicit fresh request does not join an older ordinary request',async()=>{
  const pending=[],sent=[];
  const api=requests(url=>{sent.push(String(url));return new Promise(resolve=>pending.push(resolve));});
  const params={types:'url',source:'joox',id:'selected',br:'320'};
  const old=api.get(params),fresh=api.get(params,{fresh:true,nonce:'test'});
  assert.equal(sent.length,2);assert.equal(new URL(sent[1]).searchParams.get('_selene'),'test');
  pending[1](new Response('{"url":"https://cdn.test/fresh"}'));await fresh;
  pending[0](new Response('{"url":""}'));await old;assert.equal(api.pending.size,0);assert.equal(api.cache.size,0);
});

test('HTTP bodies, Safari Load failed, empty URL and malformed responses remain distinct evidence',async()=>{
  const cases=[
    {fetch:async()=>new Response('<html>upstream unavailable</html>',{status:503}),kind:'gateway',status:503,body:/upstream/,message:/上游服务暂时不可用，非本曲问题/},
    {fetch:async()=>new Response('bad request',{status:400}),kind:'http',status:400,body:/bad request/},
    {fetch:async()=>{throw TypeError('Load failed');},kind:'network',message:/Load failed/},
    {fetch:async()=>new Response('upstream garbage'),kind:'invalid-response',status:200,body:/garbage/},
  ];
  for(const item of cases){const api=requests(item.fetch);await assert.rejects(api.get({types:'url',source:'joox',id:'selected'}),error=>{
    assert.equal(error.kind,item.kind);assert.equal(error.status,item.status);assert.equal(error.params.id,'selected');
    if(item.body)assert.match(error.body,item.body);if(item.message)assert.match(error.message,item.message);return true;
  });assert.equal(api.logs()[0].kind,item.kind);}
  const api=requests(async()=>new Response('{"url":"","message":"not available"}'));await api.get({types:'url',source:'joox',id:'selected'});
  assert.equal(api.logs()[0].kind,'empty-url');assert.match(api.logs()[0].body,/not available/);
});

test('transient gateway failures recover with bounded backoff and count actual requests',async()=>{
  const replies=[502,'network',504,200];
  const api=requests(async()=>{
    const status=replies.shift();
    if(status==='network')throw TypeError('Load failed');
    return new Response(status===200?'{"url":"https://cdn.test/recovered.mp3"}':'gateway',{status});
  });
  const params={types:'url',source:'joox',id:'selected'};
  assert.equal((await api.get(params)).url,'https://cdn.test/recovered.mp3');
  assert.equal(api.rate.times.length,4);
  assert.equal(api.delays.length,3);
  assert.ok(api.delays.every((delay,index)=>delay>=220*2**index&&delay<=220*2**index+140));
  assert.equal(api.rate.gatewayDown,0);
});

test('a sustained outage stops each source after its first gateway failure',async()=>{
  const sources=[];let status=503;
  const api=requests(async url=>{
    sources.push(url.searchParams.get('source'));
    return new Response(status===200?'{"url":"https://cdn.test/recovered.mp3"}':'gateway',{status});
  });
  await assert.rejects(fallback(api.get),error=>{
    assert.ok(error.failures.every(source=>source.attempts.length===1&&source.attempts[0].kind==='gateway'));
    return true;
  });
  assert.deepEqual(sources,['joox','joox','joox','joox','netease']);
  assert.ok(api.rate.gatewayDown>Date.now());
  const params={types:'url',source:'joox',id:'selected'};
  status=500;
  await assert.rejects(api.get(params),error=>error.kind==='gateway'&&error.status===500);
  assert.ok(api.rate.gatewayDown>Date.now());
  status=200;
  assert.equal((await api.get(params)).url,'https://cdn.test/recovered.mp3');
  assert.equal(api.rate.gatewayDown,0);
  assert.equal(sources.length,7);
});

test('an aborted backoff and an upstream cooldown both prevent another fetch',async()=>{
  const controller=new AbortController();
  let calls=0;
  const api=requests(async()=>{
    calls++;
    return new Response('gateway',{status:503});
  });
  const pending=api.fetch(new URL('https://music-api.gdstudio.xyz/api.php'),{signal:controller.signal});
  await Promise.resolve();
  assert.equal(api.delays.length,1);
  controller.abort();
  await assert.rejects(pending,{name:'AbortError'});
  assert.equal(calls,1);

  let started=0;
  const limited=requests(async()=>++started===1
    ?new Response('gateway',{status:503})
    :new Response('slow down',{status:429,headers:{'Retry-After':'30'}}));
  const url=new URL('https://music-api.gdstudio.xyz/api.php');
  const retrying=limited.fetch(url),limiting=limited.fetch(url);
  await assert.rejects(limiting,error=>error.status===429&&error.kind==='rate-limit');
  await assert.rejects(retrying,error=>error.kind==='rate-limit'&&error.requestCount===2);
  assert.equal(started,2);
});

test('429 and JSON rate limits retain evidence and stop further network traffic',async()=>{
  for(const response of [()=>new Response('slow down',{status:429,headers:{'Retry-After':'120'}}),()=>new Response('{"code":429,"message":"too many requests"}')]){
    let calls=0;const api=requests(async()=>{calls++;return response();});
    const params={types:'url',source:'joox',id:'selected'};
    await assert.rejects(api.get(params),e=>e.kind==='rate-limit'&&e.limitSource==='upstream'&&e.requestCount===1&&e.retryAt>Date.now()&&!!e.body);
    await assert.rejects(api.get({...params,br:'192'}),e=>e.kind==='rate-limit'&&e.limitSource==='upstream');assert.equal(calls,1);
  }
});

test('past 50 calls, playback and artwork still reach GD until GD reports a cooldown',async()=>{
  let calls=0;
  const api=requests(async()=>{calls++;return new Response('{"url":"https://cdn.test/album.jpg"}');});
  const params={types:'pic',source:'joox',id:'album'};
  await api.get(params);
  api.rate.times=Array(50).fill(Date.now());
  assert.equal((await api.get(params)).url,'https://cdn.test/album.jpg');
  assert.equal((await api.get({...params,id:'other'})).url,'https://cdn.test/album.jpg');
  await api.get({types:'url',source:'joox',id:'selected'});
  assert.equal(calls,3);
  api.rate.until=Date.now()+120000;
  assert.equal((await api.get(params)).url,'https://cdn.test/album.jpg');
  assert.equal((await api.get({...params,id:'third'})).url,'');
  await assert.rejects(api.get({types:'url',source:'joox',id:'selected'}),e=>e.limitSource==='upstream');
  assert.equal(calls,3);
});

test('a temporary empty JOOX result gets one URL-only refresh and success stops all fallback',async()=>{
  const calls=[],plays=[];
  const result=await fallback(async(params,options)=>{calls.push({params,options});return {url:options?.fresh?'https://hk.stream.music.joox.com/ok.mp3':''};},async url=>plays.push(url));
  assert.equal(result.source,'joox');assert.equal(result.refreshed,true);assert.equal(calls.length,6);
  assert.ok(calls.every(c=>c.params.types==='url'&&c.params.id==='selected'));assert.equal(calls.filter(c=>c.options.fresh).length,1);assert.equal(plays.length,1);
});

test('alternate strict-matching JOOX releases also try 192k and never use the cover singer',async()=>{
  const calls=[];
  const result=await fallback(async params=>{
    calls.push(params);
    if(params.types==='search')return [{id:'cover',name:'夜曲',artist:['翻唱者']},{id:'release',name:'夜曲',artist:['周杰倫']}];
    return {url:params.id==='release'&&params.br==='192'?'https://cdn.test/release.mp3':''};
  });
  assert.equal(result.mediaId,'release');assert.equal(result.bitrate,'192');assert.ok(calls.every(c=>c.id!=='cover'));
  assert.deepEqual(calls.filter(c=>c.id==='release').map(c=>c.br),['320','192']);
});

test('a third matching JOOX release can be the only one with a playable 128k address',async()=>{
  const calls=[];
  const result=await fallback(async params=>{
    calls.push(params);
    if(params.types==='search')return params.source==='joox'?[
      {id:'cover',name:'夜曲',artist:['翻唱者']},
      {id:'alternate',name:'夜曲',artist:['周杰倫']},
      {id:'working',name:'夜曲',artist:['周杰倫']}
    ]:[];
    return {url:params.id==='working'&&params.br==='128'?'https://cdn.test/working.mp3':''};
  });
  assert.equal(result.mediaId,'working');
  assert.equal(result.bitrate,'128');
  assert.ok(calls.every(c=>c.source==='joox'&&c.id!=='cover'));
  assert.deepEqual(calls.filter(c=>c.id==='working').map(c=>c.br),['320','192','128']);
});

test('replaying a known JOOX track requests its last successful quality with a new URL',async()=>{
  const calls=[];
  const resolve=async params=>{
    calls.push(params.br);
    return {url:params.br==='128'?'https://cdn.test/working.mp3':''};
  };
  const first=await fallback(resolve);
  calls.length=0;
  const replay=await fallback(resolve,undefined,undefined,first);
  assert.equal(replay.requestedBitrate,'128');
  assert.deepEqual(calls,['128']);
});

test('JOOX only retries network faults that are outside the transport retry policy',async()=>{
  for(const error of [Object.assign(Error('Load failed'),{kind:'network'}),Object.assign(Error('HTTP 503'),{kind:'gateway',status:503,body:'gateway'}),Object.assign(Error('limited'),{kind:'rate-limit',retryAt:Date.now()+120000})]){
    const calls=[];
    await assert.rejects(fallback(async params=>{calls.push(params);if(params.source==='joox')throw error;return [];}),e=>{
      assert.equal(e.failures[0].attempts[0].error,error);return true;
    });
    const joox=calls.filter(c=>c.source==='joox');
    assert.deepEqual(joox.map(c=>c.br),error.kind==='network'?['320','320']:['320']);
    if(error.retryAt)assert.equal(calls.length,1);
  }
});

test('a temporary error fetching the matched JOOX alternate retries that exact ID and quality',async()=>{
  const calls=[];
  const result=await fallback(async(params,options)=>{
    calls.push({...params,fresh:!!options?.fresh});
    if(params.types==='search')return [{id:'release',name:'夜曲',artist:['周杰倫']}];
    if(params.id==='selected')return {url:''};
    if(!options?.fresh)throw Object.assign(TypeError('Failed to fetch'),{kind:'network'});
    return {url:'https://cdn.test/recovered.mp3'};
  });
  assert.equal(result.mediaId,'release');
  assert.equal(result.refreshed,true);
  assert.deepEqual(calls.filter(c=>c.id==='release').map(c=>[c.br,c.fresh]),[['320',false],['320',true]]);
  assert.ok(calls.every(c=>c.source==='joox'));
});

test('expired-media symptoms refresh once and retain the original media error without asserting expiry',async()=>{
  let count=0;const played=[],media={code:4,message:'unsupported or expired'};
  const result=await fallback(async(params,opts)=>{count++;return {url:opts.fresh?'https://cdn.test/new.mp3':'https://cdn.test/stale.mp3'};},async url=>{
    played.push(url);if(url.includes('stale'))throw Object.assign(Error('MEDIA_ERR_SRC_NOT_SUPPORTED'),{media});
  });
  assert.equal(result.audio,'https://cdn.test/new.mp3');assert.equal(count,6);assert.deepEqual(played,['https://cdn.test/stale.mp3','https://cdn.test/new.mp3']);
});

test('cancellation after search prevents a late URL request',async()=>{
  let active=true,count=0;
  const result=await fallback(async()=>{count++;active=false;return [{id:'matched',name:'夜曲',artist:['周杰倫']}];},()=>assert.fail('late playback'),()=>active,{...song,gdSource:''});
  assert.equal(result,null);assert.equal(count,1);
});

function playerHarness(failure=Error('接口未返回播放地址')){
  const warnings=[],pending=[];let selections=0;
  const api=new Function('wait','warnings','console','failure',`
    let playRequest=0,disposed=false,pendingPlaybackSelection=false,playbackWanted=false,playbackPhase='',audioPriming=false,playbackRecoveryCount=0,playbackBlobRetryUsed=false,lyricTimeline=[],currentLyricWords='',lyricState='';
    const failedPlaybackUrls=new Set(),GD_SOURCES=['joox'],GD_SOURCE_LABELS={},settings={},audio={pause(){}},DOC={querySelector:()=>null},ID='test';
    const isVideoEntry=()=>false,bilibiliPlayer={close(){}},playbackSourceChoice=s=>s.choice||'auto',cancelPlaybackProbe=()=>{},applyAudioSessionMode=()=>{},pauseKeepAliveForTrack=()=>{},primeAudioFromGesture=()=>{},updatePlayButton=()=>{},show=()=>{},paintTime=()=>{},setStatus=()=>{},playOfflineSong=()=>wait(),playbackSourceOrder=()=>['joox'],gdFallback=async()=>{throw failure;},isNotAllowed=()=>false,mediaDetail=e=>e.message;
    const clearFailedPlayback=()=>{playbackWanted=false;},toast=(kind,message)=>warnings.push(message);
    ${matching};
    ${section('let pendingPlay=null;','function parse(text)')};
    return {play,cancel:()=>{++playRequest;playbackWanted=false;}};
  `)(()=>{selections++;return new Promise(resolve=>pending.push(resolve));},warnings,quiet,failure);
  return {...api,warnings,pending,selections:()=>selections};
}
test('duplicate play calls share one selection and one warning; later deliberate retry remains available',async()=>{
  const api=playerHarness(),a=api.play({...song}),b=api.play({...song});assert.equal(a,b);assert.equal(api.selections(),1);
  api.pending[0](null);await Promise.all([a,b]);assert.equal(api.warnings.length,1);
  const retry=api.play({...song});assert.equal(api.selections(),2);api.pending[1](null);await retry;assert.equal(api.warnings.length,2);
});
test('separate clicks during the same GD cooldown show one warning',async()=>{
  const api=playerHarness(Object.assign(Error('GD 冷却中'),{retryAt:Date.now()+120000,limitSource:'upstream'}));
  for(let i=0;i<2;i++){
    const attempt=api.play({...song,mediaId:String(i)});
    api.pending[i](null);
    await attempt;
  }
  assert.equal(api.warnings.length,1);
});
test('switching song, choosing a source or cancelling supersedes the old selection without a stale warning',async()=>{
  for(const next of [{...song,mediaId:'other'},{...song,choice:'joox'}]){
    const api=playerHarness(),old=api.play(song),latest=api.play(next);assert.equal(api.selections(),2);
    api.pending[0](null);await old;assert.equal(api.warnings.length,0);api.pending[1](null);await latest;assert.equal(api.warnings.length,1);
  }
  const api=playerHarness(),old=api.play(song);api.cancel();api.pending[0](null);await old;assert.equal(api.warnings.length,0);
});
