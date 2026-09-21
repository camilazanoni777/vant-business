import assert from 'node:assert/strict';
import {
  buildToolCategories,
  getPublishedTools,
  normalizeToolItem,
} from '../api/_toolsStore.js';
import {
  approvedStatuses,
  normalizeNewsItem,
} from '../api/_newsStore.js';
import {
  getAdminNewsStatusLabel,
  sortAdminNewsItems,
} from '../src/utils/adminPublishing.js';

const draftTool = normalizeToolItem({
  name: 'Gamma AI',
  description: 'Cria apresentacoes com IA.',
  link: 'https://gamma.app',
  categoria: 'Produtividade',
}, 'rascunho');

assert.equal(draftTool.id, 'gamma-ai');
assert.equal(draftTool.status, 'rascunho');
assert.equal(draftTool.utm, '?utm_source=vant&utm_content=recursos');
assert.equal(draftTool.badge, null);
assert.equal(draftTool.gratis, false);

const publishedTools = getPublishedTools([
  draftTool,
  { ...draftTool, id: 'gamma-public', status: 'publicada' },
  { ...draftTool, id: 'gamma-approved', status: 'aprovada', categoria: 'Marketing' },
]);

assert.deepEqual(
  publishedTools.map((tool) => tool.id),
  ['gamma-public', 'gamma-approved']
);

assert.deepEqual(buildToolCategories(publishedTools), ['Todas', 'Marketing', 'Produtividade']);

const publishedNews = normalizeNewsItem({
  titlePt: 'Nova ferramenta de IA para vendas',
  link: 'https://example.com/news',
  source: 'Example',
  summaryPt: 'Resumo curto para o blog.',
}, 'aprovada');

assert.equal(publishedNews.id, 'nova-ferramenta-de-ia-para-vendas');
assert.equal(publishedNews.title, 'Nova ferramenta de IA para vendas');
assert.equal(publishedNews.status, 'aprovada');
assert.ok(publishedNews.publishedAt);
assert.ok(approvedStatuses.includes(publishedNews.status));
assert.equal(getAdminNewsStatusLabel(publishedNews.status), 'Publicada');

const sortedNews = sortAdminNewsItems([
  { id: 'publicada', status: 'aprovada', publishedAt: '2026-05-12T10:00:00.000Z' },
  { id: 'rascunho', status: 'rascunho', updatedAt: '2026-05-12T09:00:00.000Z' },
  { id: 'revisao', status: 'aguardando_avaliacao', updatedAt: '2026-05-12T08:00:00.000Z' },
]);

assert.deepEqual(
  sortedNews.map((item) => item.id),
  ['rascunho', 'revisao', 'publicada']
);
