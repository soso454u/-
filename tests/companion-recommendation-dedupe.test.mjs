import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const player = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
const helperStart = player.indexOf('function companionPickedEntries');
const helperEnd = player.indexOf('function companionTicketList', helperStart);
const markStart = player.indexOf('function markCompanionPicked');
const markEnd = player.indexOf('function addCurrentToOurSongs', markStart);
const uniqueStart = player.indexOf('async function uniqueCompanionRecommendation');
const uniqueEnd = player.indexOf('async function fulfillCompanionSongRequest', uniqueStart);

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

function makeUniqueRecommendation(overrides = {}) {
  return new Function(
    'companionCharacter',
    'runCompanionTask',
    'companionRecommendationTask',
    'resolveCompanionSongChoice',
    'companionExplicitlyRequestedChoice',
    'companionWasPicked',
    'searchCompanionChoice',
    'play',
    'markCompanionPicked',
    'toast',
    `${player.slice(uniqueStart, uniqueEnd)};return uniqueCompanionRecommendation;`,
  )(
    overrides.companionCharacter || (() => ({ name: 'Selene' })),
    overrides.runCompanionTask,
    overrides.companionRecommendationTask || (value => value),
    overrides.resolveCompanionSongChoice,
    companionExplicitlyRequestedChoice,
    overrides.companionWasPicked,
    overrides.searchCompanionChoice,
    overrides.play,
    overrides.markCompanionPicked,
    overrides.toast || (() => {}),
  );
}

test('a repeated recommendation is rejected and automatically reselected before playback', async () => {
  const replies = ['old reply', 'new reply'];
  const played = [];
  const marked = [];
  const uniqueRecommendation = makeUniqueRecommendation({
    runCompanionTask: async () => replies.shift(),
    resolveCompanionSongChoice: async reply => reply.startsWith('old')
      ? { title: 'Old Song', artist: 'Artist' }
      : { title: 'New Song', artist: 'Artist' },
    companionWasPicked: choice => choice.title === 'Old Song',
    searchCompanionChoice: async choice => choice,
    play: async song => played.push(song.title),
    markCompanionPicked: song => marked.push(song.title),
  });

  const result = await uniqueRecommendation({ maxAttempts: 3 });
  assert.equal(result.song.title, 'New Song');
  assert.deepEqual(played, ['New Song']);
  assert.deepEqual(marked, ['New Song']);
});

test('the resolved search result is checked again before playback', async () => {
  const replies = ['alias reply', 'fresh reply'];
  const played = [];
  const uniqueRecommendation = makeUniqueRecommendation({
    runCompanionTask: async () => replies.shift(),
    resolveCompanionSongChoice: async reply => reply.startsWith('alias')
      ? { title: 'Alias', artist: 'Someone' }
      : { title: 'Fresh Song', artist: 'Artist' },
    companionWasPicked: choice => choice.title === 'Canonical Old Song',
    searchCompanionChoice: async choice => choice.title === 'Alias'
      ? { title: 'Canonical Old Song', artist: 'Artist' }
      : choice,
    play: async song => played.push(song.title),
    markCompanionPicked: () => {},
  });

  const result = await uniqueRecommendation({ maxAttempts: 3 });
  assert.equal(result.song.title, 'Fresh Song');
  assert.deepEqual(played, ['Fresh Song']);
});

test('a song explicitly named by the user may be replayed', async () => {
  const played = [];
  const uniqueRecommendation = makeUniqueRecommendation({
    runCompanionTask: async () => 'named reply',
    resolveCompanionSongChoice: async () => ({ title: '稻香', artist: '周杰伦' }),
    companionWasPicked: () => true,
    searchCompanionChoice: async choice => choice,
    play: async song => played.push(song.title),
    markCompanionPicked: () => {},
  });

  const result = await uniqueRecommendation({ userText: '播放稻香', maxAttempts: 3 });
  assert.equal(result.song.title, '稻香');
  assert.deepEqual(played, ['稻香']);
});
