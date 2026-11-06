// Serve index.js as an ES module in an isolated page with jQuery and
// #extensions_settings. No SillyTavern account, music API or repository writes are needed.
async function runSeleneHotReloadRegression(entryUrl) {
  const checks = [];
  const assert = (ok, message) => { if (!ok) throw Error(message); checks.push(message); };
  const load = async token => {
    const url = new URL(entryUrl, location.href);
    url.searchParams.set('st_hot_reload', token);
    return import(url.href);
  };
  const initialToken = `qa-initial-${Date.now()}`;
  const oldEntry = await load(initialToken);
  await oldEntry.onActivate(); await oldEntry.onActivate();
  assert(document.querySelectorAll('#safe-music-player').length === 1, 'repeated activation keeps one player');
  assert(document.querySelectorAll('#selene-music-extension-settings').length === 1, 'repeated activation keeps one settings panel');
  window.__SELENE_MUSIC_PLAYER__.setCompanionVisible(true);
  const oldAudio = document.getElementById('selene-main-music-media');
  const oldDialog = document.getElementById('safe-music-player-companion');
  const stored = JSON.parse(localStorage.getItem('safe-music-player-v1'));
  await oldEntry.onHotUnload({ reason: 'hot-update' });
  assert(!oldAudio.isConnected && !oldDialog.isConnected, 'hot unload removes media and companion');
  assert(!document.querySelector('[id^="safe-music-player"]'), 'hot unload removes player, menu and injected styles');
  assert(!document.getElementById('selene-music-extension-settings'), 'hot unload removes extension controls');
  assert(!window.__SELENE_MUSIC_PLAYER__, 'hot unload releases the public runtime');
  const token = `qa-fresh-${Date.now()}`;
  const freshEntry = await load(token);
  await freshEntry.onUpdate(); await freshEntry.onActivate();
  assert(document.querySelectorAll('#safe-music-player').length === 1, 'update and activate share one fresh runtime');
  assert(document.querySelectorAll('#selene-music-extension-settings').length === 1, 'hot activation creates one settings panel');
  const restored = JSON.parse(localStorage.getItem('safe-music-player-v1'));
  assert(JSON.stringify(restored.favorites) === JSON.stringify(stored.favorites), 'hot activation retains favorites');
  assert(JSON.stringify(restored.playlists) === JSON.stringify(stored.playlists), 'hot activation retains playlists');
  assert(restored.skin === stored.skin, 'hot activation retains selected appearance');
  const runtimeUrl = performance.getEntriesByType('resource').map(item => new URL(item.name)).find(url => decodeURIComponent(url.pathname).endsWith('/纯音乐播放器.js') && url.searchParams.get('st_hot_reload') === token);
  assert(runtimeUrl?.searchParams.get('v') === window.__SELENE_MUSIC_PLAYER__.getState().version, 'runtime URL carries the release version and hot reload token');
  assert(new URL(window.__SELENE_KEEPALIVE_URL__).searchParams.get('st_hot_reload') === token, 'media asset URL inherits the same hot reload token');
  await freshEntry.onDisable(); await freshEntry.onEnable();
  assert(document.querySelectorAll('#safe-music-player').length === 1, 'disable and enable create one functioning runtime');
  await freshEntry.onHotUnload();
  const racingEntry = await load(`qa-pending-${Date.now()}`);
  const activating = racingEntry.onActivate();
  await racingEntry.onDisable(); await activating;
  assert(!document.getElementById('safe-music-player'), 'disable waits for an in-flight import without resurrecting the player');
  await racingEntry.onEnable();
  assert(Boolean(window.__SELENE_MUSIC_PLAYER__), 'a disabled in-flight import can be enabled again');
  return { passed: checks.length };
}
