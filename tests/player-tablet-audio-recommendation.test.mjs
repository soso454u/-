import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const playerSource = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
const playbackStart = playerSource.indexOf('function playUrl');
const playbackEnd = playerSource.indexOf('async function resolveGdSourceTracks', playbackStart);
const floorStart = playerSource.indexOf('function recentFloorRecommendationKeys');
const floorEnd = playerSource.indexOf('async function recommendation', floorStart);
const rankStart = playerSource.indexOf('function rankCompanionResults');
const rankEnd = playerSource.indexOf('async function searchCompanionChoice', rankStart);
const reliableTapStart = playerSource.indexOf('function bindReliableTap');
const reliableTapEnd = playerSource.indexOf('function bind(', reliableTapStart);

assert.notEqual(playbackStart, -1, 'verified playback helper should exist');
assert.notEqual(playbackEnd, -1, 'verified playback helper boundary should exist');
assert.notEqual(floorStart, -1, 'floor recommendation history helper should exist');
assert.notEqual(floorEnd, -1, 'floor recommendation helper boundary should exist');
assert.notEqual(rankStart, -1, 'exact result ranking helper should exist');
assert.notEqual(rankEnd, -1, 'exact result ranking helper boundary should exist');
assert.notEqual(reliableTapStart, -1, 'reliable touch helper should exist');
assert.notEqual(reliableTapEnd, -1, 'reliable touch helper boundary should exist');

const normalizeSongText = value => String(value || '').toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '');
const offlineKey = song => `${normalizeSongText(song?.title)}::${normalizeSongText(song?.artist)}`;
const parse = text => {
  const block = String(text || '').match(/<music_recommend>([\s\S]*?)<\/music_recommend>/i);
  if (!block) return null;
  const tag = name => block[1].match(new RegExp(`<${name}>\\s*([\\s\\S]*?)\\s*<\\/${name}>`, 'i'))?.[1]?.trim() || '';
  const song = { title: tag('title'), artist: tag('artist') };
  return song.title ? song : null;
};

const { recentFloorRecommendationKeys, floorRecommendationWasUsed } = new Function(
  'parse',
  'offlineKey',
  `${playerSource.slice(floorStart, floorEnd)};return {recentFloorRecommendationKeys,floorRecommendationWasUsed};`,
)(parse, offlineKey);

const recommendationMessage = (title, artist) => ({
  is_user: false,
  mes: `<music_recommend><title>${title}</title><artist>${artist}</artist><reason>测试</reason></music_recommend>`,
});

test('a recommendation repeated within the latest 30 recommendation floors is rejected', () => {
  const chat = [
    recommendationMessage('Time', 'Hans Zimmer'),
    { is_user: true, mes: '继续' },
    recommendationMessage('Cornfield Chase', 'Hans Zimmer'),
    recommendationMessage('Time', 'Hans Zimmer'),
  ];

  assert.equal(floorRecommendationWasUsed({ title: 'Time', artist: 'Hans Zimmer' }, chat, 3, 30), true);
  assert.equal(floorRecommendationWasUsed({ title: 'Experience', artist: 'Ludovico Einaudi' }, chat, 3, 30), false);
});

test('floor dedupe checks 30 recommendation blocks rather than raw chat message count', () => {
  const chat = [recommendationMessage('Old Song', 'Artist')];
  for (let index = 1; index <= 30; index++) {
    chat.push({ is_user: true, mes: `user ${index}` });
    chat.push(recommendationMessage(`Song ${index}`, 'Artist'));
  }

  const keys = recentFloorRecommendationKeys(chat, chat.length, 30);
  assert.equal(keys.size, 30);
  assert.equal(keys.has(offlineKey({ title: 'Old Song', artist: 'Artist' })), false);
  assert.equal(keys.has(offlineKey({ title: 'Song 1', artist: 'Artist' })), true);
});

const rankCompanionResults = new Function(
  'normalizeSongText',
  'offlineKey',
  `${playerSource.slice(rankStart, rankEnd)};return rankCompanionResults;`,
)(normalizeSongText, offlineKey);

test('automatic recommendations prefer the exact title and artist over the first noisy result', () => {
  const rows = [
    { title: '稻香', artist: '周杰伦-/Montagem' },
    { title: '稻香', artist: '周杰伦' },
  ];

  const ranked = rankCompanionResults(rows, { title: '稻香', artist: '周杰伦' });
  assert.equal(ranked[0].song.artist, '周杰伦');
});

class FakeAudio extends EventTarget {
  constructor() {
    super();
    this.currentSrc = '';
    this.duration = Number.NaN;
    this.error = null;
    this.networkState = 2;
    this.paused = true;
    this.readyState = 0;
    this._src = '';
  }

  get src() { return this._src; }
  set src(value) { this._src = value; this.currentSrc = value; }

  play() {
    this.paused = false;
    queueMicrotask(() => this.dispatchEvent(new Event('play')));
    return Promise.resolve();
  }
}

function createPlayUrl(fakeAudio) {
  const playbackSource = playerSource
    .slice(playbackStart, playbackEnd)
    .replaceAll('console.info', 'testConsole.info')
    .replaceAll('console.error', 'testConsole.error');
  return new Function(
    'ROOT',
    'audio',
    'releaseOfflineObjectUrl',
    'mediaText',
    'isNotAllowed',
    'testConsole',
    `${playbackSource};return playUrl;`,
  )(
    { Audio: FakeAudio, setTimeout, clearTimeout },
    fakeAudio,
    () => {},
    code => `media error ${code}`,
    error => error?.name === 'NotAllowedError',
    { info() {}, error() {} },
  );
}

test('the tablet skin handler is not overwritten by the retired inline picker', () => {
  assert.doesNotMatch(playerSource, /setTimeout\(\(\)=>\{skinButton\.onclick=/);
});

test('a touch release activates a header button once and suppresses its synthetic click', () => {
  const bindReliableTap = new Function(
    `${playerSource.slice(reliableTapStart, reliableTapEnd)};return bindReliableTap;`,
  )();
  const button = { style: { setProperty() {} }, onclick: null, onpointerup: null };
  let activations = 0;
  bindReliableTap(button, () => { activations++; });
  const event = type => ({ type, pointerType: 'touch', preventDefault() {}, stopPropagation() {} });

  button.onpointerup(event('pointerup'));
  button.onclick(event('click'));

  assert.equal(activations, 1);
});

test('an accepted play promise is not treated as verified audio before media is playable', async () => {
  const fakeAudio = new FakeAudio();
  const playUrl = createPlayUrl(fakeAudio);
  let settled = false;
  const playback = playUrl('https://example.test/song.mp3').then(() => { settled = true; });
  await new Promise(resolve => setImmediate(resolve));

  assert.equal(settled, false);
  fakeAudio.readyState = 2;
  fakeAudio.duration = 180;
  fakeAudio.dispatchEvent(new Event('canplay'));
  await playback;
  assert.equal(settled, true);
});

test('a source error after play acceptance still rejects and enables fallback', async () => {
  const fakeAudio = new FakeAudio();
  const playUrl = createPlayUrl(fakeAudio);
  const playback = playUrl('https://example.test/broken.mp3');
  const rejection = playback.catch(error => error);
  await new Promise(resolve => setImmediate(resolve));
  fakeAudio.error = { code: 4, message: 'unsupported' };
  fakeAudio.dispatchEvent(new Event('error'));

  const error = await rejection;
  assert.match(error.message, /media error 4/);
});
