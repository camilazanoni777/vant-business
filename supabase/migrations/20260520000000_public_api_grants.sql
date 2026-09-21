-- Explicit Data API grants for public tables used by the application.
grant select, insert, update, delete on public.subscribers to service_role;
grant select, insert, update, delete on public.ai_agent_reviews to service_role;
grant select, insert, update, delete on public.analytics_events to service_role;
grant select, insert, update, delete on public.ai_news_items to service_role;
grant select, insert, update, delete on public.ai_content_drafts to service_role;
grant select, insert, update, delete on public.ai_tools to service_role;
