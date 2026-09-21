import crypto from 'node:crypto';
import { getSupabaseAdmin } from './_supabaseAdmin.js';

function normalize(value = '') {
  return String(value).trim();
}

function getIpHash(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = Array.isArray(forwarded) ? forwarded[0] : String(forwarded || req.socket?.remoteAddress || '');
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.CRON_SECRET || 'vant-business';

  if (!rawIp) return null;
  return crypto.createHash('sha256').update(`${rawIp.split(',')[0].trim()}:${secret}`).digest('hex');
}

export async function recordEvent(req, payload) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { stored: false, reason: 'supabase_not_configured' };

  const event = {
    event_type: normalize(payload.eventType || payload.event_type || 'click'),
    item_type: normalize(payload.itemType || payload.item_type || 'unknown'),
    item_id: normalize(payload.itemId || payload.item_id || 'unknown'),
    item_title: normalize(payload.itemTitle || payload.item_title || ''),
    target_url: normalize(payload.targetUrl || payload.target_url || ''),
    source: normalize(payload.source || ''),
    path: normalize(payload.path || req.headers.referer || ''),
    user_agent: normalize(req.headers['user-agent'] || ''),
    ip_hash: getIpHash(req),
    metadata: payload.metadata || {},
  };

  const { error } = await supabase.from('analytics_events').insert(event);
  if (error) throw error;

  return { stored: true };
}
