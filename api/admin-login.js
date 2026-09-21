import { setAdminCookie, verifyAdminCredentials } from './_adminAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = String(req.body?.email || '').trim();
  const password = String(req.body?.password || '');

  if (!verifyAdminCredentials(email, password)) {
    return res.status(401).json({ error: 'Credenciais invalidas' });
  }

  setAdminCookie(res);
  return res.status(200).json({ ok: true });
}
