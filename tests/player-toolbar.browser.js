// Run against 纯音乐播放器.js in an isolated browser context at phone/tablet/desktop widths.
// This exercises real CSS layout, hit testing and pointer handlers without music/API requests.
async function runSeleneToolbarRegression() {
  const player = document.getElementById('safe-music-player');
  if (!player) throw Error('Load the player in an isolated test page first');
  const checks = [];
  const assert = (value, message) => { if (!value) throw Error(message); checks.push(message); };
  const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const theme = document.createElement('style');
  theme.textContent = '.head{height:100px!important}.close{transform:scale(2.8)!important;border-radius:50%!important}header b,header button:not(.close){visibility:hidden!important}button{min-height:48px!important;padding:12px!important}';
  document.head.append(theme);
  const head = player.firstElementChild;
  const checkLayout = () => {
    const rect = head.getBoundingClientRect();
    assert(Math.abs(rect.height - 45) < 1, 'toolbar retains its height under a conflicting host theme');
    const buttons = [...head.querySelectorAll('button')];
    assert(buttons.length === 6, 'toolbar includes separate lyric settings and lock actions without a size button');
    for (const button of buttons) {
      const box = button.getBoundingClientRect(), style = getComputedStyle(button);
      assert(style.visibility === 'visible' && style.display !== 'none' && Number(style.opacity) > 0, `${button.textContent} remains visible`);
      assert(box.left >= rect.left && box.right <= rect.right && box.top >= rect.top && box.bottom <= rect.bottom, `${button.textContent} fits inside the toolbar`);
      assert(button.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)), `${button.textContent} receives pointer input`);
    }
  };
  for (const skin of ['film', 'white', 'red', 'black', 'blue', 'green', 'cream', 'albumglass', 'orbit']) {
    head.querySelector('.skin').click();
    document.querySelector(`#safe-music-player-skin-float [data-skin="${skin}"]`).click();
    for (const size of ['s', 'm', 'l']) {
      player.classList.remove('ui-size-s', 'ui-size-m', 'ui-size-l');
      player.classList.add(`ui-size-${size}`);
      player.style.setProperty('--button-scale', '2');
      await frame();
      checkLayout();
    }
  }
  head.querySelector('.gear').click();
  assert(getComputedStyle(player.querySelector('.settings-panel')).display !== 'none', 'settings control opens its panel');
  head.querySelector('.gear').click();
  const title = head.querySelector('b');
  // Synthetic pointer events do not register native pointer capture.
  title.setPointerCapture = () => {};
  const pointer = (target, type, x = 0, y = 0) => target.dispatchEvent(new PointerEvent(type, { pointerId: 19, pointerType: 'touch', clientX: x, clientY: y, bubbles: true, cancelable: true }));
  pointer(title, 'pointerdown'); pointer(title, 'pointerup');
  assert(player.classList.contains('mini') && getComputedStyle(head).display === 'none', 'title tap enters mini mode and hides the toolbar');
  const cover = player.querySelector('.mini-cover-shell');
  cover.setPointerCapture = () => {};
  pointer(cover, 'pointerdown'); pointer(cover, 'pointerup');
  await frame();
  assert(!player.classList.contains('mini'), 'mini cover tap restores the player');
  checkLayout();
  let transformWrites = 0;
  const originalWrite = player.style.setProperty.bind(player.style);
  player.style.setProperty = (name, ...args) => { if (name === 'transform') transformWrites++; return originalWrite(name, ...args); };
  pointer(title, 'pointerdown', 20, 20);
  await new Promise(resolve => setTimeout(resolve, 260));
  for (let step = 1; step <= 100; step++) pointer(title, 'pointermove', 20 + step / 10, 20 + step / 10);
  assert(transformWrites === 0, 'a burst of title drag events waits for the next animation frame');
  await frame();
  assert(transformWrites === 1, '100 title drag events produce one visual update');
  pointer(title, 'pointerup', 30, 30);
  assert(!player.classList.contains('pointer-interacting'), 'release restores normal rendering');
  delete player.style.setProperty;
  delete title.setPointerCapture; delete cover.setPointerCapture;
  head.querySelector('.selene-player-close').click();
  assert(!window.__SELENE_MUSIC_PLAYER__.getState().visible, 'close control hides the player');
  window.__SELENE_MUSIC_PLAYER__.setVisible(true, { persist: false });
  theme.remove();
  return { passed: checks.length, viewport: `${innerWidth}x${innerHeight}` };
}
