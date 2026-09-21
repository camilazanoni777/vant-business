import assert from 'node:assert/strict';
import { getAdminWorkspaceSummary } from '../src/utils/adminDashboard.js';

const summary = getAdminWorkspaceSummary({
  clicks: [
    { item_type: 'ebook' },
    { item_type: 'tool' },
    { item_type: 'tool' },
  ],
  subscribers: [{ id: 'lead-1' }, { id: 'lead-2' }],
  newsItems: [
    { id: 'news-1', status: 'aguardando_avaliacao' },
    { id: 'news-2', status: 'aprovada' },
    { id: 'news-3', status: 'reprovada' },
  ],
  agentWorkflow: [{ id: 'pesquisa' }, { id: 'noticias' }],
  agentResponses: [{ item_id: 'pesquisa' }],
  publicTools: [{ id: 'taskade' }, { id: 'chatgpt' }],
  pipelineTools: [{ id: 'taskade' }, { id: 'claude' }, { id: 'chatgpt' }],
  contentDrafts: [
    { id: 'ebook-taskade', status: 'rascunho' },
    { id: 'video-taskade', status: 'em revisao' },
    { id: 'newsletter-semana', status: 'pronto para postar' },
  ],
});

assert.deepEqual(summary.metrics, {
  clicks: 3,
  leads: 2,
  pendingNews: 1,
  approvedNews: 1,
  completedAgents: 1,
  totalAgents: 2,
  publicTools: 2,
  candidateTools: 3,
});

assert.deepEqual(
  summary.workspaces.map((workspace) => workspace.id),
  ['today', 'research', 'publish', 'tools', 'results']
);

assert.equal(summary.nextAction.workspace, 'publish');
assert.equal(summary.nextAction.label, 'Revisar noticias pendentes');
assert.equal(summary.workspaces[1].badge, '1/2');
assert.equal(summary.workspaces[2].badge, '1 pendente');
assert.equal(summary.workspaces[3].badge, '2 publicas');

assert.deepEqual(summary.queues, {
  aiInbox: 5,
  reviewNeeded: 3,
  readyToPublish: 2,
  contentDrafts: 3,
  toolGaps: 1,
});

assert.deepEqual(
  summary.codexFillables.map((item) => item.id),
  ['tools', 'news', 'content', 'newsletter']
);

assert.deepEqual(
  summary.operatingSteps.map((step) => step.label),
  ['Pedir preenchimento', 'Revisar fila', 'Aprovar publicacao', 'Medir resultado']
);
