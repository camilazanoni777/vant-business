import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getSupabaseAdmin } from './_supabaseAdmin.js';

export const approvedStatuses = ['aprovada', 'approved', 'publicada'];

function slugify(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export function normalizeNewsItem(item = {}, status) {
  const title = item.title || item.titlePt || item.title_pt || 'Noticia sem titulo';
  const titlePt = item.titlePt || item.title_pt || item.title || title;
  const nextStatus = status || item.status || 'rascunho';
  const publishedAt =
    item.publishedAt ||
    item.published_at ||
    (approvedStatuses.includes(nextStatus) ? new Date().toISOString() : null);

  return {
    ...item,
    id: item.id || slugify(titlePt || title),
    title,
    titlePt,
    link: item.link || '',
    source: item.source || '',
    category: item.category || 'IA',
    publishedAt,
    summary: item.summary || item.summaryPt || item.summary_pt || '',
    summaryPt: item.summaryPt || item.summary_pt || item.summary || '',
    status: nextStatus,
    score: Number(item.score || 0),
    rank: item.rank || null,
  };
}

function toDbItem(item, status) {
  const normalized = normalizeNewsItem(item, status);
  return {
    id: normalized.id,
    title: normalized.title,
    title_pt: normalized.titlePt || null,
    link: normalized.link,
    source: normalized.source || null,
    category: normalized.category || null,
    published_at: normalized.publishedAt || null,
    summary: normalized.summary || null,
    summary_pt: normalized.summaryPt || null,
    status: normalized.status,
    score: normalized.score || 0,
    rank: normalized.rank || null,
    payload: normalized,
    updated_at: new Date().toISOString(),
  };
}

function fromDbItem(row) {
  return {
    ...(row.payload || {}),
    id: row.id,
    title: row.title,
    titlePt: row.title_pt || row.payload?.titlePt,
    link: row.link,
    source: row.source,
    category: row.category,
    publishedAt: row.published_at || row.payload?.publishedAt,
    summary: row.summary,
    summaryPt: row.summary_pt || row.payload?.summaryPt,
    status: row.status,
    score: row.score,
    rank: row.rank,
    reviewedAt: row.reviewed_at,
    updatedAt: row.updated_at,
  };
}

export async function readStaticNews(req) {
  try {
    const file = await readFile(path.resolve(process.cwd(), 'public/data/ai-news.json'), 'utf8');
    return JSON.parse(file);
  } catch {
    if (!req?.headers?.host) return { items: [] };
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const response = await fetch(`${protocol}://${req.headers.host}/data/ai-news.json`);
    if (!response.ok) return { items: [] };
    return response.json();
  }
}

export function resolvePublicNewsGeneratedAt(staticGeneratedAt, items = []) {
  const candidates = [
    staticGeneratedAt,
    ...items.flatMap((item) => [item.updatedAt, item.reviewedAt, item.publishedAt, item.createdAt]),
  ].filter(Boolean);

  let freshestValue = null;
  let freshestTime = -Infinity;

  candidates.forEach((value) => {
    const time = new Date(value).getTime();
    if (Number.isNaN(time) || time <= freshestTime) return;
    freshestTime = time;
    freshestValue = value;
  });

  return freshestValue;
}

export async function getNewsItems(req) {
  const staticNews = await readStaticNews(req);
  const itemsById = new Map((staticNews.items || []).map((item) => [item.id, item]));
  const supabase = getSupabaseAdmin();
  const warnings = [];

  if (supabase) {
    const { data, error } = await supabase
      .from('ai_news_items')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      warnings.push(error.message);
    } else {
      (data || []).forEach((row) => {
        const current = itemsById.get(row.id) || {};
        itemsById.set(row.id, { ...current, ...fromDbItem(row) });
      });
    }
  }

  const items = [...itemsById.values()].sort((a, b) => {
    const aTime = new Date(a.publishedAt || 0).getTime();
    const bTime = new Date(b.publishedAt || 0).getTime();
    if (bTime !== aTime) return bTime - aTime;
    return (a.rank || 999) - (b.rank || 999);
  });

  return {
    generatedAt: resolvePublicNewsGeneratedAt(staticNews.generatedAt || null, items),
    reviewStatus: staticNews.reviewStatus || 'aguardando_avaliacao',
    warnings,
    items,
  };
}

export async function upsertNewsStatus(item, status) {
  return upsertNewsItem(item, status);
}

export async function upsertNewsItem(item, status) {
  const normalized = normalizeNewsItem(item, status);
  const supabase = getSupabaseAdmin();
  if (!supabase) return { stored: false, item: normalized };

  const now = new Date().toISOString();
  const dbItem = {
    ...toDbItem(normalized, normalized.status),
    reviewed_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from('ai_news_items')
    .upsert(dbItem, { onConflict: 'id' })
    .select('*')
    .single();

  if (error) throw error;
  return { stored: true, item: fromDbItem(data) };
}
