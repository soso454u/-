// SillyTavern extension entry point.
import './纯音乐播放器.js';

const ROOT = (() => {
  try {
    return window.parent?.document ? window.parent : window;
  } catch {
    return window;
  }
})();

const DOC = ROOT.document;
const PANEL_ID = 'selene-music-extension-settings';
const FIRST_RUN_KEY = 'selene-music-extension-first-run-v1';
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
  $('#selene_player_visible').prop('checked', state.visible);
  $('#selene_auto_show').prop('checked', state.autoShow);
  $('#selene_menu_enabled').prop('checked', state.menuEnabled);
  $('#selene_keep_alive').prop('checked', state.keepAlive);
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

jQuery(() => {
  if (DOC.getElementById(PANEL_ID)) return;

  const getContainer = () => $(
    DOC.getElementById('selene_music_container')
    ?? DOC.getElementById('extensions_settings2')
    ?? DOC.getElementById('extensions_settings'),
  );

  getContainer().append(`
    <div id="${PANEL_ID}" class="inline-drawer selene-music-drawer">
      <div class="inline-drawer-toggle inline-drawer-header">
        <b><i class="fa-solid fa-music"></i> Selene 音乐播放器</b>
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
          <label class="checkbox_label" for="selene_menu_enabled">
            <input id="selene_menu_enabled" type="checkbox">
            <span>显示扩展菜单入口</span>
          </label>
          <label class="checkbox_label" for="selene_keep_alive">
            <input id="selene_keep_alive" type="checkbox">
            <span>后台音频保活</span>
          </label>
        </div>
        <div class="selene-setting-actions">
          <button type="button" class="menu_button" data-selene-reset-position>重置播放器位置</button>
          <button type="button" class="menu_button" data-selene-reset-window>重置窗口尺寸</button>
        </div>
        <small data-selene-status>正在检查播放器…</small>
        <small class="selene-keepalive-note">保活可减少移动端切到后台后停播；首次启用可能需要再点击一次页面授权。</small>
      </div>
    </div>`);

  bindSwitch('#selene_player_visible', (controls, value) => controls.setVisible(value));
  bindSwitch('#selene_auto_show', (controls, value) => controls.setAutoShow(value));
  bindSwitch('#selene_menu_enabled', (controls, value) => controls.setMenuEnabled(value));
  bindSwitch('#selene_keep_alive', (controls, value) => controls.setKeepAlive(value));

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
});

export function onDisable() {
  panelObserver?.disconnect();
  ROOT.removeEventListener('selene-music-player-state', syncPanel);
  ROOT.__SAFE_MUSIC_CLEANUP__?.();
  DOC.getElementById(PANEL_ID)?.remove();
}

export function onDelete() {
  onDisable();
}
