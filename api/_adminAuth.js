import crypto from 'node:crypto';

const COOKIE_NAME = 'vant_admin';
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
// Sem credenciais padrao: o acesso administrativo exige configuracao no
// ambiente. Faltando qualquer uma, o login e as sessoes falham fechados.
function getConfiguredEmail() {
  return process.env.ADMIN_EMAIL || '';
}

function getConfiguredPassword() {
  return process.env.ADMIN_PASSWORD || process.env.ADMIN_ACCESS_CODE || '';
}

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || process.env.ADMIN_ACCESS_CODE || '';
}

function sign(value) {
  const secret = getSecret();
  if (!secret) return '';
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header
      .split(';')
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const index = cookie.indexOf('=');
        if (index === -1) return [cookie, ''];
        return [cookie.slice(0, index), decodeURIComponent(cookie.slice(index + 1))];
      })
  );
}

export function createAdminToken() {
  const email = getConfiguredEmail();
  const password = getConfiguredPassword();
  if (!email || !password) return '';
  return sign(`admin:${email}:${password}`);
}

function safeEqual(left = '', right = '') {
  const leftHash = crypto.createHash('sha256').update(left).digest();
  const rightHash = crypto.createHash('sha256').update(right).digest();
  return crypto.timingSafeEqual(leftHash, rightHash);
}

function credentialsMatch(email, password, expectedEmail, expectedPassword) {
  return (
    String(email || '').trim().toLowerCase() === String(expectedEmail || '').trim().toLowerCase() &&
    safeEqual(String(password || ''), String(expectedPassword || ''))
  );
}

export function verifyAdminCredentials(email, password) {
  const configuredEmail = getConfiguredEmail();
  const configuredPassword = getConfiguredPassword();

  // Sem configuracao nao existe credencial valida.
  if (!configuredEmail || !configuredPassword) return false;

  return credentialsMatch(email, password, configuredEmail, configuredPassword);
}

export function isAdminRequest(req) {
  const expected = createAdminToken();
  if (!expected) return false;

  const cookies = parseCookies(req.headers.cookie || '');
  return cookies[COOKIE_NAME] === expected;
}

export function setAdminCookie(res) {
  const token = createAdminToken();
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${MAX_AGE_SECONDS}${secure}`
  );
}

export function clearAdminCookie(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`);
}
