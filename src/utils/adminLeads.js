function normalizeText(value = '') {
  return String(value || '').trim();
}

function normalizeEmail(value = '') {
  return normalizeText(value).toLowerCase();
}

function clientKeyForLead(lead = {}) {
  const email = normalizeEmail(lead.email);
  if (email) return `email:${email}`;

  const whatsapp = normalizeText(lead.whatsapp).replace(/\D/g, '');
  if (whatsapp) return `whatsapp:${whatsapp}`;

  return `lead:${lead.id || normalizeText(lead.nome) || 'sem-identificacao'}`;
}

function sortByNewest(a = {}, b = {}) {
  return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
}

function latestResponse(client = {}) {
  return (client.responses || [])[0] || {};
}

function isColdBudget(value = '') {
  const budget = normalizeText(value).toLowerCase();
  return budget.includes('ainda quero entender') || budget.includes('ate r$ 1.500') || budget.includes('até r$ 1.500');
}

function isWarmBudget(value = '') {
  const budget = normalizeText(value).toLowerCase();
  return budget.includes('1.500') || budget.includes('3.000') || budget.includes('6.000') || budget.includes('acima');
}

function hasUnknownSolution(value = '') {
  const solution = normalizeText(value).toLowerCase();
  return !solution || solution.includes('ainda nao sei') || solution.includes('ainda não sei');
}

function getProjectName(client = {}) {
  const lead = latestResponse(client);
  const metadata = lead.metadata || {};
  return normalizeText(metadata.businessName) || normalizeText(lead.product_title) || client.name || 'Projeto sem nome';
}

export const clientJourneyLanes = [
  {
    id: 'new',
    label: 'Entrada',
    description: 'Lead novo com briefing recebido.',
  },
  {
    id: 'triage',
    label: 'Triagem',
    description: 'Falta dado ou validacao antes de decidir rota.',
  },
  {
    id: 'proposal',
    label: 'Proposta',
    description: 'Demanda com fit para preparar proposta.',
  },
  {
    id: 'presentation',
    label: 'Apresentacao',
    description: 'Etapa seguinte apos proposta pronta.',
  },
  {
    id: 'remarketing',
    label: 'Remarketing',
    description: 'Lead frio, indefinido ou sem prioridade comercial agora.',
  },
  {
    id: 'client',
    label: 'Cliente',
    description: 'Proposta aceita ou cliente convertido.',
  },
];

export const clientJourneyStatusLevels = clientJourneyLanes.slice(0, 4).map((lane) => ({
  id: lane.id,
  label: lane.label,
  description: lane.description,
}));

export const clientJourneyDecisionOptions = clientJourneyLanes.slice(4).map((lane) => ({
  id: lane.id,
  label: lane.label,
  description: lane.description,
}));

export const adminJourneyStatusOptions = clientJourneyLanes.map((lane) => ({
  value: lane.id,
  label: lane.label,
}));

export function getNextJourneyStatus(currentStatus = '') {
  const currentIndex = clientJourneyStatusLevels.findIndex((lane) => lane.id === currentStatus);
  if (currentIndex === -1) return clientJourneyStatusLevels[0].id;
  return clientJourneyStatusLevels[Math.min(currentIndex + 1, clientJourneyStatusLevels.length - 1)].id;
}

export function getPreviousJourneyStatus(currentStatus = '') {
  const currentIndex = clientJourneyStatusLevels.findIndex((lane) => lane.id === currentStatus);
  if (currentIndex <= 0) return clientJourneyStatusLevels[0].id;
  return clientJourneyStatusLevels[currentIndex - 1].id;
}

const manualJourneyConfig = {
  new: {
    tone: 'cyan',
    nextAction: 'Revisar briefing recebido e confirmar proximo passo.',
  },
  triage: {
    tone: 'amber',
    nextAction: 'Validar dados pendentes antes de proposta.',
  },
  proposal: {
    tone: 'emerald',
    nextAction: 'Preparar proposta e agendar apresentacao.',
  },
  remarketing: {
    tone: 'slate',
    nextAction: 'Nutrir com diagnostico, prova de valor ou conversa curta antes de proposta.',
  },
  presentation: {
    tone: 'cyan',
    nextAction: 'Registrar retorno da apresentacao e definir fechamento ou follow-up.',
  },
  client: {
    tone: 'emerald',
    nextAction: 'Iniciar onboarding e registrar proximos combinados do projeto.',
  },
};

export function getClientJourney(client = {}) {
  const lead = latestResponse(client);
  const metadata = lead.metadata || {};
  const manualStatus = normalizeText(metadata.adminJourneyStatus);
  const manualLane = clientJourneyLanes.find((lane) => lane.id === manualStatus);

  if (manualLane) {
    const config = manualJourneyConfig[manualLane.id] || manualJourneyConfig.new;
    return {
      lane: manualLane.id,
      label: manualLane.label,
      tone: config.tone,
      nextAction: normalizeText(metadata.adminNextAction) || config.nextAction,
      note: normalizeText(metadata.adminNote),
      missing: [],
      manual: true,
    };
  }

  const missing = [];

  if (!client.email) missing.push('email');
  if (!client.whatsapp) missing.push('WhatsApp');
  if (!normalizeText(metadata.solutionType)) missing.push('solucao');
  if (!normalizeText(metadata.projectStage)) missing.push('momento');
  if (!normalizeText(metadata.budgetRange)) missing.push('investimento');
  if (!normalizeText(metadata.message)) missing.push('descricao');

  if (missing.length > 0) {
    return {
      lane: 'triage',
      label: 'Triagem',
      tone: 'amber',
      nextAction: `Pedir ${missing.slice(0, 2).join(' e ')} antes de proposta.`,
      missing,
    };
  }

  if (isColdBudget(metadata.budgetRange) || hasUnknownSolution(metadata.solutionType)) {
    return {
      lane: 'remarketing',
      label: 'Remarketing',
      tone: 'slate',
      nextAction: 'Nutrir com diagnostico, prova de valor ou conversa curta antes de proposta.',
      missing: [],
    };
  }

  if (isWarmBudget(metadata.budgetRange)) {
    return {
      lane: 'proposal',
      label: 'Proposta',
      tone: 'emerald',
      nextAction: 'Preparar proposta e agendar apresentacao.',
      missing: [],
    };
  }

  return {
    lane: 'new',
    label: 'Entrada',
    tone: 'cyan',
    nextAction: 'Revisar briefing recebido e confirmar proximo passo.',
    missing: [],
  };
}

export function groupBriefingResponsesByClient(leads = []) {
  const serviceLeads = leads
    .filter((lead) => normalizeText(lead.lead_type).toLowerCase() === 'service')
    .sort(sortByNewest);

  const grouped = new Map();

  serviceLeads.forEach((lead) => {
    const key = clientKeyForLead(lead);
    const email = normalizeEmail(lead.email);
    const current = grouped.get(key);

    if (!current) {
      grouped.set(key, {
        key,
        name: normalizeText(lead.nome) || 'Cliente sem nome',
        email,
        whatsapp: normalizeText(lead.whatsapp),
        latestAt: lead.created_at || null,
        responses: [lead],
      });
      return;
    }

    current.responses.push(lead);

    if (sortByNewest(lead, { created_at: current.latestAt }) < 0) {
      current.name = normalizeText(lead.nome) || current.name;
      current.email = email || current.email;
      current.whatsapp = normalizeText(lead.whatsapp) || current.whatsapp;
      current.latestAt = lead.created_at || current.latestAt;
    }
  });

  return [...grouped.values()]
    .map((client) => ({
      ...client,
      responses: client.responses.sort(sortByNewest),
    }))
    .map((client) => ({
      ...client,
      journey: getClientJourney(client),
    }))
    .sort((a, b) => sortByNewest({ created_at: a.latestAt }, { created_at: b.latestAt }));
}

const commercialPriorityConfig = {
  high: { id: 'high', label: 'Alta prioridade', tone: 'rose' },
  medium: { id: 'medium', label: 'Prioridade media', tone: 'amber' },
  low: { id: 'low', label: 'Baixa prioridade', tone: 'slate' },
};

function priorityFromMetadata(value = '') {
  const priority = normalizeText(value).toLowerCase();
  if (['high', 'alta', 'urgente'].includes(priority)) return commercialPriorityConfig.high;
  if (['medium', 'media', 'média'].includes(priority)) return commercialPriorityConfig.medium;
  if (['low', 'baixa', 'fria'].includes(priority)) return commercialPriorityConfig.low;
  return null;
}

function isUrgentStage(value = '') {
  const stage = normalizeText(value).toLowerCase();
  return stage.includes('urgente') || stage.includes('demanda urgente');
}

function normalizePhoneForWhatsApp(value = '') {
  const digits = normalizeText(value).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('55')) return digits;
  return '55' + digits;
}

export function getClientCommercialPriority(client = {}) {
  const lead = latestResponse(client);
  const metadata = lead.metadata || {};
  const manualPriority = priorityFromMetadata(metadata.adminPriority);

  if (manualPriority) return manualPriority;

  const journey = client.journey || getClientJourney(client);

  if (journey.missing?.length) return commercialPriorityConfig.low;
  if (['proposal', 'presentation'].includes(journey.lane)) return commercialPriorityConfig.high;
  if (journey.lane === 'remarketing') return commercialPriorityConfig.low;
  if (isUrgentStage(metadata.projectStage) && !isColdBudget(metadata.budgetRange)) return commercialPriorityConfig.high;

  return commercialPriorityConfig.medium;
}

export function buildClientWhatsAppHandoffMessage(client = {}) {
  const lead = latestResponse(client);
  const metadata = lead.metadata || {};
  const journey = client.journey || getClientJourney(client);
  const projectName = getProjectName(client);

  return [
    'Oi! Vi seu briefing na VANT.Business e quero continuar por aqui.',
    '',
    'Projeto: ' + projectName,
    'Solucao: ' + (normalizeText(metadata.solutionType) || normalizeText(lead.product_title) || '-'),
    'Objetivo: ' + (normalizeText(metadata.mainGoal) || '-'),
    'Momento: ' + (normalizeText(metadata.projectStage) || '-'),
    'Investimento: ' + (normalizeText(metadata.budgetRange) || '-'),
    'Proxima acao VANT: ' + (journey.nextAction || '-'),
    '',
    'Resumo:',
    normalizeText(metadata.message) || '-',
  ].join('\n');
}

export function buildClientWhatsAppHandoffUrl(client = {}) {
  const phone = normalizePhoneForWhatsApp(client.whatsapp);
  const message = buildClientWhatsAppHandoffMessage(client);

  if (!phone) return '';

  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
}

export function buildClientProjectPipeline(clients = []) {
  return clientJourneyLanes.map((lane) => ({
    ...lane,
    clients: clients
      .filter((client) => client.journey?.lane === lane.id)
      .map((client) => ({
        ...client,
        projectName: getProjectName(client),
      })),
  }));
}
