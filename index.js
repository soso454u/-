// SillyTavern extension entry point.
const ROOT = (() => {
  let root = window;
  try { while (root.parent !== root && root.parent.document) root = root.parent; } catch {}
  return root;
})();

// Every local runtime asset inherits the hot reload token, including lazy reloads.
// This fulfils extension_hot_reload.self_managed_modules in manifest.json.
const PLAYER_MODULE_VERSION = '2.10.79';
const entryUrl = new URL(import.meta.url);
const hotReloadToken = entryUrl.searchParams.get('st_hot_reload');
const extensionAsset = file => {
  const url = new URL(file, entryUrl);
  url.searchParams.set('v', PLAYER_MODULE_VERSION);
  if (hotReloadToken) url.searchParams.set('st_hot_reload', hotReloadToken);
  return url;
};
const playerModuleUrl = () => extensionAsset('纯音乐播放器.js');
let playerLoad;
let playerLoadSequence = 0;
let lifecycleActive = true;
let lifecycleEpoch = 0;
function configureRuntimeAssets() {
  ROOT.__SELENE_EXTENSION_MODE__ = true;
  ROOT.__SELENE_KEEPALIVE_URL__ = extensionAsset('keepalive.m4a').href;
  ROOT.__SELENE_KEEPALIVE_ARTWORK_URL__ = extensionAsset('keepalive-cover.png').href;
}

const DOC = ROOT.document;
const PANEL_ID = 'selene-music-extension-settings';
const FIRST_RUN_KEY = 'selene-music-extension-first-run-v1';
const MENU_DEFAULT_KEY = 'selene-music-extension-menu-default-v1';
let panelObserver;

function api() {
  return ROOT.__SELENE_MUSIC_PLAYER__;
}

function setStatus(text, state = '') {
  const output = DOC.querySelector(`#${PANEL_ID} [data-selene-status]`);
  if (!output) return;
  output.textContent = text;
  output.dataset.state = state;
}

function syncPanel() {
  const controls = api();
  if (!controls) {
    setStatus('播放器未加载，请刷新页面', 'error');
    return;
  }

  const state = controls.getState();
  const versionOutput = DOC.querySelector(`#${PANEL_ID} [data-selene-version]`);
  if (versionOutput && state.version) versionOutput.textContent = `v${state.version}`;
  $('#selene_player_visible').prop('checked', state.visible);
  $('#selene_companion_visible').prop('checked', state.companionVisible);
  $('#selene_auto_show').prop('checked', state.autoShow);
  $('#selene_menu_enabled').prop('checked', state.menuEnabled);
  $('#selene_keep_alive').prop('checked', state.keepAlive);
  $('#selene_audio_session_mode').val(state.audioSessionMode || 'priority');
  const audioPolicyNote = DOC.querySelector(`#${PANEL_ID} [data-selene-audio-policy-note]`);
  if (audioPolicyNote) audioPolicyNote.textContent = state.audioSessionSupported
    ? '允许同时播放会请求与其他应用混音，实际效果由系统与浏览器决定。'
    : '当前浏览器未提供 Audio Session；已保存偏好，同时播放效果由系统与浏览器决定。';
  const keepAliveStatus = DOC.querySelector(`#${PANEL_ID} [data-selene-keepalive-status]`);
  const keepAliveNative = DOC.querySelector(`#${PANEL_ID} [data-selene-keepalive-native]`);
  if (keepAliveStatus) {
    keepAliveStatus.textContent = state.keepAliveActive
      ? state.keepAliveManualTakeover
        ? '已手动回到静音保活'
        : '未选歌曲，静音保活运行中'
      : state.keepAliveSuspended
        ? '当前歌曲已接管系统媒体'
      : state.keepAliveError
        ? `启动失败：${state.keepAliveError}`
      : state.keepAlive
        ? '系统媒体尚未开始播放'
        : '未启动';
    keepAliveStatus.dataset.state = state.keepAliveActive ? 'active' : state.keepAliveError ? 'error' : state.keepAlive ? 'pending' : 'off';
  }
  if (keepAliveNative) keepAliveNative.hidden = !state.keepAlive || state.keepAliveActive || state.keepAliveSuspended;
  setStatus(state.visible ? '播放器窗口已显示' : '播放器窗口已隐藏', state.visible ? 'visible' : 'hidden');
}

function bindSwitch(selector, setter) {
  $(selector).on('input', async function () {
    const controls = api();
    if (!controls) {
      setStatus('播放器未加载，请刷新页面', 'error');
      return;
    }
    await setter(controls, Boolean($(this).prop('checked')));
    syncPanel();
  });
}

function mountPanel() {
  if (DOC.getElementById(PANEL_ID)) return;

  const getContainer = () => $(
    DOC.getElementById('selene_music_container')
    ?? DOC.getElementById('extensions_settings2')
    ?? DOC.getElementById('extensions_settings'),
  );

  getContainer().append(`
    <div id="${PANEL_ID}" class="inline-drawer selene-music-drawer">
      <div class="inline-drawer-toggle inline-drawer-header">
        <b>Selene 音乐播放器</b>
        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
      </div>
      <div class="inline-drawer-content">
        <div class="selene-setting-grid">
          <label class="checkbox_label" for="selene_player_visible">
            <input id="selene_player_visible" type="checkbox">
            <span>显示播放器窗口</span>
          </label>
          <label class="checkbox_label" for="selene_auto_show">
            <input id="selene_auto_show" type="checkbox">
            <span>启动时自动显示</span>
          </label>
          <label class="checkbox_label" for="selene_companion_visible">
            <input id="selene_companion_visible" type="checkbox">
            <span>显示角色陪听窗口</span>
          </label>
          <label class="checkbox_label" for="selene_menu_enabled">
            <input id="selene_menu_enabled" type="checkbox">
            <span>显示扩展菜单入口</span>
          </label>
          <label class="checkbox_label" for="selene_keep_alive">
            <input id="selene_keep_alive" type="checkbox">
            <span>系统媒体保活</span>
          </label>
        </div>
        <small data-selene-keepalive-status data-state="off">未启动</small>
        <div class="selene-keepalive-native" data-selene-keepalive-native hidden></div>
        <label class="selene-audio-policy" for="selene_audio_session_mode">
          <span>与其他应用播放</span>
          <select id="selene_audio_session_mode">
            <option value="priority">优先播放（推荐）</option>
            <option value="mix">允许同时播放</option>
          </select>
        </label>
        <small class="selene-audio-policy-note" data-selene-audio-policy-note></small>
        <div class="selene-setting-actions">
          <button type="button" class="menu_button" data-selene-return-keepalive>回到保活</button>
          <button type="button" class="menu_button" data-selene-reset-position>重置播放器位置</button>
          <button type="button" class="menu_button" data-selene-reset-window>重置窗口尺寸</button>
          <button type="button" class="menu_button" data-selene-reset-companion-position>重置角色陪听位置</button>
        </div>
        <small data-selene-status>正在检查播放器…</small>
        <small class="selene-keepalive-note">“回到保活”会让静音媒体手动接管；下次播放歌曲时会自动让位。</small>
        <small class="selene-version-footer" data-selene-version>版本加载中</small>
      </div>
    </div>`);

  bindSwitch('#selene_player_visible', (controls, value) => controls.setVisible(value));
  bindSwitch('#selene_companion_visible', (controls, value) => controls.setCompanionVisible(value));
  bindSwitch('#selene_auto_show', (controls, value) => controls.setAutoShow(value));
  bindSwitch('#selene_menu_enabled', (controls, value) => controls.setMenuEnabled(value));
  bindSwitch('#selene_keep_alive', (controls, value) => controls.setKeepAlive(value));
  $('#selene_audio_session_mode').on('change', function () {
    api()?.setAudioSessionMode?.(this.value);
    syncPanel();
  });

  api()?.attachKeepAliveControl?.(DOC.querySelector(`#${PANEL_ID} [data-selene-keepalive-native]`));
  $(`#${PANEL_ID} [data-selene-return-keepalive]`).on('click', async () => {
    const controls = api();
    if (!controls?.returnToKeepAlive) {
      setStatus('播放器版本过旧，请刷新页面', 'error');
      return;
    }
    await controls.returnToKeepAlive();
    syncPanel();
  });
  $(`#${PANEL_ID} [data-selene-reset-position]`).on('click', () => {
    api()?.resetPosition();
    syncPanel();
    ROOT.toastr?.success?.('已重置播放器位置');
  });
  $(`#${PANEL_ID} [data-selene-reset-window]`).on('click', () => {
    api()?.resetWindow();
    syncPanel();
    ROOT.toastr?.success?.('已重置播放器窗口');
  });
  $(`#${PANEL_ID} [data-selene-reset-companion-position]`).on('click', () => {
    const controls = api();
    if (!controls?.resetCompanionPosition) {
      setStatus('播放器版本过旧，请刷新页面', 'error');
      return;
    }
    controls.resetCompanionPosition();
    syncPanel();
    ROOT.toastr?.success?.('已重置角色陪听窗口位置');
  });

  // Repair the old hidden-menu state once while still allowing extension users
  // to change the preference afterwards. Fresh installs therefore start on.
  if (!ROOT.localStorage.getItem(MENU_DEFAULT_KEY)) {
    ROOT.localStorage.setItem(MENU_DEFAULT_KEY, '1');
    api()?.setMenuEnabled(true);
  }

  if (!ROOT.localStorage.getItem(FIRST_RUN_KEY)) {
    ROOT.localStorage.setItem(FIRST_RUN_KEY, '1');
    api()?.setVisible(true);
  } else if (api()?.getState().autoShow === false) {
    api()?.setVisible(false, { persist: false });
  } else {
    api()?.setVisible(true, { persist: false });
  }

  ROOT.addEventListener('selene-music-player-state', syncPanel);
  const player = DOC.getElementById('safe-music-player');
  if (player) {
    panelObserver = new ROOT.MutationObserver(syncPanel);
    panelObserver.observe(player, { attributes: true, attributeFilter: ['class'] });
  }
  syncPanel();
}

async function ensurePlayer() {
  configureRuntimeAssets();
  if (DOC.getElementById('safe-music-player')) return;
  if (!playerLoad) {
    const url = playerModuleUrl();
    url.searchParams.set('instance', String(++playerLoadSequence));
    playerLoad = import(url.href).finally(() => { playerLoad = undefined; });
  }
  await playerLoad;
}

async function activateRuntime({ announce = false, forceVisible = false } = {}) {
  lifecycleActive = true;
  const epoch = lifecycleEpoch;
  await ensurePlayer();
  if (!lifecycleActive || epoch !== lifecycleEpoch) return;
  mountPanel();
  if (forceVisible) api()?.setVisible(true);
  syncPanel();
  if (announce) ROOT.toastr?.success?.('Selene 音乐播放器已加载');
}

jQuery(() => {
  if (lifecycleActive) void activateRuntime().catch(error => console.error('[Selene] 播放器加载失败', error));
});

export async function onInstall() {
  await activateRuntime({ announce: true, forceVisible: true });
}

export async function onUpdate() {
  await activateRuntime();
}

export async function onEnable() {
  await activateRuntime({ forceVisible: true });
}

export async function onActivate() {
  await activateRuntime();
}

export async function onDisable() {
  lifecycleActive = false;
  lifecycleEpoch++;
  // A pending dynamic import must settle before we declare the old runtime gone.
  await playerLoad?.catch(() => {});
  if (lifecycleActive) return;
  panelObserver?.disconnect();
  panelObserver = undefined;
  ROOT.removeEventListener('selene-music-player-state', syncPanel);
  ROOT.__SAFE_MUSIC_CLEANUP__?.();
  DOC.getElementById(PANEL_ID)?.remove();
  delete ROOT.__SELENE_EXTENSION_MODE__;
  delete ROOT.__SELENE_KEEPALIVE_URL__;
  delete ROOT.__SELENE_KEEPALIVE_ARTWORK_URL__;
}

export function onHotUnload() {
  return onDisable();
}

export function onDelete() {
  return onDisable();
}
