import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
const start = source.indexOf('function bindCompanionDragging');
const end = source.indexOf('function syncCompanionAppearance', start);

assert.notEqual(start, -1, 'companion dragging helper should exist');
assert.notEqual(end, -1, 'companion dragging helper boundary should exist');

function createHarness(companionMini = false) {
  const settings = { companionMini };
  const moves = [];
  const persisted = [];
  const timers = [];
  const pointerHandle = () => ({
    captured: null,
    released: null,
    setPointerCapture(id) { this.captured = id; },
    releasePointerCapture(id) { this.released = id; },
  });
  const head = pointerHandle();
  const avatar = pointerHandle();
  const dialog = {
    dataset: {},
    querySelector(selector) { return selector === '.companion-head' ? head : avatar; },
    getBoundingClientRect() { return { left: 100, top: 200 }; },
  };
  const api = new Function(
    'settings',
    'placeCompanion',
    'persistCompanionPosition',
    'ROOT',
    `let companionDragged=false;${source.slice(start, end)};return {bindCompanionDragging,get dragged(){return companionDragged;}};`,
  )(
    settings,
    (_dialog, left, top) => moves.push({ left, top }),
    (_dialog, mini) => persisted.push(mini),
    { setTimeout(callback) { timers.push(callback); } },
  );
  api.bindCompanionDragging(dialog);
  return { api, avatar, dialog, head, moves, persisted, settings, timers };
}

const pointerEvent = ({ id = 7, x = 0, y = 0, target = 'plain' } = {}) => ({
  pointerId: id,
  pointerType: 'touch',
  clientX: x,
  clientY: y,
  preventDefault() {},
  stopPropagation() {},
  target: {
    closest(selector) {
      if (target === 'avatar' && selector === 'button:not(.companion-avatar-button)') return null;
      if (target === 'control' && selector === 'button:not(.companion-avatar-button)') return {};
      return null;
    },
  },
});

test('the full companion window drags from its header and persists its position', () => {
  const harness = createHarness(false);
  harness.head.onpointerdown(pointerEvent({ x: 20, y: 30 }));
  harness.head.onpointermove(pointerEvent({ x: 22, y: 32 }));
  assert.equal(harness.moves.length, 0, 'tiny movement should remain a click');

  harness.head.onpointermove(pointerEvent({ x: 50, y: 70 }));
  assert.deepEqual(harness.moves.at(-1), { left: 130, top: 240 });
  assert.equal(harness.api.dragged, true);
  harness.head.onpointerup(pointerEvent({ x: 50, y: 70 }));
  assert.deepEqual(harness.persisted, [false]);
  harness.timers.splice(0).forEach(callback => callback());
  assert.equal(harness.api.dragged, false);
});

test('dragging the normal-mode avatar moves the window instead of forcing mini mode', () => {
  const harness = createHarness(false);
  harness.head.onpointerdown(pointerEvent({ x: 10, y: 10, target: 'avatar' }));
  harness.head.onpointermove(pointerEvent({ x: 35, y: 45, target: 'avatar' }));
  harness.head.onpointerup(pointerEvent({ x: 35, y: 45, target: 'avatar' }));

  assert.deepEqual(harness.moves.at(-1), { left: 125, top: 235 });
  assert.deepEqual(harness.persisted, [false]);
});

test('header controls do not accidentally start dragging the companion window', () => {
  const harness = createHarness(false);
  harness.head.onpointerdown(pointerEvent({ x: 10, y: 10, target: 'control' }));
  harness.head.onpointermove(pointerEvent({ x: 80, y: 90, target: 'control' }));

  assert.equal(harness.moves.length, 0);
  assert.equal(harness.persisted.length, 0);
});

test('the mini companion avatar remains independently draggable', () => {
  const harness = createHarness(true);
  harness.avatar.onpointerdown(pointerEvent({ x: 8, y: 9, target: 'avatar' }));
  harness.avatar.onpointermove(pointerEvent({ x: 28, y: 39, target: 'avatar' }));
  harness.avatar.onpointerup(pointerEvent({ x: 28, y: 39, target: 'avatar' }));

  assert.deepEqual(harness.moves.at(-1), { left: 120, top: 230 });
  assert.deepEqual(harness.persisted, [true]);
});
