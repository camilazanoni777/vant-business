import { affiliateTools, ebookTools } from '../src/data/aiPipeline.js';
import { recordEvent } from './_trackEvent.js';
import { findPublishedToolById } from './_toolsStore.js';

async function findTool(kind, id) {
  if (kind === 'tool') {
    const tool = await findPublishedToolById(id);
    if (!tool) return null;
    return {
      id: tool.id,
      title: tool.name,
      targetUrl: `${tool.link}${tool.utm || ''}`,
    };
  }

  if (kind === 'agent-tool') {
    const tool = [...affiliateTools, ...ebookTools].find((item) => item.id === id);
    if (!tool) return null;
    return {
      id: tool.id,
      title: tool.name,
      targetUrl: tool.affiliateUrl || tool.url,
    };
  }

  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const kind = String(req.query?.kind || 'tool');
  const id = String(req.query?.id || '');
  const source = String(req.query?.source || 'public');
  const item = await findTool(kind, id);

  if (!item) {
    return res.status(404).json({ error: 'Destino nao encontrado' });
  }

  try {
    await recordEvent(req, {
      eventType: 'click',
      itemType: kind,
      itemId: item.id,
      itemTitle: item.title,
      targetUrl: item.targetUrl,
      source,
      path: req.headers.referer || '',
    });
  } catch (error) {
    console.error('Out tracking error:', error);
  }

  res.setHeader('Cache-Control', 'no-store');
  res.writeHead(302, { Location: item.targetUrl });
  return res.end();
}
