import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const player = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
const start = player.indexOf('function companionListeningDelta');
const end = player.indexOf('function companionListeningContext', start);

assert.notEqual(start, -1, 'listening delta helper should exist');
assert.notEqual(end, -1, 'listening delta helper boundary should exist');

const companionListeningDelta = new Function(`${player.slice(start, end)};return companionListeningDelta;`)();

test('normal playback counts real elapsed seconds', () => {
  assert.equal(companionListeningDelta(10, 10), 10);
});

test('a forward seek does not add the skipped media duration', () => {
  assert.equal(companionListeningDelta(120, 0.2), 0.2);
});

test('a backward seek cannot subtract or add listening time', () => {
  assert.equal(companionListeningDelta(-30, 0.2), 0);
});

test('background timeupdate gaps still count real playback', () => {
  assert.equal(companionListeningDelta(60, 60), 60);
});

test('playback rate changes do not inflate wall-clock listening time', () => {
  assert.equal(companionListeningDelta(20, 10, 2), 10);
  assert.equal(companionListeningDelta(5, 10, 0.5), 10);
});

test('buffering cannot count time without media progress', () => {
  assert.equal(companionListeningDelta(0, 15), 0);
});
