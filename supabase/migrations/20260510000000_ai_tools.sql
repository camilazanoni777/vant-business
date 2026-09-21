create table if not exists ai_tools (
  id text primary key,
  name text not null,
  slug text,
  logo_url text,
  emoji text,
  description text not null,
  link text not null,
  utm text,
  categoria text not null,
  badge text,
  gratis boolean not null default false,
  sort_order integer not null default 0,
  active boolean not null default true,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists ai_tools_active_idx on ai_tools (active);
create index if not exists ai_tools_sort_order_idx on ai_tools (sort_order);
create index if not exists ai_tools_categoria_idx on ai_tools (categoria);
alter table ai_tools enable row level security;
drop policy if exists "service only" on ai_tools;
create policy "service only" on ai_tools using (false) with check (false);
insert into ai_tools (
  id, name, slug, logo_url, emoji, description, link, utm, categoria, badge, gratis, sort_order, active, metadata
) values
  ('taskade', 'Taskade', 'taskade', 'https://logo.clearbit.com/taskade.com', '🤖', 'Gestão de projetos com IA nativa. Gera tarefas, resume reuniões e automatiza fluxos de trabalho.', 'https://www.taskade.com?referral=aG7421FwAqhNC5zL', '&utm_source=vant&utm_content=recursos', 'Produtividade', 'Que uso', true, 1, true, '{}'::jsonb),
  ('adcreative', 'AdCreative AI', 'adcreative', 'https://logo.clearbit.com/adcreative.ai', '🎨', 'Cria criativos para anúncios com IA. Gera dezenas de variações otimizadas para conversão.', 'https://www.adcreative.ai', '?utm_source=vant&utm_content=recursos', 'Marketing', 'Afiliado', false, 2, true, '{}'::jsonb),
  ('aistudios', 'AI Studios', 'aistudios', 'https://logo.clearbit.com/deepbrain.io', '🎬', 'Cria vídeos com avatares de IA. Ideal para conteúdo em escala sem precisar gravar.', 'https://www.deepbrain.io', '?utm_source=vant&utm_content=recursos', 'Vídeo', 'Afiliado', false, 3, true, '{}'::jsonb),
  ('claude', 'Claude (Anthropic)', 'claude', 'https://logo.clearbit.com/anthropic.com', '🧠', 'IA da Anthropic para análise, código, escrita e raciocínio complexo. Melhor para contextos longos.', 'https://claude.ai', '?utm_source=vant&utm_content=recursos', 'IA', 'Que uso', true, 4, true, '{}'::jsonb),
  ('chatgpt', 'ChatGPT', 'chatgpt', 'https://logo.clearbit.com/openai.com', '💬', 'O mais popular. Ótimo para geração de texto, brainstorm e automações com GPT-4.', 'https://chat.openai.com', '?utm_source=vant&utm_content=recursos', 'IA', null, true, 5, true, '{}'::jsonb),
  ('n8n', 'n8n', 'n8n', 'https://logo.clearbit.com/n8n.io', '⚡', 'Automação de fluxos open source. Conecta centenas de apps sem código. Self-hosted ou cloud.', 'https://n8n.io', '?utm_source=vant&utm_content=recursos', 'Automação', 'Que uso', true, 6, true, '{}'::jsonb),
  ('make', 'Make (Integromat)', 'make', 'https://logo.clearbit.com/make.com', '🔗', 'Automatize fluxos entre apps com interface visual. Alternativa ao Zapier com mais poder.', 'https://www.make.com', '?utm_source=vant&utm_content=recursos', 'Automação', null, true, 7, true, '{}'::jsonb),
  ('perplexity', 'Perplexity AI', 'perplexity', 'https://logo.clearbit.com/perplexity.ai', '🔍', 'Buscador com IA que cita as fontes. Melhor que o Google para pesquisas técnicas e de mercado.', 'https://www.perplexity.ai', '?utm_source=vant&utm_content=recursos', 'IA', 'Que uso', true, 8, true, '{}'::jsonb),
  ('midjourney', 'Midjourney', 'midjourney', 'https://logo.clearbit.com/midjourney.com', '🖼️', 'Geração de imagens com IA de alta qualidade. Ideal para criação de conteúdo visual.', 'https://www.midjourney.com', '?utm_source=vant&utm_content=recursos', 'IA', null, false, 9, true, '{}'::jsonb),
  ('notion-ai', 'Notion AI', 'notion-ai', 'https://logo.clearbit.com/notion.so', '📝', 'Workspace com IA integrada. Resume, gera e reescreve dentro do seu workspace.', 'https://www.notion.so', '?utm_source=vant&utm_content=recursos', 'Produtividade', null, true, 10, true, '{}'::jsonb),
  ('runway', 'Runway ML', 'runway', 'https://logo.clearbit.com/runwayml.com', '🎥', 'Edição e geração de vídeos com IA. Text-to-video, remoção de fundo, efeitos cinematográficos.', 'https://runwayml.com', '?utm_source=vant&utm_content=recursos', 'Vídeo', null, false, 11, true, '{}'::jsonb),
  ('eleven-labs', 'ElevenLabs', 'eleven-labs', 'https://logo.clearbit.com/elevenlabs.io', '🎙️', 'Clonagem e síntese de voz com IA. Cria narrações realistas para vídeos e podcasts.', 'https://elevenlabs.io', '?utm_source=vant&utm_content=recursos', 'Vídeo', null, true, 12, true, '{}'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  logo_url = excluded.logo_url,
  emoji = excluded.emoji,
  description = excluded.description,
  link = excluded.link,
  utm = excluded.utm,
  categoria = excluded.categoria,
  badge = excluded.badge,
  gratis = excluded.gratis,
  sort_order = excluded.sort_order,
  active = excluded.active,
  metadata = excluded.metadata,
  updated_at = now();
