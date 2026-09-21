export function getAdminWorkspaceSummary(data = {}) {
  const clicks = data.clicks || [];
  const subscribers = data.subscribers || [];
  const newsItems = data.newsItems || [];
  const agentWorkflow = data.agentWorkflow || [];
  const agentResponses = data.agentResponses || [];
  const publicTools = data.publicTools || [];
  const pipelineTools = data.pipelineTools || [];
  const contentDrafts = data.contentDrafts || [];

  const pendingNews = newsItems.filter((item) => item.status === 'aguardando_avaliacao').length;
  const approvedNews = newsItems.filter((item) => item.status === 'aprovada' || item.status === 'approved').length;
  const draftReviewNeeded = contentDrafts.filter((item) => item.status === 'rascunho' || item.status === 'em revisao').length;
  const draftReady = contentDrafts.filter((item) => item.status === 'pronto para postar').length;
  const publicToolIds = new Set(publicTools.map((tool) => tool.id || tool.slug || tool.name).filter(Boolean));
  const toolGaps = pipelineTools.filter((tool) => {
    const id = tool.id || tool.slug || tool.name;
    return id && !publicToolIds.has(id);
  }).length;
  const completedAgents = agentWorkflow.filter((agent) =>
    agentResponses.some((response) => response.item_id === agent.id || response.agentId === agent.id || response.payload?.agentId === agent.id)
  ).length;
  const nextAgent = agentWorkflow.find((agent) =>
    !agentResponses.some((response) => response.item_id === agent.id || response.agentId === agent.id || response.payload?.agentId === agent.id)
  );

  const metrics = {
    clicks: clicks.length,
    leads: subscribers.length,
    pendingNews,
    approvedNews,
    completedAgents,
    totalAgents: agentWorkflow.length,
    publicTools: publicTools.length,
    candidateTools: pipelineTools.length,
  };

  const queues = {
    aiInbox: agentResponses.length + pendingNews + pipelineTools.length,
    reviewNeeded: pendingNews + draftReviewNeeded,
    readyToPublish: approvedNews + draftReady,
    contentDrafts: contentDrafts.length,
    toolGaps,
  };

  const codexFillables = [
    {
      id: 'tools',
      label: 'Ferramentas',
      workspace: 'tools',
      input: 'nicho, objetivo e criterio de afiliado',
      output: 'catalogo, rota de ebook, roteiro e proximos passos',
    },
    {
      id: 'news',
      label: 'Noticias',
      workspace: 'publish',
      input: 'fontes ou tema da semana',
      output: 'noticias em portugues aguardando aprovacao',
    },
    {
      id: 'content',
      label: 'Conteudos',
      workspace: 'publish',
      input: 'ferramenta, publico e formato',
      output: 'rascunhos de ebook, roteiro, demo ou SEO',
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      workspace: 'publish',
      input: 'itens aprovados e chamada principal',
      output: 'edicao pronta para revisao antes do envio',
    },
  ];

  const operatingSteps = [
    {
      id: 'ask',
      label: 'Pedir preenchimento',
      workspace: 'today',
      detail: 'No chat, peça para eu preencher ferramentas, noticias, rascunhos ou newsletter.',
    },
    {
      id: 'review',
      label: 'Revisar fila',
      workspace: 'research',
      detail: 'Confira pesquisas, duplicidades, fontes e rotas antes de aprovar.',
    },
    {
      id: 'approve',
      label: 'Aprovar publicacao',
      workspace: 'publish',
      detail: 'Apenas itens aprovados entram no blog, email, catalogo ou campanha.',
    },
    {
      id: 'measure',
      label: 'Medir resultado',
      workspace: 'results',
      detail: 'Use leads e cliques para decidir o proximo lote de trabalho.',
    },
  ];

  let nextAction = {
    workspace: 'research',
    label: nextAgent ? 'Executar proximo agente' : 'Revisar resultados',
    detail: nextAgent ? `${nextAgent.name || nextAgent.id} ainda precisa rodar.` : 'Use os sinais para decidir a proxima publicacao.',
    cta: nextAgent ? 'Abrir pesquisas' : 'Abrir resultados',
  };

  if (pendingNews > 0) {
    nextAction = {
      workspace: 'publish',
      label: 'Revisar noticias pendentes',
      detail: `${pendingNews} noticia${pendingNews === 1 ? '' : 's'} aguardando aprovacao antes de ir para blog e email.`,
      cta: 'Abrir publicacao',
    };
  } else if (pipelineTools.length > publicTools.length) {
    nextAction = {
      workspace: 'tools',
      label: 'Organizar ferramentas',
      detail: `${pipelineTools.length} candidatas no fluxo e ${publicTools.length} publicas no catalogo.`,
      cta: 'Abrir ferramentas',
    };
  }

  return {
    metrics,
    queues,
    codexFillables,
    operatingSteps,
    nextAction,
    workspaces: [
      {
        id: 'today',
        label: 'Hoje',
        description: 'Proxima acao e saude do fluxo.',
        badge: nextAction.cta,
      },
      {
        id: 'research',
        label: 'Pesquisas',
        description: 'Agentes, descobertas e validacao inicial.',
        badge: `${completedAgents}/${agentWorkflow.length || 0}`,
      },
      {
        id: 'publish',
        label: 'Publicacao',
        description: 'Noticias, ebooks e roteiros prontos para aprovacao.',
        badge: pendingNews > 0 ? `${pendingNews} pendente${pendingNews === 1 ? '' : 's'}` : 'limpo',
      },
      {
        id: 'tools',
        label: 'Ferramentas',
        description: 'Catalogo publico, afiliados e rotas de conteudo.',
        badge: `${publicTools.length} publica${publicTools.length === 1 ? '' : 's'}`,
      },
      {
        id: 'results',
        label: 'Resultados',
        description: 'Leads, cliques e sinais para decidir prioridade.',
        badge: `${clicks.length}`,
      },
    ],
  };
}
