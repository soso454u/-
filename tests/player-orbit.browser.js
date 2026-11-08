// Run after loading the player in an isolated browser page, at each target viewport.
async function runSeleneOrbitRegression() {
  const player = document.getElementById('safe-music-player');
  window.__SELENE_MUSIC_PLAYER__.resetPosition();
  const checks = [];
  const assert = (ok, message) => { if (!ok) throw Error(message); checks.push(message); };
  const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const skin = async value => {
    player.querySelector('.skin').click();
    await frame();
    const menu = document.getElementById('safe-music-player-skin-float');
    const box = menu.getBoundingClientRect();
    assert(box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight, 'appearance picker fits within the viewport');
    assert(menu.querySelector('[data-skin]').dataset.skin === 'albumglass', 'default album glass is the first appearance');
    document.querySelector(`#safe-music-player-skin-float [data-skin="${value}"]`).click();
    await frame();
  };
  const visible = element => getComputedStyle(element).display !== 'none';
  const hit = element => {
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && element.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
  };
  const toggle = player.querySelector('[data-orbit-library]');
  await skin('orbit');
  assert(JSON.parse(localStorage.getItem('safe-music-player-v1')).skin === 'orbit', 'record style persists');
  assert(visible(player.querySelector('.now')), 'record view shows current song');
  assert([...player.querySelectorAll('.actions [data-a]')].map(button => button.dataset.a).join(',') === 'rec,world-rec,offline', 'more functions contain recommendations and offline songs');
  const disc = player.querySelector('.selene-orbit-disc');
  const cover = disc.querySelector('img');
  const artwork = cover.hasAttribute('src') ? cover : disc.querySelector('.selene-orbit-placeholder');
  assert(artwork.getBoundingClientRect().width > disc.getBoundingClientRect().width * .5, 'cover and missing-cover placeholder fill the record center');
  assert(!visible(player.querySelector('.list')), 'record view reserves space for the cover');
  assert(hit(toggle), 'library switch receives pointer input');
  for (const button of player.querySelectorAll('.controls button')) assert(hit(button), `${button.dataset.c} control stays accessible`);
  toggle.click(); await frame();
  assert(toggle.getAttribute('aria-expanded') === 'true', 'library switch reports its expanded state');
  assert(visible(player.querySelector('.body>form')), 'record library allows searching');
  assert(visible(player.querySelector('.selene-library-nav')), 'record library exposes existing navigation');
  player.querySelector('[data-library=queue]').click(); await frame();
  assert(visible(player.querySelector('.list')), 'queue remains reachable from record style');
  player.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await frame();
  assert(toggle.getAttribute('aria-expanded') === 'false' && visible(player.querySelector('.now')), 'Escape returns to record view');
  player.querySelector('.gear').click(); await frame();
  assert(hit(player.querySelector('.settings-panel [data-x]')), 'settings remain usable above record view');
  player.querySelector('.settings-panel [data-x]').click();
  for (const value of ['white', 'black', 'albumglass', 'film']) {
    await skin(value);
    assert(!player.classList.contains('skin-orbit'), `switching to ${value} removes record style`);
    assert(!visible(player.querySelector('.selene-orbit-tools')), `record tools hide in ${value}`);
    assert(getComputedStyle(player.querySelector('.selene-orbit-disc')).display === 'contents', `${value} retains the original cover layout`);
    assert(visible(player.querySelector('.body>form')), `${value} retains its search form`);
  }
  await skin('orbit');
  const oldHeight = player.style.getPropertyValue('height');
  const oldPriority = player.style.getPropertyPriority('height');
  player.style.setProperty('height', '300px', 'important'); await frame();
  for (const button of player.querySelectorAll('.controls button')) assert(hit(button), `short window keeps ${button.dataset.c} usable`);
  assert(hit(toggle), 'short window retains library access');
  player.style.setProperty('height', oldHeight, oldPriority);
  return { passed: checks.length, viewport: `${innerWidth}x${innerHeight}` };
}

// Select a playable song before running this check; it exercises native media events.
async function runSeleneOrbitPlaybackRegression() {
  const player = document.getElementById('safe-music-player');
  const audio = document.getElementById('selene-main-music-media');
  if (!audio.currentSrc) throw Error('Select a playable test song first');
  const assert = (ok, message) => { if (!ok) throw Error(message); };
  const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const motion = () => getComputedStyle(player.querySelector('.now img')).animationPlayState;
  await audio.play(); await frame();
  assert(player.classList.contains('orbit-playing') && motion() === 'running', 'native playback starts the cover animation');
  const cover = player.querySelector('.now img'), disc = player.querySelector('.selene-orbit-disc');
  assert(getComputedStyle(cover).borderRadius === '50%' && getComputedStyle(cover).clipPath === 'circle(50%)', 'record cover is cropped to a true circle');
  const layers = () => [getComputedStyle(disc, '::before').transform, getComputedStyle(disc, '::after').transform, getComputedStyle(player.querySelector('.selene-orbit-energy')).transform];
  const first = layers(); await new Promise(resolve => setTimeout(resolve, 400));
  assert(layers().every((value, index) => value !== first[index]), 'breathing grooves and both flowing light layers animate');
  player.querySelector('[data-c=play]').click();
  await new Promise(resolve => setTimeout(resolve, 1400));
  assert(audio.paused && !player.classList.contains('orbit-playing') && motion() === 'paused', 'user pause keeps the cover frozen');
  await audio.play();
  audio.dispatchEvent(new Event('waiting')); await frame();
  assert(!player.classList.contains('orbit-playing') && motion() === 'paused', 'buffering freezes the cover');
  audio.dispatchEvent(new Event('playing')); await frame();
  assert(player.classList.contains('orbit-playing') && motion() === 'running', 'playback recovery resumes the cover');
  player.querySelector('.now img').click(); await frame();
  assert(player.classList.contains('immersive'), 'cover opens immersive mode');
  assert(getComputedStyle(player.querySelector('.immersive-cover')).animationPlayState === 'running', 'immersive cover rotates during playback');
  player.querySelector('.immersive-close').click(); await frame();
  assert(!player.classList.contains('immersive'), 'immersive view returns to the record');
  player.querySelector('[data-c=play]').click();
  return { passed: 9 };
}
