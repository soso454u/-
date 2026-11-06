// Run in an isolated player page. Exercises native input colors, image sampling
// and resistance to a host theme that assigns black text to form controls.
async function runSeleneCompanionThemeRegression() {
  const checks = [];
  const assert = (ok, message) => { if (!ok) throw Error(message); checks.push(message); };
  window.__SELENE_MUSIC_PLAYER__.setCompanionVisible(true);
  const dialog = document.getElementById('safe-music-player-companion');
  const panel = dialog.querySelector('.companion-settings');
  if (panel.hidden) dialog.querySelector('.companion-settings-button').click();
  const hostTheme = document.createElement('style');
  hostTheme.textContent = 'input,select,textarea,small{color:#111!important;-webkit-text-fill-color:#111!important}';
  document.head.append(hostTheme);
  const mode = dialog.querySelector('[data-wallpaper-mode]');
  const previous = mode.value;
  const setMode = value => { mode.value = value; mode.dispatchEvent(new Event('change', { bubbles: true })); };
  for (const value of ['white', 'night']) {
    setMode(value);
    const light = value === 'white';
    assert(dialog.dataset.tone === (light ? 'light' : 'dark'), `${value} sets the correct tone`);
    for (const field of panel.querySelectorAll('input:not([type=checkbox]):not([type=file]),select,textarea')) {
      const rgb = getComputedStyle(field).color.match(/[\d.]+/g).map(Number);
      assert(light ? rgb[0] < 80 : rgb[0] > 220, `${field.name || field.tagName} stays readable in ${value}`);
      assert(getComputedStyle(field).webkitTextFillColor === getComputedStyle(field).color, `${field.name || field.tagName} uses a consistent text fill in ${value}`);
    }
    assert(getComputedStyle(dialog).colorScheme === (light ? 'light' : 'dark'), `${value} updates native form control scheme`);
  }
  const originalUrl = dialog.querySelector('[data-wallpaper-url]').value;
  for (const [color, expected] of [['#ffffff', 'light'], ['#101014', 'dark']]) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 16;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = color; ctx.fillRect(0, 0, 16, 16);
    setMode('image');
    dialog.querySelector('[data-wallpaper-url]').value = canvas.toDataURL('image/png');
    dialog.querySelector('[data-wallpaper-apply]').click();
    await new Promise(resolve => setTimeout(resolve, 120));
    assert(dialog.dataset.tone === expected, `${expected} uploaded image is detected automatically`);
  }
  dialog.querySelector('[data-wallpaper-url]').value = originalUrl;
  if (originalUrl) dialog.querySelector('[data-wallpaper-apply]').click();
  setMode(previous); hostTheme.remove();
  return { passed: checks.length };
}
