create table if not exists newsletter_issues (
  id text primary key,
  subject text not null,
  intro text,
  issue_type text not null default 'curadoria',
  status text not null default 'rascunho',
  scheduled_at timestamptz,
  sent_at timestamptz,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists newsletter_issues_status_idx on newsletter_issues (status);
create index if not exists newsletter_issues_scheduled_at_idx on newsletter_issues (scheduled_at asc);

alter table newsletter_issues enable row level security;
drop policy if exists "service only" on newsletter_issues;
create policy "service only" on newsletter_issues using (false) with check (false);

grant select, insert, update, delete on public.newsletter_issues to service_role;
revoke all on public.newsletter_issues from anon, authenticated;

create table if not exists newsletter_issue_items (
  id uuid default gen_random_uuid() primary key,
  issue_id text not null references newsletter_issues(id) on delete cascade,
  item_type text not null default 'news',
  item_id text not null,
  position integer not null default 1,
  title text not null,
  link text not null,
  source text,
  summary text,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists newsletter_issue_items_issue_idx on newsletter_issue_items (issue_id, position);

alter table newsletter_issue_items enable row level security;
drop policy if exists "service only" on newsletter_issue_items;
create policy "service only" on newsletter_issue_items using (false) with check (false);

grant select, insert, update, delete on public.newsletter_issue_items to service_role;
revoke all on public.newsletter_issue_items from anon, authenticated;
