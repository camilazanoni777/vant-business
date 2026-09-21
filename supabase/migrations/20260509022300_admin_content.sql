-- Rodar no SQL Editor do Supabase
create table if not exists subscribers (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  email text not null,
  whatsapp text,
  ebook text not null,
  product_title text,
  lead_type text not null default 'ebook',
  newsletter_opt_in boolean not null default false,
  source text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table subscribers add column if not exists whatsapp text;
alter table subscribers add column if not exists product_title text;
alter table subscribers add column if not exists lead_type text not null default 'ebook';
alter table subscribers add column if not exists newsletter_opt_in boolean not null default false;
alter table subscribers add column if not exists source text;
alter table subscribers add column if not exists metadata jsonb default '{}'::jsonb;
alter table subscribers add column if not exists updated_at timestamptz default now();
alter table subscribers drop constraint if exists subscribers_email_key;
drop index if exists subscribers_email_key;
create unique index if not exists subscribers_email_ebook_key on subscribers (email, ebook);
-- Indices para remarketing segmentado
create index if not exists subscribers_ebook_idx on subscribers (ebook);
create index if not exists subscribers_newsletter_idx on subscribers (newsletter_opt_in);
create index if not exists subscribers_lead_type_idx on subscribers (lead_type);
-- Habilita Row Level Security (segurança)
alter table subscribers enable row level security;
-- Apenas service_role pode inserir/ler (nossa API usa service key)
drop policy if exists "service only" on subscribers;
create policy "service only" on subscribers using (false) with check (false);
create table if not exists ai_agent_reviews (
  id uuid default gen_random_uuid() primary key,
  agent_name text not null,
  item_type text not null,
  item_id text not null,
  title text not null,
  status text not null default 'aguardando_avaliacao',
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists ai_agent_reviews_status_idx on ai_agent_reviews (status);
create index if not exists ai_agent_reviews_item_type_idx on ai_agent_reviews (item_type);
alter table ai_agent_reviews enable row level security;
drop policy if exists "service only" on ai_agent_reviews;
create policy "service only" on ai_agent_reviews using (false) with check (false);
create table if not exists analytics_events (
  id uuid default gen_random_uuid() primary key,
  event_type text not null default 'click',
  item_type text not null,
  item_id text not null,
  item_title text,
  target_url text,
  source text,
  path text,
  user_agent text,
  ip_hash text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists analytics_events_item_idx on analytics_events (item_type, item_id);
create index if not exists analytics_events_event_type_idx on analytics_events (event_type);
create index if not exists analytics_events_created_at_idx on analytics_events (created_at desc);
alter table analytics_events enable row level security;
drop policy if exists "service only" on analytics_events;
create policy "service only" on analytics_events using (false) with check (false);
create table if not exists ai_news_items (
  id text primary key,
  title text not null,
  title_pt text,
  link text not null,
  source text,
  category text,
  published_at timestamptz,
  summary text,
  summary_pt text,
  status text not null default 'aguardando_avaliacao',
  score integer default 0,
  rank integer,
  payload jsonb default '{}'::jsonb,
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists ai_news_items_status_idx on ai_news_items (status);
create index if not exists ai_news_items_published_at_idx on ai_news_items (published_at desc);
alter table ai_news_items enable row level security;
drop policy if exists "service only" on ai_news_items;
create policy "service only" on ai_news_items using (false) with check (false);
create table if not exists ai_content_drafts (
  id text primary key,
  draft_type text not null,
  source_id text not null,
  source_name text not null,
  title text not null,
  audience text,
  summary text,
  focus text,
  outline jsonb default '[]'::jsonb,
  status text not null default 'rascunho',
  payload jsonb default '{}'::jsonb,
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists ai_content_drafts_status_idx on ai_content_drafts (status);
create index if not exists ai_content_drafts_draft_type_idx on ai_content_drafts (draft_type);
alter table ai_content_drafts enable row level security;
drop policy if exists "service only" on ai_content_drafts;
create policy "service only" on ai_content_drafts using (false) with check (false);
