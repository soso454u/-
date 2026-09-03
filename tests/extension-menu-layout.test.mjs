import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const player = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
const start = player.indexOf('function ensureMenuStyle');
const end = player.indexOf('function hardenResizeInteractions', start);

assert.notEqual(start, -1, 'extension menu style helper should exist');
assert.notEqual(end, -1, 'extension menu helper boundary should exist');

const menuSource = player.slice(start, end);

test('uses the SillyTavern extension container as a wrapper', () => {
  assert.match(menuSource, /x\.className='extension_container'/);
  assert.match(menuSource, /x\.firstElementChild/);
  assert.doesNotMatch(menuSource, /x\.className='list-group-item[^']*extension_container'/);
});

test('keeps the icon and label inside one keyboard-accessible menu row', () => {
  assert.match(menuSource, /class="selene-menu-item[^>]+role="button" tabindex="0"/);
  assert.match(menuSource, /extensionsMenuExtensionButton" aria-hidden="true"><\/div><span class="selene-menu-label">音乐播放器<\/span>/);
});

test('protects the menu row from theme-driven wrapping', () => {
  assert.match(menuSource, /flex-flow:row nowrap!important/);
  assert.match(menuSource, /white-space:nowrap!important/);
  assert.match(menuSource, /writing-mode:horizontal-tb!important/);
});
