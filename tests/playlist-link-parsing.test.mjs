import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const player = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
const start = player.indexOf('function playlistInputUrl');
const end = player.indexOf('function playlistShareSource', start);

assert.notEqual(start, -1, 'playlist URL parser should exist');
assert.notEqual(end, -1, 'playlist parser boundary should exist');

const helpers = new Function(
  `const PLAYLIST_SOURCE_LABELS={netease:'网易云音乐',tencent:'QQ 音乐',kugou:'酷狗音乐'};${player.slice(start, end)};return {playlistInputUrl,playlistLinkInfo};`,
)();

test('parses a NetEase share message with a Markdown-escaped ampersand', () => {
  const input = '【分享歌单: 废粼喜欢的音乐 废粼 [https://music.163.com/m/playlist?id=417272188&creatorId=301042399](https://music.163.com/m/playlist?id=417272188\\&creatorId=301042399) 】';
  const url = new URL(helpers.playlistInputUrl(input));
  const info = helpers.playlistLinkInfo(input);

  assert.equal(url.searchParams.get('id'), '417272188');
  assert.equal(url.searchParams.get('creatorId'), '301042399');
  assert.equal(info.source, 'netease');
  assert.equal(info.id, '417272188');
});

test('restores escaped query separators before parsing a plain URL', () => {
  const input = 'https://music.163.com/m/playlist?id=417272188\\&creatorId=301042399';
  assert.equal(helpers.playlistInputUrl(input), 'https://music.163.com/m/playlist?id=417272188&creatorId=301042399');
});
