import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'No content provided' });

    // Save with timestamp
    await kv.set('deck:content', content);
    await kv.set('deck:updated', new Date().toISOString());

    return res.status(200).json({
      ok: true,
      updated: new Date().toISOString()
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
