import { getSupabaseAdmin } from './_supabaseAdmin.js';
import { recursos } from '../src/data/recursos.js';

export const publishedToolStatuses = ['aprovada', 'approved', 'publicada'];

function slugify(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export function normalizeToolItem(tool = {}, status) {
  const name = tool.name || tool.title || 'Ferramenta sem nome';
  const categoria = tool.categoria || tool.category || 'IA';
  const nextStatus = status || tool.status || 'rascunho';

  return {
    ...tool,
    id: tool.id || slugify(name),
    name,
    emoji: tool.emoji || 'IA',
    logo: tool.logo || '',
    description: tool.description || '',
    link: tool.link || tool.url || '',
    utm: tool.utm || '?utm_source=vant&utm_content=recursos',
    categoria,
    badge: tool.badge || null,
    gratis: Boolean(tool.gratis || tool.freePlan || false),
    affiliateStatus: tool.affiliateStatus || 'nao_verificado',
    affiliateUrl: tool.affiliateUrl || '',
    status: nextStatus,
  };
}

function toDbTool(tool, status) {
  const normalized = normalizeToolItem(tool, status);
  return {
    id: normalized.id,
    name: normalized.name,
    description: normalized.description,
    link: normalized.link,
    utm: normalized.utm,
    categoria: normalized.categoria,
    badge: normalized.badge,
    gratis: normalized.gratis,
    logo: normalized.logo,
    emoji: normalized.emoji,
    affiliate_status: normalized.affiliateStatus,
    affiliate_url: normalized.affiliateUrl,
    status: normalized.status,
    payload: normalized,
    updated_at: new Date().toISOString(),
  };
}

function fromDbTool(row) {
  return normalizeToolItem({
    ...(row.payload || {}),
    id: row.id,
    name: row.name,
    description: row.description,
    link: row.link,
    utm: row.utm,
    categoria: row.categoria,
    badge: row.badge,
    gratis: row.gratis,
    logo: row.logo,
    emoji: row.emoji,
    affiliateStatus: row.affiliate_status,
    affiliateUrl: row.affiliate_url,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export function getPublishedTools(items = []) {
  return items.filter((tool) => publishedToolStatuses.includes(tool.status));
}

function getStaticPublishedTools() {
  return getPublishedTools(recursos.map((tool) => normalizeToolItem(tool, tool.status || 'publicada')));
}

export function buildPublicToolCatalog(staticItems = [], dbItems = []) {
  const publicById = new Map(
    getPublishedTools(staticItems).map((tool) => [tool.id, normalizeToolItem(tool, tool.status)])
  );
  const publishedDbItems = getPublishedTools(dbItems).map((tool) => normalizeToolItem(tool, tool.status));

  publishedDbItems.forEach((tool) => {
    publicById.set(tool.id, tool);
  });

  if (publicById.size > 0) {
    return {
      items: [...publicById.values()],
      usedFallback: false,
    };
  }

  return {
    items: getStaticPublishedTools(),
    usedFallback: true,
  };
}

export function getPublicToolItemsWithFallback(items = []) {
  const publishedItems = getPublishedTools(items);
  if (publishedItems.length > 0) {
    return { items: publishedItems, usedFallback: false };
  }

  return {
    items: getStaticPublishedTools(),
    usedFallback: true,
  };
}

export function buildToolCategories(items = []) {
  const categories = [...new Set(items.map((tool) => tool.categoria).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR')
  );
  return ['Todas', ...categories];
}

export async function getToolItems() {
  const itemsById = new Map(recursos.map((tool) => [tool.id, normalizeToolItem(tool, tool.status || 'publicada')]));
  const supabase = getSupabaseAdmin();
  const warnings = [];
  const dbItems = [];

  if (supabase) {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      warnings.push(error.message);
    } else {
      (data || []).forEach((row) => {
        const current = itemsById.get(row.id) || {};
        const next = fromDbTool(row);
        dbItems.push(next);
        itemsById.set(row.id, { ...current, ...next });
      });
    }
  }

  return {
    items: [...itemsById.values()],
    dbItems,
    warnings,
  };
}

export async function getPublicTools() {
  const tools = await getToolItems();
  const publicTools = buildPublicToolCatalog(getStaticPublishedTools(), tools.dbItems || []);
  const warnings = [...(tools.warnings || [])];

  if (publicTools.usedFallback) {
    warnings.push('Catalogo publico vazio no banco; usando catalogo estatico como fallback.');
  }

  return {
    ...tools,
    items: publicTools.items,
    categorias: buildToolCategories(publicTools.items),
    warnings,
  };
}

export async function upsertToolItem(tool, status) {
  const normalized = normalizeToolItem(tool, status);
  const supabase = getSupabaseAdmin();
  if (!supabase) return { stored: false, item: normalized };

  const { data, error } = await supabase
    .from('ai_tools')
    .upsert(toDbTool(normalized, normalized.status), { onConflict: 'id' })
    .select('*')
    .single();

  if (error) throw error;

  return {
    stored: true,
    item: fromDbTool(data),
  };
}

export async function findPublishedToolById(id) {
  const tools = await getPublicTools();
  return tools.items.find((tool) => tool.id === id) || null;
}
