import { isAdminRequest } from './_adminAuth.js';
import { collectNewsPayload } from './_newsCollector.js';
import { upsertNewsItem } from './_newsStore.js';
import { upsertNewsletterIssue } from './_newsletterStore.js';
import { upsertToolItem } from './_toolsStore.js';

const allowedStatuses = ['rascunho', 'aguardando_avaliacao', 'aprovada', 'publicada', 'reprovada'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const status = String(req.body?.status || '').trim();
  const item = req.body?.item;
  const tool = req.body?.tool;

  if (req.body?.action === 'collect_news') {
    try {
      const limit = Number(req.body?.limit || process.env.NEWS_AGENT_LIMIT || 20);
      const payload = await collectNewsPayload({ limit });
      const stored = [];

      for (const newsItem of payload.items || []) {
        const result = await upsertNewsItem(newsItem, newsItem.status || 'aguardando_avaliacao');
        stored.push(result.item);
      }

      return res.status(200).json({
        ok: true,
        stored: stored.length,
        items: stored,
        failedSources: payload.failedSources || [],
        generatedAt: payload.generatedAt,
      });
    } catch (error) {
      console.error('Admin news agent error:', error);
      return res.status(500).json({ error: 'Falha ao buscar noticias atuais' });
    }
  }

  if (req.body?.type === 'newsletter_issue') {
    try {
      const items = Array.isArray(req.body?.items) ? req.body.items.slice(0, 10) : [];
      if (items.length === 0) {
        return res.status(400).json({ error: 'Selecione ao menos uma noticia para o email' });
      }

      const result = await upsertNewsletterIssue({
        id: req.body?.id,
        subject: req.body?.subject,
        intro: req.body?.intro,
        type: req.body?.issueType || req.body?.newsletterType || 'curadoria',
        status: req.body?.issueStatus || 'rascunho',
        scheduledAt: req.body?.scheduledAt,
        items,
      });

      return res.status(200).json({ ok: true, ...result });
    } catch (error) {
      console.error('Admin newsletter issue error:', error);
      return res.status(500).json({ error: 'Falha ao salvar edicao de newsletter' });
    }
  }

  if (req.body?.type === 'tool' || tool) {
    const toolStatus = status || tool?.status || 'rascunho';
    if (!tool?.name || !tool?.link || !allowedStatuses.includes(toolStatus)) {
      return res.status(400).json({ error: 'Ferramenta ou status invalido' });
    }

    try {
      const result = await upsertToolItem(tool, toolStatus);
      return res.status(200).json({ ok: true, ...result });
    } catch (error) {
      console.error('Admin tool update error:', error);
      return res.status(500).json({ error: 'Falha ao salvar ferramenta' });
    }
  }

  if (!(item?.id || item?.title || item?.titlePt) || !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Noticia ou status invalido' });
  }

  try {
    const result = await upsertNewsItem(item, status);
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    console.error('Admin news update error:', error);
    return res.status(500).json({ error: 'Falha ao atualizar noticia' });
  }
}
