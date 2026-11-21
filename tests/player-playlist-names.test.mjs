import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const source=readFileSync(new URL('../纯音乐播放器.js',import.meta.url),'utf8');
function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a);return source.slice(a,b);}
function harness(metadata={code:200,result:{id:123,name:'网易云真实歌单'}},playlists=[]){
  const requests=[],timeouts=[],settings={playlists};
  const fetch=async target=>{
    const url=String(target);requests.push(url);
    if(url.startsWith('https://meting.test'))return {ok:true,json:async()=>[{id:8,name:'Song',artist:'Artist'}]};
    if(url.includes('music.163.com'))return {ok:true,json:async()=>{if(metadata instanceof Error)throw metadata;return metadata;}};
    if(url.includes('y.qq.com'))return {ok:true,text:async()=>'<metadata fixture>'};
    throw Error('unexpected request');
  };
  const api=new Function('settings','fetch','timeouts',`
    const PLAYLIST_SOURCE_LABELS={netease:'网易云音乐',tencent:'QQ 音乐',kugou:'酷狗音乐'},PLAYLIST_IMPORT_LIMIT=1000,METING_COVER_APIS=['https://meting.test/api'];
    const ROOT={AbortController,prompt:()=> '我的自定名称',setTimeout(fn,delay){timeouts.push(delay);return 1;},clearTimeout(){}};
    const meta={type:'music.playlist',url:'https://y.qq.com/n/ryqq_v2/playlist/123',title:'QQ 真实歌单 - QQ音乐'};
    const DOC={createElement:()=>({content:{querySelector:selector=>({content:meta[selector.match(/og:([^\"]+)/)[1]]})}})};
    const context=()=>null,setStatus=()=>{},toast=()=>{},save=()=>{},showPlaylists=()=>{},console={warn(){}};
    const getSongTitle=s=>s.name,getSongArtist=s=>s.artist,getSongAlbum=()=>'',songDuration=()=>0,getResponseUrl=()=>'',metingPlaybackId=x=>String(x.id),strip=s=>({...s}),offlineKey=s=>s.title+'::'+s.artist,lyricVersion=()=>'';
    ${section('  function playlistInputUrl','  let activeCompanionWorldText=')}
    ${section('  function renamePlaylist','  function askForPlaylist')}
    return {importPlaylist,renamePlaylist,qqPlaylistTitle,neteasePlaylistTitle,neteasePlaylistTitleFromShare,fetchNeteasePlaylistTitle};
  `)(settings,fetch,timeouts);
  return {...api,settings,requests,timeouts};
}

test('QQ and NetEase imports use verified names and merge into existing placeholder playlists',async()=>{
  for(const [platform,url,expected] of [
    ['netease','https://music.163.com/playlist?id=123','网易云真实歌单'],
    ['tencent','https://y.qq.com/n/ryqq_v2/playlist/123','QQ 真实歌单'],
  ]){
    const placeholder={id:'local',name:platform==='netease'?'网易云音乐歌单 123':'QQ 音乐歌单',importSource:platform,importSourceId:'123',songs:[]};
    const api=harness(undefined,[placeholder]);await api.importPlaylist(url);
    assert.equal(api.settings.playlists.length,1);assert.equal(placeholder.name,expected);assert.equal(placeholder.songs.length,1);
    assert.ok(api.timeouts.includes(4000));
    api.renamePlaylist(placeholder);assert.equal(placeholder.importNameEdited,true);
    const count=api.requests.length;await api.importPlaylist(url);
    assert.equal(placeholder.name,'我的自定名称');assert.equal(api.requests.length,count+1,'refresh reads songs without another name lookup');
  }
});

test('quoted share names avoid metadata requests, strip platform suffixes and preserve custom names',async()=>{
  const api=harness();
  await api.importPlaylist('分享歌单「夜里的月亮」 https://music.163.com/playlist?id=123');
  assert.equal(api.settings.playlists[0].name,'夜里的月亮');assert.equal(api.requests.length,1);
  assert.equal(api.neteasePlaylistTitle('月光 - 歌单 - 网易云音乐'),'月光');
  assert.equal(api.qqPlaylistTitle('月光 - QQ音乐'),'月光');
  await api.importPlaylist('分享歌单「平台新名称」 https://music.163.com/playlist?id=123');
  assert.equal(api.settings.playlists[0].name,'夜里的月亮');
});

test('failed, generic or mismatched official metadata never replaces placeholders or interrupts song import',async()=>{
  for(const metadata of [Error('offline'),{code:500},{code:200,result:{id:999,name:'错误歌单'}},{code:200,result:{id:123,name:'网易云音乐'}}]){
    const api=harness(metadata);await api.importPlaylist('https://music.163.com/playlist?id=123');
    assert.equal(api.settings.playlists[0].name,'网易云音乐歌单');assert.equal(api.settings.playlists[0].songs.length,1);
  }
  const api=harness({code:200,playlist:{id:123,name:'新版响应歌单'}});
  assert.equal(await api.fetchNeteasePlaylistTitle('123'),'新版响应歌单');
  const count=api.requests.length;assert.equal(await api.fetchNeteasePlaylistTitle('invalid'),'');assert.equal(api.requests.length,count);
});
