import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const source = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
const start = source.indexOf('  function colorLuminance(');
const end = source.indexOf('  function companionImageTone(', start);
const luminance = new Function(`${source.slice(start, end)};return colorLuminance;`)();
test('tone detection recognizes CSS hex and rgb colors consistently', () => {
  assert.equal(luminance('#000'), 0);
  assert.equal(luminance('#fff'), 1);
  assert.equal(luminance('#ffffffff'), 1);
  assert.equal(luminance('rgb(255, 255, 255)'), 1);
  assert.equal(luminance('rgba(0, 0, 0, .5)'), 0);
  assert.ok(luminance('#f5f5f7') > .9);
  assert.ok(luminance('#202127') < .03);
});
test('unrecognized host colors allow the system-theme fallback', () => {
  assert.equal(luminance(''), null);
  assert.equal(luminance('var(--unknown)'), null);
  assert.equal(luminance('transparent'), null);
});
