import assert from 'node:assert/strict';
import test from 'node:test';
import * as newsStore from '../api/_newsStore.js';
import * as toolsStore from '../api/_toolsStore.js';

test('public tools keep the static baseline when db rows are only drafts', () => {
  const staticTools = [
    { id: 'chatgpt', name: 'ChatGPT', categoria: 'IA', status: 'publicada' },
    { id: 'n8n', name: 'n8n', categoria: 'Automacao', status: 'publicada' },
  ];
  const dbTools = [
    { id: 'chatgpt', name: 'ChatGPT draft', categoria: 'IA', status: 'rascunho' },
  ];

  const result = toolsStore.buildPublicToolCatalog(staticTools, dbTools);

  assert.equal(result.usedFallback, false);
  assert.equal(result.items.length, 2);
  assert.equal(result.items[0].name, 'ChatGPT');
  assert.equal(result.items[0].status, 'publicada');
});

test('public news generatedAt reflects the freshest merged content timestamp', () => {
  const generatedAt = newsStore.resolvePublicNewsGeneratedAt('2026-05-08T22:41:19.430Z', [
    { id: 'older-static', publishedAt: '2026-05-08T18:45:08+00:00' },
    { id: 'fresh-reviewed', reviewedAt: '2026-05-16T15:38:21.438+00:00', status: 'aprovada' },
  ]);

  assert.equal(generatedAt, '2026-05-16T15:38:21.438+00:00');
});
