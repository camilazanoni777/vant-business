import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { isAdminRequest } from './_adminAuth.js';
import { getSupabaseAdmin } from './_supabaseAdmin.js';
import { getNewsItems } from './_newsStore.js';
import { getToolItems } from './_toolsStore.js';
import { getNewsletterIssues } from './_newsletterStore.js';
import { affiliateTools, agentSchedule, ebookTools } from '../src/data/aiPipeline.js';

export const agentWorkflow = [
  {
    id: 'pesquisa',
    name: 'Pesquisador',
    goal: 'Encontra ferramentas de IA novas, remove duplicadas e entrega o lote bruto para triagem.',
  },
  {
    id: 'afiliados',
    name: 'Separador',
    goal: 'Marca cada ferramenta com etiqueta de tem programa de afiliados ou nao tem programa de afiliados.',
  },
  {
    id: 'ebook',
    name: 'Agente de Ebook',
    goal: 'Transforma ferramentas sem link configurado em ideias de ebook para captura.',
  },
  {
    id: 'roteiro',
    name: 'Agente de Roteiro',
    goal: 'Gera roteiro apenas para ferramentas com potencial de afiliado.',
  },
  {
    id: 'noticias',
    name: 'Agente de Noticias',
    goal: 'Mostra as noticias coletadas e o que esta aguardando aprovacao.',
  },
  {
    id: 'sincronizador',
    name: 'Agente Sincronizador',
    goal: 'Consolida respostas, cliques e proximas acoes antes da publicacao.',
  },
];

async function loadSeedAgentResponses() {
  try {
    const file = await readFile(path.resolve(process.cwd(), 'public/data/admin-agent-seed.json'), 'utf8');
    return JSON.parse(file);
  } catch {
    return [];
  }
}

async function fetchAdminRows(req) {
  const supabase = getSupabaseAdmin();
  const news = await getNewsItems(req);
  const tools = await getToolItems();
  const seedResponses = await loadSeedAgentResponses();
  const newsletterResult = await getNewsletterIssues();

  if (!supabase) {
    return {
      clicks: [],
      agentResponses: seedResponses,
      newsItems: news.items,
      tools: tools.items,
      newsletterIssues: newsletterResult.issues || [],
      warnings: ['Supabase ainda nao configurado no ambiente.', ...(tools.warnings || [])],
    };
  }

  const [clicksResult, subscribersResult, responsesResult] = await Promise.all([
    supabase
      .from('analytics_events')
      .select('id,event_type,item_type,item_id,item_title,target_url,source,path,created_at')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('subscribers')
      .select('id,nome,email,whatsapp,ebook,product_title,lead_type,newsletter_opt_in,source,metadata,created_at')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
    .from('ai_agent_reviews')
    .select('id,agent_name,item_id,title,status,payload,created_at,updated_at')
    .eq('item_type', 'agent_response')
    .order('created_at', { ascending: false })
    .limit(100),
  ]);

  const agentResponses = (responsesResult.data || []).length > 0 ? responsesResult.data : seedResponses;

  return {
    clicks: clicksResult.data || [],
    subscribers: subscribersResult.data || [],
    agentResponses,
    newsItems: news.items,
    tools: tools.items,
    newsletterIssues: newsletterResult.issues || [],
    warnings: [
      clicksResult.error?.message,
      subscribersResult.error?.message,
      responsesResult.error?.message,
      ...(news.warnings || []),
      ...(tools.warnings || []),
    ].filter(Boolean),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const rows = await fetchAdminRows(req);
    return res.status(200).json({
      ok: true,
      pipeline: {
        affiliateTools,
        ebookTools,
        agentSchedule,
      },
      agentWorkflow,
      ...rows,
    });
  } catch (error) {
    console.error('Admin data error:', error);
    return res.status(500).json({ error: 'Falha ao carregar area administrativa' });
  }
}
