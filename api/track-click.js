import { recordEvent } from './_trackEvent.js';

function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await recordEvent(req, parseBody(req.body));
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    console.error('Track click error:', error);
    return res.status(200).json({ ok: true, stored: false });
  }
}
