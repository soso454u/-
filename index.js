// SillyTavern extension entry point.
// The player remains in its original standalone file so it can still be used
// independently by script loaders that support plain JavaScript files.
import './纯音乐播放器.js';

export function onDisable() {
  window.__SAFE_MUSIC_CLEANUP__?.();
}

export function onDelete() {
  window.__SAFE_MUSIC_CLEANUP__?.();
}
