import assert from 'node:assert/strict';
import test from 'node:test';

import { parseNewsFeed } from '../api/_newsCollector.js';
import { buildNewsletterIssueFromItems, selectDigestIssue } from '../api/_newsletterStore.js';

test('builds a newsletter issue from selected news without publishing immediately', () => {
  const issue = buildNewsletterIssueFromItems({
    subject: 'Curadoria VANT: agentes de IA na operacao',
    type: 'curadoria',
    scheduledAt: '2026-05-30T12:00:00.000Z',
    items: [
      {
        id: 'news-1',
        titlePt: 'Agentes entram no fluxo de empresas',
        title: 'Agents enter business workflows',
        link: 'https://example.com/news-1',
        source: 'Fonte Teste',
        summaryPt: 'Resumo editorial em portugues.',
        status: 'aprovada',
      },
    ],
  });

  assert.equal(issue.status, 'rascunho');
  assert.equal(issue.type, 'curadoria');
  assert.equal(issue.subject, 'Curadoria VANT: agentes de IA na operacao');
  assert.equal(issue.scheduledAt, '2026-05-30T12:00:00.000Z');
  assert.deepEqual(issue.items, [
    {
      itemType: 'news',
      itemId: 'news-1',
      position: 1,
      title: 'Agentes entram no fluxo de empresas',
      link: 'https://example.com/news-1',
      source: 'Fonte Teste',
      summary: 'Resumo editorial em portugues.',
      payload: { status: 'aprovada' },
    },
  ]);
});

test('selects the next scheduled newsletter issue before approved-news fallback', () => {
  const selected = selectDigestIssue({
    issues: [
      { id: 'later', status: 'agendada', scheduledAt: '2026-05-31T12:00:00.000Z', items: [] },
      {
        id: 'next',
        status: 'agendada',
        scheduledAt: '2026-05-30T12:00:00.000Z',
        subject: 'Edicao agendada',
        items: [{ title: 'Item selecionado', link: 'https://example.com', summary: 'Resumo' }],
      },
    ],
    approvedNews: [{ id: 'fallback', titlePt: 'Fallback aprovado', status: 'aprovada' }],
  });

  assert.equal(selected.source, 'issue');
  assert.equal(selected.issue.id, 'next');
  assert.equal(selected.subject, 'Edicao agendada');
  assert.equal(selected.items.length, 1);
});

test('parses feed entities and normalizes whitespace for news agent items', () => {
  const items = parseNewsFeed(
    `<?xml version="1.0"?>
      <rss><channel><item>
        <title>OpenAI &amp; agentes&#32;de IA</title>
        <link>https://example.com/openai-agents</link>
        <description><![CDATA[Texto   com\n  espacos &amp; detalhes de AI.]]></description>
        <pubDate>Fri, 29 May 2026 10:00:00 GMT</pubDate>
      </item></channel></rss>`,
    { name: 'Fonte Teste', category: 'Modelos' }
  );

  assert.equal(items.length, 1);
  assert.equal(items[0].title, 'OpenAI & agentes de IA');
  assert.equal(items[0].summary, 'Texto com espacos & detalhes de AI.');
  assert.equal(items[0].link, 'https://example.com/openai-agents');
  assert.equal(items[0].score > 0, true);
});
