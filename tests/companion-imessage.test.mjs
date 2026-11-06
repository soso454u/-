import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
const esc = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const messageStart = source.indexOf('  function companionMessageItems(');
const messageEnd = source.indexOf('  function renderCompanionDialog()', messageStart);
const { render } = new Function('esc', 'cleanCompanionText', 'companionAssistantParts', `${source.slice(messageStart, messageEnd)};return {render:companionConversationMarkup};`)(esc, text => text, () => []);
const urlStart = source.indexOf('  function companionWallpaperUrl(');
const urlEnd = source.indexOf('  function syncCompanionWallpaper(', urlStart);
const wallpaperUrl = new Function(`${source.slice(urlStart, urlEnd)};return companionWallpaperUrl;`)();

test('consecutive replies form separate bubbles with a tail only on the last', () => {
  const html = render([{ role: 'assistant', content: '这首歌很好听\n再陪我听一会儿', time: 1000000 }], {});
  assert.equal((html.match(/companion-bubble-text/g) || []).length, 2);
  assert.equal((html.match(/has-tail/g) || []).length, 1);
  assert.equal((html.match(/continuation/g) || []).length, 1);
});

test('a sender change or five-minute gap starts a new bubble sequence', () => {
  const html = render([
    { role: 'assistant', content: '第一条', time: 1000000 },
    { role: 'user', content: '换人', time: 1001000 },
    { role: 'user', content: '稍后再发', time: 1301000 },
  ], {});
  assert.equal((html.match(/has-tail/g) || []).length, 3);
  assert.equal((html.match(/companion-message-date/g) || []).length, 2);
  assert.ok(!html.includes('continuation'));
});

test('message HTML is escaped before rendering, including multiline messages', () => {
  const html = render([{ role: 'user', content: '<img src=x onerror=alert(1)>\n<script>bad()</script>' }], {});
  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('<script'));
  assert.ok(html.includes('&lt;img'));
  assert.ok(html.includes('&lt;script&gt;'));
});

test('background URLs allow image links and locally compressed raster data only', () => {
  assert.equal(wallpaperUrl('https://example.com/bg.jpg?a=1&b=2'), 'https://example.com/bg.jpg?a=1&b=2');
  assert.equal(wallpaperUrl('data:image/jpeg;base64,YWJj'), 'data:image/jpeg;base64,YWJj');
  for (const value of ['javascript:alert(1)', 'file:///tmp/image.png', 'data:text/html;base64,YWJj', 'data:image/svg+xml;base64,YWJj', '../bg.png']) assert.equal(wallpaperUrl(value), '');
});
