import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
function section(start, end) {
  const first = source.indexOf(start), last = source.indexOf(end, first);
  assert.ok(first >= 0 && last > first, `missing section: ${start}`);
  return source.slice(first, last);
}

function loadSettings(saved, { extension = false, failWrite = false } = {}) {
  const notices = [];
  const ROOT = {
    localStorage: {
      getItem: () => JSON.stringify(saved),
      setItem: () => { if (failWrite) throw Object.assign(Error('Storage full'), { name: 'QuotaExceededError' }); },
    },
    toastr: { warning: message => notices.push(message) },
  };
  return new Function('ROOT', 'KEY', 'defaults', 'DEFAULT_COMPANION_PRESET', 'LEGACY_COMPANION_PRESET_V2', 'EXTENSION_MODE', 'console', `${section('let settings,storageWriteWarningShown', 'const audio = new ROOT.Audio')};return {settings,persistSettings,notices:ROOT.toastr};`)(ROOT, 'test', { enabled: true, menuEnabled: true }, 'new preset', 'old preset', extension, { warn() {} });
}

test('explicitly enabling the standalone script reveals a previously closed player and repairs its menu', () => {
  const { settings } = loadSettings({ enabled: false, menuEnabled: false, companionPresetVersion: 3 });
  assert.equal(settings.enabled, true);
  assert.equal(settings.menuEnabled, true);
});

test('extension mode retains its existing startup visibility preference', () => {
  const { settings } = loadSettings({ enabled: false, menuEnabled: false, autoShow: false, companionPresetVersion: 3 }, { extension: true });
  assert.equal(settings.enabled, false);
  assert.equal(settings.menuEnabled, false);
  assert.equal(settings.autoShow, false);
});

test('failed preset migration writes cannot discard existing songs and playlists', () => {
  const favorites = [{ title: '稻香', artist: '周杰伦' }];
  const playlists = [{ id: 'keep', songs: favorites }];
  const { settings, persistSettings } = loadSettings({ favorites, playlists, companionPresetVersion: 2 }, { failWrite: true });
  assert.deepEqual(settings.favorites, favorites);
  assert.deepEqual(settings.playlists, playlists);
  assert.equal(settings.companionPresetVersion, 3);
  assert.equal(persistSettings(), false);
});

function visibilityController(save) {
  const classes = new Set(), properties = new Map(), events = [];
  const player = {
    hidden: false,
    classList: { toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name) },
    style: { setProperty: (name, value, priority) => properties.set(name, { value, priority }), removeProperty: name => properties.delete(name) },
  };
  const settings = { enabled: true };
  const controller = new Function('DOC', 'ID', 'settings', 'save', 'emitPublicState', 'publicState', `${section('function applyPlayerVisibility', 'function setPublicCompanionVisible')};return setPublicVisible;`)(
    { getElementById: id => id === 'player' ? player : null }, 'player', settings,
    () => { events.push({ hiddenAtSave: player.hidden }); return save?.(); }, () => events.push('state'), () => ({ visible: !player.hidden }),
  );
  return { controller, player, classes, properties, events };
}

test('closing hides the DOM before persistence and survives an unsuccessful save', () => {
  const { controller, player, classes, properties, events } = visibilityController(() => false);
  assert.equal(controller(false).visible, false);
  assert.equal(player.hidden, true);
  assert.equal(classes.has('hidden'), true);
  assert.deepEqual(properties.get('display'), { value: 'none', priority: 'important' });
  assert.deepEqual(events[0], { hiddenAtSave: true });
});

test('reopening clears every hiding state and nonpersistent visibility changes do not write storage', () => {
  const { controller, player, classes, properties, events } = visibilityController();
  controller(false);
  events.length = 0;
  assert.equal(controller(true, { persist: false }).visible, true);
  assert.equal(player.hidden, false);
  assert.equal(classes.has('hidden'), false);
  assert.equal(properties.has('display'), false);
  assert.deepEqual(events, ['state']);
});

test('pagehide unloads the owning runtime while a browser back-forward cache transition preserves it', () => {
  let cleanups = 0;
  const handlePageHide = new Function('cleanupPlayer', `${section('function handlePlayerPageHide', 'ROOT.__SAFE_MUSIC_CLEANUP__=cleanupPlayer')};return handlePlayerPageHide;`)(() => cleanups++);
  handlePageHide({ persisted: true });
  assert.equal(cleanups, 0);
  handlePageHide({ persisted: false });
  assert.equal(cleanups, 1);
});

test('a stale runtime cleanup cannot remove a newer player instance', () => {
  const staleCleanup = new Function('ROOT', `let disposed=false;${section('function cleanupPlayer', 'function handlePlayerPageHide')};return cleanupPlayer;`)({ __SAFE_MUSIC_CLEANUP__: () => {} });
  assert.doesNotThrow(() => staleCleanup());
});
