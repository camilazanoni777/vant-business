# Architecture - Vant.Business

Este arquivo deve registrar decisoes de arquitetura aprovadas.

Use `docs/ai-notes.md` para rascunhos e analises preliminares. Mova para este
arquivo apenas quando Victor aprovar.

## Estado atual resumido

- Frontend: React com Vite.
- Estilo: Tailwind CSS.
- Rotas: React Router.
- Backend leve: Vercel Serverless Functions em `api/`.
- Dados e operacao: Supabase.
- Conteudo: Markdown em `src/posts` e dados locais em `src/data`.
- Agente local de noticias: `scripts/news-agent.mjs`.

## Decisoes pendentes

- Definir padrao final para dados de ferramentas, afiliados e noticias.
- Definir quando um fluxo deve ficar em Vercel Function, Supabase ou script local.
- Definir como o painel admin deve registrar aprovacoes editoriais.
