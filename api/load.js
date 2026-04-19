import { Redis } from '@upstash/redis';
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const k = req.query.key || 'deck:content';
    const content = await redis.get(k);
    const updated = await redis.get(k + ':updated');
    return res.status(200).json({ ok: true, content: content || null, updated: updated || null });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
