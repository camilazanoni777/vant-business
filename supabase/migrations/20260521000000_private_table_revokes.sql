-- Revoke legacy Data API access from anon/authenticated on private tables.
revoke all on public.subscribers from anon, authenticated;
grant select, insert, update, delete on public.subscribers to service_role;
revoke all on public.ai_agent_reviews from anon, authenticated;
grant select, insert, update, delete on public.ai_agent_reviews to service_role;
revoke all on public.analytics_events from anon, authenticated;
grant select, insert, update, delete on public.analytics_events to service_role;
revoke all on public.ai_news_items from anon, authenticated;
grant select, insert, update, delete on public.ai_news_items to service_role;
revoke all on public.ai_content_drafts from anon, authenticated;
grant select, insert, update, delete on public.ai_content_drafts to service_role;
revoke all on public.ai_tools from anon, authenticated;
grant select, insert, update, delete on public.ai_tools to service_role;
