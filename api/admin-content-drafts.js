import { isAdminRequest } from './_adminAuth.js';
import { affiliateTools, ebookTools } from '../src/data/aiPipeline.js';
import { readContentDrafts, upsertContentDraftStatus } from './_contentDraftStore.js';

function buildContentDrafts(affiliateItems, ebookItems) {
  const allTools = [...affiliateItems, ...ebookItems];

  const ebookDrafts = allTools.map((tool) => ({
    id: `ebook-${tool.id}`,
    kind: 'ebook',
    sourceId: tool.id,
    sourceName: tool.name,
    title: `Ebook: ${tool.name}`,
    audience: tool.category,
    summary: tool.nextOutput || tool.description,
    outline: ['Quem deve usar', ...(tool.relevantInfo || []).slice(0, 3), 'CTA de captura com email'],
    focus: 'Rascunho de ebook',
    status: 'rascunho',
  }));

  const videoDrafts = allTools.map((tool) => ({
    id: `video-${tool.id}`,
    kind: 'video',
    sourceId: tool.id,
    sourceName: tool.name,
    title: `Roteiro de video: ${tool.name}`,
    audience: tool.category,
    summary: tool.nextOutput || tool.description,
    outline: ['Gancho de abertura', 'Problema que a ferramenta resolve', 'Demonstracao pratica', 'CTA rastreavel'],
    focus: 'Fila para conteudo/roteiro',
    status: 'rascunho',
  }));

  return [...ebookDrafts, ...videoDrafts];
}

function mergeDraftStatuses(baseDrafts, storedDrafts) {
  const byId = new Map((storedDrafts || []).map((draft) => [draft.id, draft]));
  return baseDrafts.map((draft) => {
    const stored = byId.get(draft.id);
    if (!stored) return draft;
    return {
      ...draft,
      status: stored.status || draft.status,
      reviewedAt: stored.reviewedAt,
      createdAt: stored.createdAt,
      updatedAt: stored.updatedAt,
    };
  });
}

export default async function handler(req, res) {
  if (!isAdminRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const baseDrafts = buildContentDrafts(affiliateTools, ebookTools);
      const stored = await readContentDrafts();
      const merged = mergeDraftStatuses(baseDrafts, stored.items || []);

      return res.status(200).json({
        ok: true,
        items: merged,
        warnings: stored.warnings || [],
      });
    } catch (error) {
      console.error('Admin content drafts error:', error);
      return res.status(500).json({ error: 'Falha ao carregar rascunhos de conteudo' });
    }
  }

  if (req.method === 'POST') {
    try {
      const draft = req.body?.draft;
      const status = String(req.body?.status || '').trim();

      if (!draft?.id || !status) {
        return res.status(400).json({ error: 'Rascunho ou status invalido' });
      }

      const stored = await upsertContentDraftStatus(draft, status);
      return res.status(200).json({ ok: true, item: stored.item });
    } catch (error) {
      console.error('Admin content drafts update error:', error);
      return res.status(500).json({ error: 'Falha ao salvar rascunho de conteudo' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
