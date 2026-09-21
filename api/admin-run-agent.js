import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { isAdminRequest } from './_adminAuth.js';
import { getSupabaseAdmin } from './_supabaseAdmin.js';
import { affiliateTools, ebookTools } from '../src/data/aiPipeline.js';
import { agentWorkflow } from './admin-data.js';

function getAgentIndex(agentId) {
  return agentWorkflow.findIndex((agent) => agent.id === agentId);
}

async function getCompletedAgentIds(supabase) {
  if (!supabase) return new Set();

  const { data } = await supabase
    .from('ai_agent_reviews')
    .select('item_id')
    .eq('item_type', 'agent_response')
    .order('created_at', { ascending: true });

  return new Set((data || []).map((row) => row.item_id));
}

async function readNews() {
  try {
    const file = await readFile(path.resolve(process.cwd(), 'public/data/ai-news.json'), 'utf8');
    return JSON.parse(file);
  } catch {
    return { items: [] };
  }
}

async function buildResponse(agentId) {
  const allTools = [...affiliateTools, ...ebookTools];

  if (agentId === 'pesquisa') {
    return {
      title: 'Ferramentas descobertas',
      summary: `Foram encontrados ${allTools.length} itens candidatos para IA, antes da classificacao.`,
      nextStep: 'Ativar o separador para marcar tem afiliado ou nao tem afiliado.',
      items: allTools.map((tool) => ({ id: tool.id, name: tool.name, status: tool.status })),
    };
  }

  if (agentId === 'afiliados') {
    return {
      title: 'Ferramentas classificadas',
      summary: 'Taskade e ElevenLabs ficaram na rota de afiliados; as demais seguem para ebook.',
      nextStep: 'Revisar a separacao antes de enviar cada grupo para sua rota de conteudo.',
      items: affiliateTools.map((tool) => ({
        id: tool.id,
        name: tool.name,
        affiliateStatus: tool.affiliateStatus,
        sourceUrl: tool.sourceUrl,
      })),
    };
  }

  if (agentId === 'ebook') {
    return {
      title: 'Fila de ebooks preparada',
      summary: `${ebookTools.length} ferramentas ficaram para ebook porque ainda nao possuem link de afiliado configurado na VANT.`,
      nextStep: 'Escolher a primeira ferramenta para virar ebook completo e landing de captura.',
      items: ebookTools.map((tool) => ({
        id: tool.id,
        name: tool.name,
        ebookIdea: tool.nextOutput,
      })),
    };
  }

  if (agentId === 'roteiro') {
    return {
      title: 'Roteiros pendentes de aprovacao',
      summary: 'A fila de roteiro deve comecar por Taskade, porque o link ja esta ativo. ElevenLabs fica aguardando o link proprio.',
      nextStep: 'Depois da aprovacao, gerar roteiro final com hook, demo e CTA rastreavel.',
      items: affiliateTools.map((tool) => ({
        id: tool.id,
        name: tool.name,
        scriptDirection: tool.nextOutput,
      })),
    };
  }

  if (agentId === 'noticias') {
    const news = await readNews();
    const pending = (news.items || []).filter((item) => item.status === 'aguardando_avaliacao');
    const approved = (news.items || []).filter((item) => item.status === 'aprovada' || item.status === 'approved');

    return {
      title: 'Noticias prontas para revisao',
      summary: `${pending.length} noticias aguardam avaliacao e ${approved.length} estao aprovadas para newsletter.`,
      nextStep: 'Aprovar manualmente as melhores noticias antes de disparar o email diario.',
      items: (news.items || []).slice(0, 10).map((item) => ({
        id: item.id,
        title: item.titlePt || item.title,
        source: item.source,
        status: item.status,
      })),
    };
  }

  if (agentId === 'sincronizador') {
    return {
      title: 'Sincronizacao final do ciclo',
      summary:
        'Fluxo correto: pesquisa -> afiliados -> ebook -> roteiro -> noticias -> sincronizador. Nada deve ir ao publico sem avaliacao.',
      nextStep: 'Usar cliques e leads capturados para decidir quais ferramentas viram ebook, video ou pagina dedicada.',
      items: [
        { id: 'admin', title: 'Fila e cliques centralizados no painel administrativo.' },
        { id: 'public', title: 'Usuario ve apenas ferramentas, ebooks e noticias publicas.' },
      ],
    };
  }

  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const agentId = String(req.body?.agentId || '').trim();
  const agent = agentWorkflow.find((item) => item.id === agentId);
  const agentIndex = getAgentIndex(agentId);

  if (!agent || agentIndex === -1) {
    return res.status(400).json({ error: 'Agente invalido' });
  }

  try {
    const supabase = getSupabaseAdmin();
    const completed = await getCompletedAgentIds(supabase);
    const firstIncompleteIndex = agentWorkflow.findIndex((item) => !completed.has(item.id));
    const allowedIndex = firstIncompleteIndex === -1 ? agentWorkflow.length - 1 : firstIncompleteIndex;

    if (!completed.has(agentId) && agentIndex > allowedIndex) {
      return res.status(409).json({
        error: 'Fluxo sincronizado: execute o agente anterior antes deste.',
        nextAgent: agentWorkflow[allowedIndex]?.id,
      });
    }

    const response = await buildResponse(agentId);
    const now = new Date().toISOString();
    const payload = {
      agentId,
      agentName: agent.name,
      goal: agent.goal,
      ...response,
      generatedAt: now,
    };

    let stored = false;
    if (supabase) {
      const { error } = await supabase.from('ai_agent_reviews').insert({
        agent_name: agent.name,
        item_type: 'agent_response',
        item_id: agentId,
        title: response.title,
        status: 'aguardando_avaliacao',
        payload,
        created_at: now,
        updated_at: now,
      });

      if (error) throw error;
      stored = true;
    }

    return res.status(200).json({ ok: true, stored, response: payload });
  } catch (error) {
    console.error('Admin run agent error:', error);
    return res.status(500).json({ error: 'Falha ao executar agente' });
  }
}
