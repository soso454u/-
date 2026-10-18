import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
const section = (start, end) => {
  const first = source.indexOf(start), last = source.indexOf(end, first);
  assert.ok(first >= 0 && last > first, `missing helpers: ${start}`);
  return source.slice(first, last);
};
const normalizeSongText = value => String(value || '').toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '');
const offlineKey = song => `${normalizeSongText(song?.title)}::${normalizeSongText(song?.artist)}`;
const strip = new Function(`${section('const strip =', 'function currentIsFavorite')};return strip;`)();
const audioHelpers = section('function audioInputUrl', 'function playlistInputUrl');
const { audioInputUrl, directAudioSong } = new Function(`${audioHelpers};return {audioInputUrl,directAudioSong};`)();

test('direct URLs preserve signed parameters, punctuation, parentheses and extensionless paths', () => {
  const signed = 'https://cdn.test/My(song).mp3?token=a%2Bb%2F&sig=x=y!';
  assert.equal(audioInputUrl(signed), signed);
  assert.equal(audioInputUrl('[播放](https://cdn.test/song.mp3?x=1\\&y=2)'), 'https://cdn.test/song.mp3?x=1&y=2');
  assert.equal(audioInputUrl('<a href="https://cdn.test/song.mp3?x=1&amp;y=2">播放</a>'), 'https://cdn.test/song.mp3?x=1&y=2');
  assert.equal(audioInputUrl('https://cdn.test/download?token=abc'), 'https://cdn.test/download?token=abc');
});

test('non-http URLs, credentials, relative paths and pasted code are rejected', () => {
  for (const value of ['javascript:alert(1)', 'file:///song.mp3', 'data:audio/mpeg;base64,abc', '//cdn.test/song.mp3', 'https://user:secret@cdn.test/song.mp3', 'https://cdn.test/song.mp3 <script>']) assert.throws(() => audioInputUrl(value), /http\(s\)/);
});

test('direct song metadata and manual audio survive serialization and saved copies', () => {
  const song = directAudioSong('https://cdn.test/%E7%A8%BB%E9%A6%99.mp3?token=abc');
  assert.equal(song.title, '稻香');
  assert.equal(song.artist, '');
  assert.equal(song.source, 'direct');
  assert.equal(JSON.parse(JSON.stringify(strip(song))).customAudio, song.audio);
});

test('replacing and clearing manual audio updates saved copies without losing platform identity', () => {
  const old = 'https://cdn.test/old.mp3';
  const song = { id: 'netease:1', title: '稻香', artist: '周杰伦', source: 'netease', audio: old, customAudio: old };
  const favorite = { ...song }, queued = { ...song }, unrelated = { ...song, title: '晴天' };
  const settings = { favorites: [favorite, unrelated], playlists: [{ songs: [song] }] };
  let saves = 0;
  const setSongAudio = new Function('offlineKey', 'settings', 'current', 'queue', 'results', 'save', `${audioHelpers};return setSongAudio;`)(offlineKey, settings, null, [queued], [], () => saves++);
  setSongAudio(song, 'https://cdn.test/new.mp3');
  for (const item of [song, favorite, queued]) {
    assert.equal(item.customAudio, 'https://cdn.test/new.mp3');
    assert.equal(item.id, 'netease:1');
    assert.equal(item.audio, '');
  }
  favorite.audio = favorite.customAudio;
  setSongAudio(song, '');
  assert.equal(favorite.audio, '');
  assert.equal(unrelated.customAudio, old);
  assert.equal(saves, 2);
});

const fallbackSource = section('async function gdFallback', 'async function gdMetadata');
function fallback({ gd, meting = async () => null, play, sources = ['netease', 'tencent'] }) {
  return new Function('GD_SOURCES', 'GD_SOURCE_LABELS', 'resolveGdSourceTracks', 'resolveMetingSourceTrack', 'playUrl', 'isNotAllowed', 'console', `${fallbackSource};return gdFallback;`)(sources, {}, gd, meting, play, error => error.name === 'NotAllowedError', { warn() {} });
}

test('unplayable 320k and duplicate candidates do not prevent lower bitrate playback', async () => {
  const tried = [];
  const gdFallback = fallback({ gd: async () => [{ source: 'netease', audio: 'bad' }, { source: 'netease', audio: 'bad' }, { source: 'netease', audio: 'good', bitrate: '128' }], play: async url => { tried.push(url); if (url === 'bad') throw Error('media error'); } });
  const result = await gdFallback({ source: 'netease', offline: true });
  assert.deepEqual(tried, ['bad', 'good']);
  assert.equal(result.bitrate, '128');
  assert.equal(result.offline, false);
});

test('failed GD playback proceeds to Meting and then other platforms', async () => {
  const tried = [];
  const gdFallback = fallback({ gd: async (_, source) => [{ source, audio: `${source}-gd` }], meting: async (_, source) => ({ source, audio: `${source}-meting` }), play: async url => { tried.push(url); if (url !== 'tencent-gd') throw Error('unplayable'); } });
  const result = await gdFallback({ source: 'netease' });
  assert.deepEqual(tried, ['netease-gd', 'netease-meting', 'tencent-gd']);
  assert.equal(result.source, 'tencent');
});

test('browser autoplay denial stops fallback without cycling through every provider', async () => {
  let attempts = 0;
  const denial = Object.assign(Error('tap required'), { name: 'NotAllowedError' });
  const gdFallback = fallback({ gd: async () => [{ audio: 'one' }, { audio: 'two' }], play: async () => { attempts++; throw denial; } });
  await assert.rejects(gdFallback({ source: 'netease' }), error => error === denial);
  assert.equal(attempts, 1);
});

test('superseded playback cannot start a late resolved candidate', async () => {
  let active = true, attempts = 0;
  const gdFallback = fallback({ gd: async () => { active = false; return [{ audio: 'late' }]; }, play: async () => attempts++ });
  assert.equal(await gdFallback({ source: 'netease' }, 0, () => active), null);
  assert.equal(attempts, 0);
});

test('later fallback rounds request fresh temporary URLs', async () => {
  const options = [];
  const gdFallback = fallback({ gd: async (_, source, all, opts) => { options.push(opts); return [{ source, audio: 'good' }]; }, play: async () => {} });
  await gdFallback({ source: 'netease' }, 1);
  assert.equal(options[0].fresh, true);
});

const importSource = section('function playlistSongsFromRows', 'let activeCompanionWorldText');
function importer(settings) {
  const rows = [{ title: '稻香', author: '周杰伦', pic: '', url: 'https://cdn.test/official.mp3?id=1' }];
  return new Function('settings', 'offlineKey', 'strip', 'PLAYLIST_IMPORT_LIMIT', 'playlistInputUrl', 'resolvePlaylistShareLink', 'playlistLinkInfo', 'METING_COVER_APIS', 'fetch', 'playlistMatchesImport', 'save', 'showPlaylists', 'setStatus', 'toast', `${importSource};return {importPlaylist,playlistSongsFromRows};`)(settings, offlineKey, strip, 1000, value => new URL(value).href, async url => ({ url }), () => ({ u: new URL('https://music.163.com/playlist?id=123'), source: 'netease', id: '123', rawId: '123', sourceLabel: '网易云' }), ['https://api.test/'], async () => ({ ok: true, json: async () => rows }), () => true, () => {}, () => {}, () => {}, () => {});
}

test('platform imports retain playable URLs instead of discarding them', () => {
  const { playlistSongsFromRows } = importer({ playlists: [] });
  assert.equal(playlistSongsFromRows([{ title: '稻香', author: '周杰伦', url: 'https://cdn.test/official.mp3?id=1' }], 'netease')[0].audio, 'https://cdn.test/official.mp3?id=1');
  assert.equal(playlistSongsFromRows([{ title: '稻香', author: '周杰伦', url: 'javascript:alert(1)' }], 'netease')[0].audio, '');
});

test('platform sync preserves manual audio and existing playlist identity', async () => {
  const settings = { playlists: [{ id: 'existing', name: '我的音乐', songs: [{ title: '稻香', artist: '周杰伦', customAudio: 'https://cdn.test/manual.mp3' }] }] };
  await importer(settings).importPlaylist('https://music.163.com/playlist?id=123');
  assert.equal(settings.playlists[0].id, 'existing');
  assert.equal(settings.playlists[0].name, '我的音乐');
  assert.equal(settings.playlists[0].songs[0].customAudio, 'https://cdn.test/manual.mp3');
  assert.equal(settings.playlists[0].songs[0].audio, 'https://cdn.test/official.mp3?id=1');
});

const offlineSource = section('async function playOfflineSong', 'const GD_SOURCE_LABELS');
function offlinePlayer(record, onPlay) {
  return new Function('getOfflineSong', 'ROOT', 'releaseOfflineObjectUrl', 'playUrl', 'isNotAllowed', 'console', `let currentCacheObjectUrl='';${offlineSource};return playOfflineSong;`)(async () => record, { URL: { createObjectURL: () => 'blob:cached' } }, () => {}, onPlay, () => false, { warn() {} });
}

test('offline playback uses the matching manual-source cache without a network request', async () => {
  const song = directAudioSong('https://cdn.test/new.mp3', '测试曲');
  const played = [];
  const playOffline = offlinePlayer({ song: { ...song, title: '旧标题' }, blob: { size: 9000 } }, async url => played.push(url));
  const result = await playOffline(song);
  assert.deepEqual(played, ['blob:cached']);
  assert.equal(result.customAudio, song.customAudio);
  assert.equal(result.title, '测试曲');
  assert.equal(result.offline, true);
});

test('an old offline cache cannot override a newly attached manual source', async () => {
  const playOffline = offlinePlayer({ song: { customAudio: 'https://cdn.test/old.mp3' }, blob: { size: 9000 } }, () => assert.fail('stale cache must not play'));
  assert.equal(await playOffline({ customAudio: 'https://cdn.test/new.mp3' }), null);
});
