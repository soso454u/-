import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../workers/bilibili/index.mjs';

const route = 'https://worker.test/api/bilibili';

test('Bilibili routes forward only their documented anonymous query parameters', async t => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ path: url.pathname, params: Object.fromEntries(url.searchParams), options });
    return Response.json({ code: 0, data: { result: [] } });
  });
  const response = await worker.fetch(new Request(
    `${route}?route=videos&keyword=sample&page=2&order=pubdate&url=https://example.test`,
    { headers: { Cookie: 'private', Origin: 'https://tavern.test' } },
  ));
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
  assert.deepEqual(await response.json(), { code: 0, data: { result: [] } });
  assert.equal(calls[0].path, '/x/web-interface/search/type');
  assert.deepEqual(calls[0].params, { search_type: 'video', keyword: 'sample', page: '2', order: 'pubdate' });
  assert.equal(calls[0].options.headers, undefined);
  assert.equal(calls[0].options.redirect, 'manual');
  assert.equal((await worker.fetch(new Request(`${route}?route=video&bvid=opaque`))).status, 400);
  assert.equal(calls.length, 1);
});

test('Bilibili access denial, business limits, challenge pages and timeouts stay distinct', async t => {
  const replies = [
    new Response('', { status: 412 }),
    Response.json({ code: -799, message: '请求过于频繁' }),
    new Response('<title>验证码_哔哩哔哩</title>'),
    Response.json({ code: 0 }),
  ];
  t.mock.method(globalThis, 'fetch', async () => replies.shift());
  const query = new Request(`${route}?route=submissions&mid=946974`);
  const blocked = await worker.fetch(query);
  assert.equal(blocked.status, 412);
  assert.deepEqual(await blocked.json(), { error: 'upstream-http', upstreamStatus: 412 });
  assert.deepEqual(await (await worker.fetch(query)).json(), { code: -799, message: '请求过于频繁' });
  assert.equal((await (await worker.fetch(query)).json()).error, 'upstream-verification');
  assert.equal((await (await worker.fetch(query)).json()).error, 'upstream-format');

  t.mock.method(AbortSignal, 'timeout', () => AbortSignal.abort());
  t.mock.method(globalThis, 'fetch', async (_url, { signal }) => signal.throwIfAborted());
  const timedOut = await worker.fetch(query);
  assert.equal(timedOut.status, 504);
  assert.deepEqual(await timedOut.json(), { error: 'upstream-timeout' });
});
