import { getSupabaseAdmin } from './_supabaseAdmin.js';

function toDbDraft(draft, status) {
  return {
    id: draft.id,
    draft_type: draft.kind,
    source_id: draft.sourceId,
    source_name: draft.sourceName || '',
    title: draft.title || '',
    audience: draft.audience || null,
    summary: draft.summary || null,
    focus: draft.focus || null,
    outline: draft.outline || [],
    status: status || draft.status || 'rascunho',
    payload: draft,
    updated_at: new Date().toISOString(),
  };
}

function fromDbDraft(row) {
  return {
    ...(row.payload || {}),
    id: row.id,
    kind: row.draft_type,
    sourceId: row.source_id,
    sourceName: row.source_name,
    title: row.title,
    audience: row.audience,
    summary: row.summary,
    focus: row.focus,
    outline: row.outline || [],
    status: row.status,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function readContentDrafts() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { items: [], warnings: ['Supabase nao configurado para os rascunhos de conteudo.'] };
  }

  const { data, error } = await supabase
    .from('ai_content_drafts')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    return { items: [], warnings: [error.message] };
  }

  return {
    items: (data || []).map(fromDbDraft),
    warnings: [],
  };
}

export async function upsertContentDraftStatus(draft, status) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { stored: false, item: { ...draft, status } };
  }

  const now = new Date().toISOString();
  const dbDraft = {
    ...toDbDraft(draft, status),
    reviewed_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from('ai_content_drafts')
    .upsert(dbDraft, { onConflict: 'id' })
    .select('*')
    .single();

  if (error) throw error;

  return {
    stored: true,
    item: fromDbDraft(data),
  };
}
