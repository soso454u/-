import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const player = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
const start = player.indexOf('const COMPANION_ROSTER_SCAN_VERSION=');
const end = player.indexOf('function companionCharacterDescription', start);

assert.notEqual(start, -1, 'scanner helpers should exist');
assert.notEqual(end, -1, 'scanner helper boundary should exist');

const helpers = new Function(`${player.slice(start, end)};return {companionEntryPersonaEvidence,companionPersonaEntryCandidates};`)();
const evidence = entry => helpers.companionEntryPersonaEvidence(entry, entry.uid ?? 'test');
const candidates = entry => helpers.companionPersonaEntryCandidates(entry, entry.uid ?? 'test');

test('a name keyword cannot turn an event into a persona entry', () => {
  const entry = { comment: '沈宴棠生日事件', key: ['沈宴棠'], content: '沈宴棠生日时会触发特殊剧情。' };
  assert.equal(evidence(entry), false);
  assert.deepEqual(candidates(entry), []);
});

test('a person-shaped title cannot turn plot prose into a persona entry', () => {
  const entry = { comment: '沈宴棠', key: ['沈宴棠'], content: '下雨时触发特殊剧情，随后推进主线。' };
  assert.equal(evidence(entry), false);
  assert.deepEqual(candidates(entry), []);
});

test('a person title plus multiple profile fields is a persona entry', () => {
  const entry = { comment: '沈宴棠', key: ['沈宴棠'], content: '性格：冷静克制\n外貌：黑发，深色眼睛' };
  assert.equal(evidence(entry), true);
  assert.deepEqual(candidates(entry), ['沈宴棠']);
});

test('a person title plus one explicit profile field is enough', () => {
  const entry = { comment: '沈宴棠', key: ['沈宴棠'], content: '**性格**：冷静克制' };
  assert.equal(evidence(entry), true);
  assert.deepEqual(candidates(entry), ['沈宴棠']);
});

test('an explicit name field proves identity without relying on keywords', () => {
  const entry = { comment: '人物资料', key: ['雨夜'], content: '姓名：沈宴棠\n性格：冷静克制' };
  assert.equal(evidence(entry), true);
  assert.deepEqual(candidates(entry), ['沈宴棠']);
});

test('a confirmed generic persona entry may use one name keyword for ownership', () => {
  const entry = { comment: '角色档案', key: ['沈宴棠'], content: '身份：医生\n性格：冷静克制' };
  assert.equal(evidence(entry), true);
  assert.deepEqual(candidates(entry), ['沈宴棠']);
});

test('ambiguous keywords cannot manufacture several contacts', () => {
  const entry = { comment: '人物设定', key: ['沈宴棠', '陆淮安'], content: '身份：医生\n性格：冷静克制' };
  assert.equal(evidence(entry), true);
  assert.deepEqual(candidates(entry), []);
});

test('generic background and relationship fields alone are not persona proof', () => {
  const entry = { comment: '关系推进', key: ['沈宴棠'], content: '背景：雨夜\n关系：两人的误会加深' };
  assert.equal(evidence(entry), false);
  assert.deepEqual(candidates(entry), []);
});
