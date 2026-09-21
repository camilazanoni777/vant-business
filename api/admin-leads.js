import { isAdminRequest } from './_adminAuth.js';
import { getSupabaseAdmin } from './_supabaseAdmin.js';

function cleanIds(ids = []) {
  return [...new Set((Array.isArray(ids) ? ids : [ids]).map((id) => String(id || '').trim()).filter(Boolean))];
}

function cleanMetadataPatch(input = {}) {
  const patch = {};

  ['adminJourneyStatus', 'adminPriority', 'adminNote', 'adminNextAction'].forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      patch[key] = String(input[key] || '').trim();
    }
  });

  return patch;
}

export default async function handler(req, res) {
  if (!['PATCH', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase nao configurado' });
  }

  try {
    if (req.method === 'DELETE') {
      const ids = cleanIds(req.body?.ids || req.body?.id);
      if (ids.length === 0) return res.status(400).json({ error: 'Lead nao informado' });

      const { error } = await supabase.from('subscribers').delete().in('id', ids);
      if (error) throw error;

      return res.status(200).json({ ok: true, deleted: ids.length });
    }

    const id = String(req.body?.id || '').trim();
    if (!id) return res.status(400).json({ error: 'Lead nao informado' });

    const { data: current, error: readError } = await supabase
      .from('subscribers')
      .select('id,metadata')
      .eq('id', id)
      .single();

    if (readError) throw readError;

    const metadata = {
      ...(current?.metadata || {}),
      ...cleanMetadataPatch(req.body || {}),
      adminUpdatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('subscribers')
      .update({ metadata, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id,metadata')
      .single();

    if (error) throw error;

    return res.status(200).json({ ok: true, lead: data });
  } catch (error) {
    console.error('Admin leads error:', error);
    return res.status(500).json({ error: 'Falha ao atualizar lead' });
  }
}
