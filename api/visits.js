const counterKey = process.env.VISITS_COUNTER_KEY || 'al-aqidah-at-tahawiyyah-visits';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'method_not_allowed' });
  }

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return response.status(503).json({ error: 'counter_not_configured' });

  try {
    const upstream = await fetch(`${url.replace(/\/$/, '')}/incr/${encodeURIComponent(counterKey)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!upstream.ok) throw new Error(`Storage failed: ${upstream.status}`);
    const payload = await upstream.json();
    const count = Number(payload.result);
    if (!Number.isFinite(count)) throw new Error('Invalid storage response');
    response.setHeader('Cache-Control', 'no-store');
    return response.status(200).json({ count });
  } catch (_) {
    return response.status(503).json({ error: 'counter_unavailable' });
  }
}
