import { getSupabaseAdmin } from './_supabaseAdmin.js';

export const newsletterIssueStatuses = ['rascunho', 'agendada', 'enviada', 'cancelada'];
export const newsletterIssueTypes = ['curadoria', 'ebook'];

function slugify(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function normalizeIssueItem(item = {}, index = 0) {
  const itemType = item.itemType || item.item_type || item.type || 'news';
  const itemId = item.itemId || item.item_id || item.id || slugify(item.titlePt || item.title || item.name || 'item');
  const title = item.titlePt || item.title || item.name || 'Item sem titulo';
  const summary = item.summaryPt || item.summary || item.description || '';

  return {
    itemType,
    itemId,
    position: Number(item.position || index + 1),
    title,
    link: item.link || item.url || '',
    source: item.source || item.category || item.categoria || '',
    summary,
    payload: item.payload || { status: item.status || null },
  };
}

export function buildNewsletterIssueFromItems(input = {}) {
  const subject = String(input.subject || '').trim() || 'Curadoria VANT Business';
  const type = newsletterIssueTypes.includes(input.type) ? input.type : 'curadoria';
  const status = newsletterIssueStatuses.includes(input.status) ? input.status : 'rascunho';
  const scheduledAt = normalizeDate(input.scheduledAt || input.scheduled_at);
  const items = (input.items || []).map(normalizeIssueItem).filter((item) => item.title && item.link);
  const id = input.id || slugify(subject + '-' + (scheduledAt || new Date().toISOString()));

  return {
    id,
    subject,
    intro: input.intro || '',
    type,
    status,
    scheduledAt,
    sentAt: normalizeDate(input.sentAt || input.sent_at),
    items,
  };
}

function toDbIssue(issue) {
  return {
    id: issue.id,
    subject: issue.subject,
    intro: issue.intro || null,
    issue_type: issue.type,
    status: issue.status,
    scheduled_at: issue.scheduledAt || null,
    sent_at: issue.sentAt || null,
    payload: issue,
    updated_at: new Date().toISOString(),
  };
}

function toDbIssueItem(issueId, item) {
  return {
    issue_id: issueId,
    item_type: item.itemType,
    item_id: item.itemId,
    position: item.position,
    title: item.title,
    link: item.link,
    source: item.source || null,
    summary: item.summary || null,
    payload: item.payload || {},
  };
}

function fromDbIssue(row, items = []) {
  return {
    ...(row.payload || {}),
    id: row.id,
    subject: row.subject,
    intro: row.intro || row.payload?.intro || '',
    type: row.issue_type || row.payload?.type || 'curadoria',
    status: row.status,
    scheduledAt: row.scheduled_at || row.payload?.scheduledAt || null,
    sentAt: row.sent_at || row.payload?.sentAt || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items: items.map((item) => ({
      ...(item.payload || {}),
      itemType: item.item_type,
      itemId: item.item_id,
      position: item.position,
      title: item.title,
      link: item.link,
      source: item.source,
      summary: item.summary,
      payload: item.payload || {},
    })),
  };
}

export function selectDigestIssue({ issues = [], approvedNews = [] } = {}) {
  const scheduled = issues
    .filter((issue) => issue.status === 'agendada' && (issue.items || []).length > 0)
    .sort((a, b) => new Date(a.scheduledAt || 0).getTime() - new Date(b.scheduledAt || 0).getTime());

  if (scheduled.length > 0) {
    const issue = scheduled[0];
    return {
      source: 'issue',
      issue,
      subject: issue.subject || 'Curadoria VANT Business',
      intro: issue.intro || '',
      items: issue.items,
    };
  }

  return {
    source: 'approved-news',
    issue: null,
    subject: 'As 10 melhores noticias de IA de hoje',
    intro: '',
    items: approvedNews.slice(0, 10).map((item, index) => normalizeIssueItem(item, index)),
  };
}

export async function getNewsletterIssues() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { stored: false, issues: [] };

  const { data: issueRows, error: issueError } = await supabase
    .from('newsletter_issues')
    .select('*')
    .order('scheduled_at', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (issueError) throw issueError;
  const ids = (issueRows || []).map((issue) => issue.id);
  if (ids.length === 0) return { stored: true, issues: [] };

  const { data: itemRows, error: itemError } = await supabase
    .from('newsletter_issue_items')
    .select('*')
    .in('issue_id', ids)
    .order('position', { ascending: true });

  if (itemError) throw itemError;
  const itemsByIssue = new Map();
  (itemRows || []).forEach((item) => {
    const current = itemsByIssue.get(item.issue_id) || [];
    current.push(item);
    itemsByIssue.set(item.issue_id, current);
  });

  return {
    stored: true,
    issues: (issueRows || []).map((issue) => fromDbIssue(issue, itemsByIssue.get(issue.id) || [])),
  };
}

export async function upsertNewsletterIssue(input) {
  const issue = buildNewsletterIssueFromItems(input);
  const supabase = getSupabaseAdmin();
  if (!supabase) return { stored: false, issue };

  const { error: issueError } = await supabase
    .from('newsletter_issues')
    .upsert(toDbIssue(issue), { onConflict: 'id' });

  if (issueError) throw issueError;

  const { error: deleteError } = await supabase
    .from('newsletter_issue_items')
    .delete()
    .eq('issue_id', issue.id);

  if (deleteError) throw deleteError;

  if (issue.items.length > 0) {
    const { error: itemError } = await supabase
      .from('newsletter_issue_items')
      .insert(issue.items.map((item) => toDbIssueItem(issue.id, item)));

    if (itemError) throw itemError;
  }

  return { stored: true, issue };
}

export async function getNextScheduledNewsletterIssue() {
  const { issues } = await getNewsletterIssues();
  return selectDigestIssue({ issues }).issue;
}

export async function markNewsletterIssueSent(issueId, sentAt = new Date().toISOString()) {
  const supabase = getSupabaseAdmin();
  if (!supabase || !issueId) return { stored: false };

  const { error } = await supabase
    .from('newsletter_issues')
    .update({ status: 'enviada', sent_at: sentAt, updated_at: sentAt })
    .eq('id', issueId);

  if (error) throw error;
  return { stored: true };
}
