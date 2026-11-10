const upstreamOrigin = 'https://api.bilibili.com';
const routePath = '/api/bilibili';
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Expose-Headers': 'Retry-After',
};

function upstreamUrl(query) {
  const route = query.get('route');
  const keyword = query.get('keyword')?.trim();
  const page = query.get('page') ?? '1';
  if (!/^[1-9]\d{0,2}$/.test(page)) return null;

  let path, params;
  switch (route) {
    case 'videos':
    case 'users':
      if (!keyword || keyword.length > 100) return null;
      path = '/x/web-interface/search/type';
      params = { search_type: route === 'videos' ? 'video' : 'bili_user', keyword, page };
      if (route === 'videos') params.order = query.get('order') === 'pubdate' ? 'pubdate' : 'totalrank';
      break;
    case 'submissions': {
      const mid = query.get('mid') ?? '';
      if (!/^[1-9]\d{0,18}$/.test(mid)) return null;
      path = '/x/space/arc/search';
      params = { mid, pn: page, ps: '20', order: 'pubdate' };
      break;
    }
    case 'video': {
      const bvid = query.get('bvid') ?? '';
      if (!/^BV1[1-9A-HJ-NP-Za-km-z]{9}$/.test(bvid)) return null;
      path = '/x/web-interface/view';
      params = { bvid };
      break;
    }
    default:
      return null;
  }
  const url = new URL(path, upstreamOrigin);
  url.search = new URLSearchParams(params);
  return url;
}

function json(value, status, headers = {}) {
  return Response.json(value, {
    status,
    headers: { ...cors, 'Cache-Control': 'no-store', ...headers },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== routePath) return json({ error: 'route-not-found' }, 404);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'GET') return json({ error: 'method-not-allowed' }, 405, { Allow: 'GET, OPTIONS' });
    const upstream = upstreamUrl(url.searchParams);
    if (!upstream) return json({ error: 'invalid-query' }, 400);

    const signal = AbortSignal.timeout(6000);
    try {
      const response = await fetch(upstream, { redirect: 'manual', signal });
      if (!response.ok) {
        const status = response.status;
        const retryAfter = response.headers.get('Retry-After');
        return json({ error: 'upstream-http', upstreamStatus: status }, status >= 400 ? status : 502,
          retryAfter ? { 'Retry-After': retryAfter } : {});
      }

      const body = await response.text();
      let payload;
      try { payload = JSON.parse(body); } catch {}
      if (!Number.isInteger(payload?.code)) {
        const error = /window\._riskdata_|<title>\s*(?:验证码|安全验证)/i.test(body) ? 'upstream-verification' : 'upstream-format';
        return json({ error, upstreamStatus: response.status }, 502);
      }

      if (payload.code !== 0) return json({ code: payload.code, message: payload.message }, 200);
      if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
        return json({ error: 'upstream-format', upstreamStatus: response.status }, 502);
      }
      return json({ code: 0, data: payload.data }, 200, { 'Cache-Control': 'public, max-age=60' });
    } catch {
      return signal.aborted ? json({ error: 'upstream-timeout' }, 504) : json({ error: 'upstream-network' }, 502);
    }
  },
};
