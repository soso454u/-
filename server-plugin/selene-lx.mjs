// Huibq's public LX Music source: https://github.com/Huibq/keep-alive/blob/master/render_api.js
const upstream = 'https://lxmusicapi.onrender.com';
const songIds = new Map([['tx', /^[a-z0-9]{14}$/i], ['wy', /^\d{1,20}$/], ['kg', /^[a-f0-9]{32}$/i]]);
const qualities = new Set(['128k', '320k']);

export const info = { id: 'selene-lx', name: 'Selene LX Music', description: 'Playback URL lookup for Huibq’s LX Music source' };

async function resolveUrl(source, songId, quality) {
    const signal = AbortSignal.timeout(9000);
    try {
        const response = await fetch(`${upstream}/url/${source}/${songId}/${quality}`, {
            headers: { 'X-Request-Key': 'share-v3' },
            redirect: 'error',
            signal,
        });
        const retryAfter = response.headers.get('Retry-After');
        const data = await response.json().catch(error => {
            if (signal.aborted) throw error;
            return null;
        });
        const code = data?.code;
        if (response.status === 429 || code === 5 || code === 429 || code === 1) {
            const now = Date.now(), seconds = Number(retryAfter), blocked = code === 1;
            const until = retryAfter && Number.isFinite(seconds) ? now + seconds * 1000 : Date.parse(retryAfter);
            const retryAt = Math.max(now + 1000, until || now + (blocked ? 300000 : 30000));
            return { status: 429, error: blocked ? 'blocked' : 'rate-limit', code, retryAt };
        }
        if (code === 2) return { status: 422, error: 'unavailable', code };
        if (!response.ok || code !== 0) return { status: 502, error: 'upstream', code: Number.isInteger(code) ? code : undefined };

        let url;
        try { url = new URL(data.url); } catch { return { status: 502, error: 'invalid-url' }; }
        if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return { status: 502, error: 'invalid-url' };
        url.protocol = 'https:';

        const expiry = data.extra?.expire ?? data.expire;
        const timestamp = Number(expiry?.time ?? expiry);
        let expiresAt = 0;
        if (expiry?.canExpire !== false && Number.isFinite(timestamp) && timestamp > 0) {
            expiresAt = timestamp < 1e12 ? timestamp * 1000 : timestamp;
        }
        if (expiresAt && expiresAt <= Date.now()) return { status: 422, error: 'expired' };
        return { status: 200, code: 0, url: url.href, expiresAt };
    } catch {
        return signal.aborted ? { status: 504, error: 'timeout' } : { status: 502, error: 'upstream' };
    }
}

export async function init(router) {
    const pending = new Map();
    let cooldown = null;
    router.post('/url', async (req, res) => {
        res.set('Cache-Control', 'no-store');
        if (!req.user?.profile?.handle) return res.status(401).json({ error: 'unauthorized' });
        const { source, songId, quality } = req.body ?? {};
        if (typeof songId !== 'string' || !songIds.get(source)?.test(songId) || !qualities.has(quality)) {
            return res.status(400).json({ error: 'invalid-request' });
        }
        if (cooldown?.retryAt > Date.now()) return res.status(429).json(cooldown);

        const key = `${source}/${songId}/${quality}`;
        let request = pending.get(key);
        if (!request) {
            if (pending.size >= 4) return res.status(503).json({ error: 'busy' });
            request = resolveUrl(source, songId, quality).then(({ status, ...body }) => {
                if (body.retryAt && !(cooldown?.retryAt >= body.retryAt)) cooldown = body;
                return { status, body };
            }).finally(() => pending.delete(key));
            pending.set(key, request);
        }
        const { status, body } = await request;
        return res.status(status).json(body);
    });
}
