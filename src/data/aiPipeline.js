export const affiliateTools = [
  {
    id: 'taskade',
    name: 'Taskade',
    category: 'Produtividade e agentes',
    url: 'https://www.taskade.com',
    affiliateUrl: 'https://www.taskade.com?referral=aG7421FwAqhNC5zL&utm_source=vant&utm_content=agent_pipeline',
    affiliateStatus: 'link_ativo',
    sourceUrl: 'https://www.taskade.com/blog/affiliate-partnership-program',
    description:
      'Workspace com agentes de IA, tarefas, automacoes e colaboracao em tempo real para transformar ideias em execucao.',
    relevantInfo: [
      'Programa de afiliados confirmado.',
      'Bom para videos demonstrando criacao de agentes e apps a partir de prompts.',
      'Ja existe link de indicacao configurado na base do site.',
    ],
    nextAgent: 'agente_roteiro_video',
    nextOutput: 'Roteiro curto para Reels/TikTok mostrando um agente de produtividade criado do zero.',
    status: 'aguardando_avaliacao',
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    category: 'Audio e voz',
    url: 'https://elevenlabs.io',
    affiliateUrl: 'https://elevenlabs.io/affiliates',
    affiliateStatus: 'programa_confirmado_link_pendente',
    sourceUrl: 'https://elevenlabs.io/affiliates',
    description:
      'Plataforma de voz com IA para narracoes, clonagem de voz, dublagem, efeitos sonoros e audio para videos.',
    relevantInfo: [
      'Programa de afiliados confirmado, mas precisa gerar o link proprio da VANT.',
      'Forte para conteudo em video: antes/depois de narracao, dublagem e criacao de voz.',
      'Depois de aprovado, entra na fila de roteiros com chamada para cadastro/afiliado.',
    ],
    nextAgent: 'agente_roteiro_video',
    nextOutput: 'Roteiro demonstrando como criar narracao profissional para um video em menos de 10 minutos.',
    status: 'aguardando_avaliacao',
  },
];

export const ebookTools = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'Assistente geral',
    url: 'https://chatgpt.com',
    affiliateStatus: 'sem_link_configurado',
    sourceUrl: 'https://openai.com/chatgpt/pricing',
    description:
      'Assistente de IA para pesquisa, escrita, analise de dados, imagens, tarefas, criacao de GPTs e automacoes.',
    relevantInfo: [
      'Excelente para ebook de prompts praticos para negocios locais.',
      'Pode alimentar materiais de vendas, atendimento e produtividade.',
    ],
    nextAgent: 'agente_ebook',
    nextOutput: 'Ebook: 25 prompts de ChatGPT para pequenos negocios venderem mais.',
    status: 'aguardando_avaliacao',
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'Analise e escrita',
    url: 'https://claude.ai',
    affiliateStatus: 'sem_link_configurado',
    sourceUrl: 'https://www.claude.com/pricing',
    description:
      'Assistente da Anthropic focado em escrita, analise de documentos, codigo, pesquisa e raciocinio com contexto longo.',
    relevantInfo: [
      'Bom para ebook de analise de documentos, contratos simples e planejamento.',
      'Pode virar guia para transformar arquivos longos em acoes praticas.',
    ],
    nextAgent: 'agente_ebook',
    nextOutput: 'Ebook: como usar Claude para analisar documentos e criar planos de acao.',
    status: 'aguardando_avaliacao',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    category: 'Pesquisa com fontes',
    url: 'https://www.perplexity.ai',
    affiliateStatus: 'sem_link_configurado',
    sourceUrl: 'https://www.perplexity.ai',
    description:
      'Buscador com IA para pesquisas rapidas, respostas com fontes e descoberta de informacoes recentes.',
    relevantInfo: [
      'Forte para ebook de pesquisa de mercado e validacao de ideias.',
      'Ajuda a montar pautas para videos e noticias com fontes verificaveis.',
    ],
    nextAgent: 'agente_ebook',
    nextOutput: 'Ebook: pesquisa de mercado com IA em 30 minutos usando Perplexity.',
    status: 'aguardando_avaliacao',
  },
  {
    id: 'n8n',
    name: 'n8n',
    category: 'Automacao',
    url: 'https://n8n.io',
    affiliateStatus: 'sem_link_configurado',
    sourceUrl: 'https://n8n.io/pricing/',
    description:
      'Plataforma de automacao visual para conectar apps, APIs e agentes de IA em fluxos de trabalho.',
    relevantInfo: [
      'Ideal para ebook tecnico de automacoes vendaveis.',
      'Conecta captura de leads, email, WhatsApp, CRM e ferramentas de IA.',
    ],
    nextAgent: 'agente_ebook',
    nextOutput: 'Ebook: 7 automacoes com n8n para captar leads e economizar horas por semana.',
    status: 'aguardando_avaliacao',
  },
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    category: 'Pesquisa e estudo',
    url: 'https://notebooklm.google.com',
    affiliateStatus: 'sem_link_configurado',
    sourceUrl: 'https://support.google.com/notebooklm/answer/16164461',
    description:
      'Assistente de pesquisa do Google que trabalha com fontes enviadas pelo usuario e gera resumos, guias e audio.',
    relevantInfo: [
      'Bom para ebook de estudo, pesquisa e criacao de conteudo a partir de fontes proprias.',
      'Pode gerar materiais de apoio para clientes e treinamentos internos.',
    ],
    nextAgent: 'agente_ebook',
    nextOutput: 'Ebook: como transformar PDFs, videos e links em um guia de estudo com NotebookLM.',
    status: 'aguardando_avaliacao',
  },
  {
    id: 'gamma',
    name: 'Gamma',
    category: 'Apresentacoes',
    url: 'https://gamma.app',
    affiliateStatus: 'sem_link_configurado',
    sourceUrl: 'https://gamma.app/pricing',
    description:
      'Ferramenta para criar apresentacoes, documentos e paginas com IA a partir de prompts.',
    relevantInfo: [
      'Ebook pode ensinar proposta comercial, pitch e aula visual.',
      'Bom para atrair vendedores, consultores e infoprodutores.',
    ],
    nextAgent: 'agente_ebook',
    nextOutput: 'Ebook: crie propostas e apresentacoes de venda com Gamma em uma tarde.',
    status: 'aguardando_avaliacao',
  },
  {
    id: 'suno',
    name: 'Suno',
    category: 'Musica com IA',
    url: 'https://suno.com',
    affiliateStatus: 'sem_link_configurado',
    sourceUrl: 'https://suno.com/pricing',
    description:
      'Gerador de musicas com IA para trilhas, jingles, ideias criativas e conteudo de marca.',
    relevantInfo: [
      'Bom para ebook criativo de jingles e trilhas para negocios locais.',
      'Exige cuidado com direitos de uso comercial em planos gratuitos.',
    ],
    nextAgent: 'agente_ebook',
    nextOutput: 'Ebook: como criar jingles e trilhas para marca usando Suno.',
    status: 'aguardando_avaliacao',
  },
  {
    id: 'runway',
    name: 'Runway',
    category: 'Video com IA',
    url: 'https://runwayml.com',
    affiliateStatus: 'sem_link_configurado',
    sourceUrl: 'https://runwayml.com/pricing/',
    description:
      'Suite criativa para geracao e edicao de video com IA, imagens, audio e efeitos visuais.',
    relevantInfo: [
      'Ebook pode focar em criacao de videos curtos para anuncios.',
      'Bom complemento para roteiros e demonstracoes futuras.',
    ],
    nextAgent: 'agente_ebook',
    nextOutput: 'Ebook: workflow basico para transformar uma ideia em video com Runway.',
    status: 'aguardando_avaliacao',
  },
];

export const agentBlueprints = [
  {
    id: 'pesquisa',
    name: 'Agente Descobridor de Ferramentas',
    role: 'finder',
    goal: 'Busca ferramentas de IA novas, remove duplicadas e entrega o lote bruto para o classificador.',
    output: 'Lista inicial de ferramentas candidatas com nome, link e contexto de uso.',
  },
  {
    id: 'afiliados',
    name: 'Subagente Classificador de Afiliados',
    role: 'classifier',
    goal: 'Separa cada ferramenta entre com programa de afiliados e sem programa de afiliados.',
    output: 'Fila organizada em duas rotas: roteiro de video ou ebook/captura.',
  },
  {
    id: 'ebook',
    name: 'Agente de Ebook',
    role: 'publisher',
    goal: 'Transforma as ferramentas sem afiliado em ebooks práticos e úteis.',
    output: 'Briefing de ebook com promessa, estrutura e CTA de captura.',
  },
  {
    id: 'roteiro',
    name: 'Agente de Roteiro',
    role: 'publisher',
    goal: 'Transforma as ferramentas com afiliado em roteiros de video com demonstracao e CTA.',
    output: 'Roteiro curto, com gancho, valor e chamada rastreavel.',
  },
  {
    id: 'noticias',
    name: 'Agente de Noticias',
    role: 'curator',
    goal: 'Traduz, resume e prepara as noticias aprovadas para o blog e o email.',
    output: 'Fila de noticias traduzidas com status pronto para avaliacao.',
  },
  {
    id: 'sincronizador',
    name: 'Agente Sincronizador',
    role: 'orchestrator',
    goal: 'Organiza o que foi gerado, aprovado e publicado em uma unica rotina.',
    output: 'Visao consolidada do que sobe no site e no email.',
  },
];

export const agentSchedule = [
  {
    day: 'Segunda',
    owner: 'Agente descobridor',
    cadence: '1 rodada leve',
    output: 'Encontra ferramentas de IA candidatas, remove duplicadas e passa o lote bruto para classificacao.',
  },
  {
    day: 'Terca',
    owner: 'Subagente classificador',
    cadence: '2 ferramentas',
    output: 'Separa as ferramentas por afiliado e sem afiliado para direcionar ebook ou roteiro.',
  },
  {
    day: 'Quarta',
    owner: 'Agente de roteiro',
    cadence: '1 ferramenta afiliada',
    output: 'Cria roteiro de video, gancho, CTA e checklist de demonstracao para afiliado.',
  },
  {
    day: 'Quinta',
    owner: 'Agente de noticias',
    cadence: '20 noticias',
    output: 'Busca noticias de IA, marca como aguardando avaliacao e prepara as 10 melhores para email.',
  },
  {
    day: 'Sexta',
    owner: 'Agente sincronizador',
    cadence: '1 consolidacao',
    output: 'Organiza o que foi aprovado, atualiza visualizacao no site e prepara proxima semana.',
  },
];

export const agentSummary = {
  totalTools: affiliateTools.length + ebookTools.length,
  affiliateQueue: affiliateTools.length,
  ebookQueue: ebookTools.length,
  reviewStatus: 'Tudo entra em triagem: descoberta -> classificacao -> ebook/roteiro -> avaliacao -> publicacao.',
};
