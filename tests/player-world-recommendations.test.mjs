import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../纯音乐播放器.js', import.meta.url), 'utf8');
const extract = (start, end) => {
  const first = source.indexOf(`  ${start}`);
  const last = source.indexOf(`  ${end}`, first);
  assert.ok(first >= 0 && last > first);
  return source.slice(first, last);
};
const setup = new Function('context', 'DOC', 'normalizeSongText', 'setStatus', 'toast', 'renderWorldPlaylist', `
  ${extract('function parseWorldPlaylist', 'function renderWorldPlaylist')}
  ${extract('function companionBookNamesFrom', 'async function companionAttachedBookNames')}
  ${extract('async function readWorldRecommendations', 'function bindWorldRecommendations')}
  return readWorldRecommendations;
`);

function fixture(ctx) {
  const notices = [], renders = [];
  const run = setup(() => ctx, { querySelectorAll: () => [] },
    value => value.toLowerCase(), () => {}, (...args) => notices.push(args), (...args) => renders.push(args));
  return { run, notices, renders };
}

const book = title => ({ entries: { 0: { disable: true, content: `<selene_playlist>\n${title} | 歌手\n</selene_playlist>` } } });

test('SillyTavern 1.17 loads primary and additional character books without a book enumeration API', async () => {
  const loaded = [];
  const { run, notices, renders } = fixture({
    characterId: 0,
    characters: [{ avatar: '角色.png', data: { extensions: { world: '主世界书' } } }],
    executeSlashCommandsWithOptions: async command => {
      assert.equal(command, '/getcharbook type=all create=false "角色.png"');
      return { pipe: JSON.stringify(['主世界书', '附加世界书']) };
    },
    loadWorldInfo: async name => { loaded.push(name); return book(name); },
  });
  await run();
  assert.deepEqual(notices, []);
  assert.deepEqual(loaded, ['主世界书', '附加世界书']);
  assert.deepEqual(renders[0]?.[0].map(song => song.title), loaded);
  assert.deepEqual(renders[0]?.[1], loaded);
});

test('group recommendations read only group member bindings, even without slash commands', async () => {
  const loaded = [];
  const { run, renders } = fixture({
    groupId: '1',
    groups: [{ id: 1, members: ['member.png'] }],
    characters: [
      { avatar: 'other.png', data: { extensions: { world: '无关世界书' } } },
      { avatar: 'member.png', data: { extensions: { world: '群成员世界书' } } },
    ],
    loadWorldInfo: async name => { loaded.push(name); return book('群聊推荐'); },
  });
  await run();
  assert.deepEqual(loaded, ['群成员世界书']);
  assert.equal(renders[0]?.[0][0].title, '群聊推荐');
});

test('unbound characters do not load any books', async () => {
  const { run, notices, renders } = fixture({
    characterId: 0,
    characters: [{ avatar: '角色.png' }],
    executeSlashCommandsWithOptions: async () => ({ pipe: '[]' }),
    loadWorldInfo: () => assert.fail('No book should be loaded'),
  });
  await run();
  assert.deepEqual(notices, [['warning', '当前角色卡没有绑定世界书']]);
  assert.deepEqual(renders, []);
});

test('a null lorebook response is reported as a read failure', async () => {
  const { run, notices, renders } = fixture({
    characterId: 0,
    characters: [{ data: { extensions: { world: '主世界书' } } }],
    loadWorldInfo: async () => null,
  });
  await run();
  assert.deepEqual(notices, [['error', '当前角色卡世界书读取失败，请稍后重试']]);
  assert.deepEqual(renders, []);
});
