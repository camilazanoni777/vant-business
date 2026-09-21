import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  buildClientWhatsAppHandoffUrl,
  buildClientProjectPipeline,
  clientJourneyDecisionOptions,
  clientJourneyStatusLevels,
  getClientCommercialPriority,
  getClientJourney,
  getNextJourneyStatus,
  getPreviousJourneyStatus,
  groupBriefingResponsesByClient,
} from '../src/utils/adminLeads.js';

test('defines visible status levels for the client journey without exposing percentages', () => {
  assert.deepEqual(
    clientJourneyStatusLevels.map((level) => level.id),
    ['new', 'triage', 'proposal', 'presentation']
  );
  assert.equal(clientJourneyStatusLevels.some((level) => level.id === 'remarketing'), false);
  assert.equal(clientJourneyStatusLevels.some((level) => level.id === 'client'), false);
  assert.equal(clientJourneyStatusLevels.some((level) => 'progress' in level), false);
});

test('defines proposal decision options outside the main status ruler', () => {
  assert.deepEqual(
    clientJourneyDecisionOptions.map((option) => option.id),
    ['remarketing', 'client']
  );
});

test('groups service briefing responses by client without dropping repeated answers', () => {
  const grouped = groupBriefingResponsesByClient([
    {
      id: 'lead-older',
      nome: 'Cliente VANT',
      email: 'cliente@exemplo.com',
      whatsapp: '11999999999',
      lead_type: 'service',
      product_title: 'Site profissional',
      metadata: { message: 'Primeira resposta' },
      created_at: '2026-05-01T10:00:00.000Z',
    },
    {
      id: 'lead-newsletter',
      nome: 'Cliente VANT',
      email: 'cliente@exemplo.com',
      lead_type: 'newsletter',
      created_at: '2026-05-01T09:00:00.000Z',
    },
    {
      id: 'lead-newer',
      nome: 'Cliente Atualizado',
      email: 'CLIENTE@EXEMPLO.COM',
      whatsapp: '11999999999',
      lead_type: 'service',
      product_title: 'Identidade digital',
      metadata: { message: 'Segunda resposta' },
      created_at: '2026-05-03T10:00:00.000Z',
    },
  ]);

  assert.equal(grouped.length, 1);
  assert.equal(grouped[0].name, 'Cliente Atualizado');
  assert.equal(grouped[0].email, 'cliente@exemplo.com');
  assert.equal(grouped[0].responses.length, 2);
  assert.deepEqual(
    grouped[0].responses.map((response) => response.id),
    ['lead-newer', 'lead-older']
  );
});

test('classifies clients into proposal, triage, and remarketing journey lanes', () => {
  const [proposalClient, remarketingClient, triageClient] = groupBriefingResponsesByClient([
    {
      id: 'proposal',
      nome: 'Cliente Proposta',
      email: 'proposta@exemplo.com',
      whatsapp: '11999999999',
      lead_type: 'service',
      metadata: {
        solutionType: 'Site profissional',
        projectStage: 'Tenho uma demanda urgente',
        budgetRange: 'R$ 3.000 a R$ 6.000',
        message: 'Preciso apresentar melhor minha empresa.',
      },
      created_at: '2026-05-04T10:00:00.000Z',
    },
    {
      id: 'remarketing',
      nome: 'Cliente Remarketing',
      email: 'remarketing@exemplo.com',
      whatsapp: '11888888888',
      lead_type: 'service',
      metadata: {
        solutionType: 'Ainda nao sei',
        projectStage: 'Preciso comecar do zero',
        budgetRange: 'Ainda quero entender valores',
        message: 'Quero conhecer as possibilidades.',
      },
      created_at: '2026-05-03T10:00:00.000Z',
    },
    {
      id: 'triage',
      nome: 'Cliente Triagem',
      email: 'triagem@exemplo.com',
      lead_type: 'service',
      metadata: {
        solutionType: 'Presenca digital e identidade',
        budgetRange: 'R$ 1.500 a R$ 3.000',
      },
      created_at: '2026-05-02T10:00:00.000Z',
    },
  ]);

  assert.equal(getClientJourney(proposalClient).lane, 'proposal');
  assert.equal(getClientJourney(remarketingClient).lane, 'remarketing');
  assert.equal(getClientJourney(triageClient).lane, 'triage');
});

test('builds a project pipeline with clients grouped under journey lanes', () => {
  const clients = groupBriefingResponsesByClient([
    {
      id: 'proposal',
      nome: 'Cliente Proposta',
      email: 'proposta@exemplo.com',
      whatsapp: '11999999999',
      lead_type: 'service',
      metadata: {
        businessName: 'Studio Proposta',
        solutionType: 'Site profissional',
        projectStage: 'Tenho uma demanda urgente',
        budgetRange: 'R$ 3.000 a R$ 6.000',
        message: 'Preciso apresentar melhor minha empresa.',
      },
      created_at: '2026-05-04T10:00:00.000Z',
    },
    {
      id: 'triage',
      nome: 'Cliente Triagem',
      email: 'triagem@exemplo.com',
      lead_type: 'service',
      metadata: {
        solutionType: 'Presenca digital e identidade',
        budgetRange: 'R$ 1.500 a R$ 3.000',
      },
      created_at: '2026-05-02T10:00:00.000Z',
    },
  ]);

  const pipeline = buildClientProjectPipeline(clients);

  assert.equal(pipeline.find((lane) => lane.id === 'proposal').clients[0].projectName, 'Studio Proposta');
  assert.equal(pipeline.find((lane) => lane.id === 'triage').clients[0].projectName, 'Cliente Triagem');
  assert.deepEqual(
    pipeline.map((lane) => lane.id),
    ['new', 'triage', 'proposal', 'presentation', 'remarketing', 'client']
  );
});

test('uses a manual admin status before automatic journey classification', () => {
  const [client] = groupBriefingResponsesByClient([
    {
      id: 'manual',
      nome: 'Cliente Manual',
      email: 'manual@exemplo.com',
      whatsapp: '11999999999',
      lead_type: 'service',
      metadata: {
        adminJourneyStatus: 'presentation',
        adminNote: 'Proposta ja foi apresentada por WhatsApp.',
        solutionType: 'Ainda nao sei',
        projectStage: 'Preciso comecar do zero',
        budgetRange: 'Ainda quero entender valores',
        message: 'Quero entender possibilidades.',
      },
      created_at: '2026-05-04T10:00:00.000Z',
    },
  ]);

  assert.equal(client.journey.lane, 'presentation');
  assert.equal(client.journey.note, 'Proposta ja foi apresentada por WhatsApp.');
});

test('supports marking a proposal as a converted client', () => {
  const [client] = groupBriefingResponsesByClient([
    {
      id: 'client',
      nome: 'Cliente Fechado',
      email: 'cliente@exemplo.com',
      whatsapp: '11999999999',
      lead_type: 'service',
      metadata: {
        adminJourneyStatus: 'client',
        solutionType: 'Site profissional',
        projectStage: 'Tenho uma demanda urgente',
        budgetRange: 'R$ 3.000 a R$ 6.000',
        message: 'Vamos fechar o projeto.',
      },
      created_at: '2026-05-04T10:00:00.000Z',
    },
  ]);

  assert.equal(client.journey.lane, 'client');
  assert.equal(client.journey.label, 'Cliente');
});

test('moves leads forward and backward through the sales funnel stages', () => {
  assert.equal(getNextJourneyStatus('new'), 'triage');
  assert.equal(getNextJourneyStatus('proposal'), 'presentation');
  assert.equal(getNextJourneyStatus('presentation'), 'presentation');

  assert.equal(getPreviousJourneyStatus('proposal'), 'triage');
  assert.equal(getPreviousJourneyStatus('presentation'), 'proposal');
  assert.equal(getPreviousJourneyStatus('new'), 'new');
});


test('classifies commercial priority for the VANT v2 lead operation', () => {
  const [urgentProposal, coldLead, manualPriority] = groupBriefingResponsesByClient([
    {
      id: 'urgent',
      nome: 'Cliente Urgente',
      email: 'urgente@exemplo.com',
      whatsapp: '11999999999',
      lead_type: 'service',
      metadata: {
        solutionType: 'Site profissional',
        projectStage: 'Tenho uma demanda urgente',
        budgetRange: 'R$ 3.000 a R$ 6.000',
        message: 'Preciso organizar minha captacao.',
      },
      created_at: '2026-05-04T10:00:00.000Z',
    },
    {
      id: 'cold',
      nome: 'Cliente Frio',
      email: 'frio@exemplo.com',
      whatsapp: '11888888888',
      lead_type: 'service',
      metadata: {
        solutionType: 'Ainda nao sei',
        projectStage: 'Preciso comecar do zero',
        budgetRange: 'Ainda quero entender valores',
        message: 'Quero entender possibilidades.',
      },
      created_at: '2026-05-03T10:00:00.000Z',
    },
    {
      id: 'manual',
      nome: 'Cliente Manual',
      email: 'manual@exemplo.com',
      whatsapp: '11777777777',
      lead_type: 'service',
      metadata: {
        adminPriority: 'high',
        solutionType: 'Automacao leve ou IA aplicada',
        projectStage: 'Ja tenho algo, mas preciso melhorar',
        budgetRange: 'Ate R$ 1.500',
        message: 'Preciso de uma melhoria pontual.',
      },
      created_at: '2026-05-02T10:00:00.000Z',
    },
  ]);

  assert.equal(getClientCommercialPriority(urgentProposal).id, 'high');
  assert.equal(getClientCommercialPriority(coldLead).id, 'low');
  assert.equal(getClientCommercialPriority(manualPriority).id, 'high');
});

test('builds a WhatsApp handoff URL with the lead briefing context', () => {
  const [client] = groupBriefingResponsesByClient([
    {
      id: 'handoff',
      nome: 'Cliente Handoff',
      email: 'handoff@exemplo.com',
      whatsapp: '(11) 99999-9999',
      lead_type: 'service',
      metadata: {
        businessName: 'Studio Handoff',
        solutionType: 'Site profissional',
        mainGoal: 'Gerar mais oportunidades',
        projectStage: 'Tenho uma demanda urgente',
        budgetRange: 'R$ 3.000 a R$ 6.000',
        message: 'Quero organizar a entrada de clientes.',
      },
      created_at: '2026-05-04T10:00:00.000Z',
    },
  ]);

  const url = buildClientWhatsAppHandoffUrl(client);

  assert.match(url, /^https:\/\/wa\.me\/5511999999999\?text=/);
  assert.match(decodeURIComponent(url), /Studio Handoff/);
  assert.match(decodeURIComponent(url), /Site profissional/);
  assert.match(decodeURIComponent(url), /Gerar mais oportunidades/);
  assert.match(decodeURIComponent(url), /Preparar proposta e agendar apresentacao/);
});


test('admin leads panel exposes VANT v2 priority and WhatsApp handoff actions', () => {
  const adminSource = readFileSync(new URL('../src/pages/AdminPublishingPage.jsx', import.meta.url), 'utf8');

  assert.match(adminSource, /getClientCommercialPriority/);
  assert.match(adminSource, /buildClientWhatsAppHandoffUrl/);
  assert.match(adminSource, /Prioridade comercial/);
  assert.match(adminSource, /adminPriority/);
  assert.match(adminSource, /Continuar no WhatsApp/);
});


test('admin leads API accepts adminPriority as editable metadata', () => {
  const apiSource = readFileSync(new URL('../api/admin-leads.js', import.meta.url), 'utf8');

  assert.match(apiSource, /adminPriority/);
  assert.match(apiSource, /adminJourneyStatus/);
  assert.match(apiSource, /adminNextAction/);
});
