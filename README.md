# VANT.Business

Site oficial da **VANT.Business**. A VANT v2 posiciona o projeto como uma operacao comercial para solucoes digitais: presenca, captacao, atendimento, follow-up, automacao, IA aplicada e crescimento operacional.

O site existe para transformar visitantes em briefings comerciais qualificados. Conteudos, noticias, ferramentas, ebooks e agentes continuam documentados como suporte, prova de repertorio ou operacao interna, mas nao sao a promessa principal da marca.

## Proposta oficial do site

A **VANT.Business** ajuda empresas a estruturar presenca digital, captacao, atendimento e automacao para transformar interesse em processo comercial organizado.

Promessa operacional:

```txt
diagnostico, estrategia, implementacao e organizacao comercial para crescer com presenca digital, IA e automacao.
```

### Posicionamento v2

A VANT vende estrutura e execucao, nao apenas ideias soltas ou acesso a ferramentas. O foco publico do site e conduzir o visitante para um diagnostico claro e acionavel.

A operacao deve priorizar:

- diagnosticar onde a empresa perde oportunidades;
- organizar presenca, captacao, atendimento, follow-up e conversao;
- implementar solucoes digitais, automacoes, IA aplicada e integracoes;
- capturar briefings comerciais com contexto suficiente para follow-up;
- dar ao admin um caminho rapido para priorizar, responder e gerar proposta.

### Publico-alvo

- Empresas pequenas e negocios locais que precisam parecer mais fortes no digital.
- Empreendedores que recebem interesse, mas perdem leads por falta de estrutura.
- Operacoes que querem organizar atendimento, follow-up, captacao e conversao.
- Projetos que precisam de site, presenca, automacao, IA aplicada ou integracoes.
- Clientes que querem direcao antes de comprar uma ferramenta ou contratar trafego.

### Pilares da marca

- **Diagnostico**: entender o gargalo real antes da entrega.
- **Presenca**: organizar a vitrine digital para gerar confianca.
- **Captacao**: transformar canais em entradas comerciais rastreaveis.
- **Atendimento**: reduzir perda de contexto entre interesse e resposta.
- **Automacao**: conectar tarefas, dados, IA e follow-up com criterio.
- **Crescimento**: priorizar resultado operacional, nao volume de recursos.

### Experiencia esperada

Quem entra no site deve conseguir:

- entender rapidamente o que a VANT resolve;
- acessar as areas de solucao;
- pedir um diagnostico comercial;
- entrar em contato com contexto suficiente para continuidade no admin e WhatsApp.

## Status do projeto

- Producao: <https://vant.business>
- Repositorio: <https://github.com/victor-hugos/vant-business>
- Projeto principal na Vercel: `vant-business`
- Stack principal: React, Vite, Tailwind CSS, Vercel Serverless Functions, Supabase e SMTP
- Identidade visual atual: tema escuro premium e ativos em `public/assets/brand/`
- Blueprint operacional: `docs/vant-v2-blueprint.md`

## O que o site entrega

- Home com posicionamento comercial direto.
- Pagina `/solucoes` com areas de solucao e estrutura da VANT.
- Pagina `/diagnostico` com formulario comercial e lead source `diagnosis-page`.
- A tela de cases esta preservada em `draft/vant-cases-page` e nao entra nesta publicacao.
- Redirecionamentos de compatibilidade para URLs antigas.
- Captura de leads via `api/subscribe.js`, com historico para briefings comerciais.
- Area administrativa privada em `/admin-vant` para leads, conteudo, ferramentas e operacao interna.
- Handoff para WhatsApp a partir dos dados do briefing.
- Base interna preservada para noticias, ferramentas e agentes quando apoiarem a operacao comercial.

## Rotas principais

| Rota | Funcao |
| --- | --- |
| `/` | Pagina inicial da VANT.Business |
| `/solucoes` | Areas de solucao e estrutura comercial da VANT |
| `/diagnostico` | Entrada comercial principal e formulario de diagnostico |
| `/admin-vant` | Painel administrativo privado |

## Rotas de compatibilidade

| Rota antiga | Comportamento atual |
| --- | --- |
| `/solucoes-digitais` | Redireciona para `/diagnostico` |
| `/automatize` | Redireciona para `/diagnostico` |
| `/conversao` | Redireciona para `/solucoes` |
| `/recursos` | Redireciona para `/solucoes` |

Mantenha esses redirects enquanto links externos, posts, bios ou materiais antigos ainda puderem apontar para essas URLs.

## Modulos internos preservados

- `src/data/recursos.js`: catalogo estatico usado como fallback/admin, nao como promessa publica principal.
- `api/newsletter-digest.js`, `api/news.js`, `api/out.js` e agentes: suporte operacional/editorial interno enquanto fizerem sentido para o admin ou campanhas.
- Blog publico, rota de ebook, componentes de portfolio/recrutador e newsletter visual foram movidos para a branch de arquivo `archive/pre-vant-v2-cleanup-2026-07-09`.

## Tecnologias

- **React**: interface, componentes e rotas.
- **React Router**: navegacao entre paginas publicas e painel admin.
- **Vite**: desenvolvimento local e build de producao.
- **Tailwind CSS**: base visual, responsividade e utilitarios.
- **Supabase**: armazenamento de leads, noticias, rascunhos e eventos.
- **Vercel Functions**: APIs serverless em `api/`.
- **Resend/Nodemailer**: envio de emails transacionais e notificacoes.

## Estrutura

```txt
vant-business/
├── api/
│   ├── subscribe.js
│   ├── newsletter-digest.js
│   ├── admin-*.js
│   └── track-click.js
├── docs/
│   ├── ai-notes.md
│   ├── deploy-checklist.md
│   ├── maintenance.md
│   ├── supabase-setup.sql
│   └── vant-v2-blueprint.md
├── public/
│   ├── assets/
│   │   └── brand/
│   └── data/
├── scripts/
│   └── news-agent.mjs
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/
│   └── migrations/
├── tests/
├── index.html
├── package.json
├── tailwind.config.js
└── README.md
```

## Como rodar localmente

1. Instale as dependencias:

```bash
npm install
```

2. Rode o servidor local:

```bash
npm run dev
```

3. Acesse:

```txt
http://localhost:5173
```

Se a porta `5173` estiver ocupada, o Vite pode abrir em outra porta, como `5174`.

## Scripts disponiveis

```bash
npm run dev
npm test
npm run build
npm run preview
npm run agent:news
npm run check:tool-logos
```

- `npm run dev`: abre o frontend local com Vite.
- `npm test`: roda a suite de testes em `tests/*.test.js`.
- `npm run build`: gera a versao de producao em `dist/`.
- `npm run preview`: testa localmente o build gerado.
- `npm run agent:news`: executa o agente local de curadoria de noticias.
- `npm run check:tool-logos`: valida logos do catalogo preservado de ferramentas.

## Guia de orientacao do site

### Fontes da verdade

| Tema | Fonte |
| --- | --- |
| Rotas ativas | `src/App.jsx` |
| Posicionamento v2 | `docs/vant-v2-blueprint.md` e este README |
| Home | `src/pages/HomePage.jsx` |
| Solucoes | `src/pages/RecursosPage.jsx` |
| Diagnostico | `src/pages/AutomatizePage.jsx` |
| Navegacao | `src/components/Header.jsx` e `src/components/Footer.jsx` |
| Lead capture | `api/subscribe.js` |
| WhatsApp handoff | `src/utils/briefingWhatsApp.js` e `src/utils/adminLeads.js` |
| Admin ativo | `src/pages/AdminPublishingPage.jsx` |
| Estilos globais | `src/index.css` |

### Ajustes comuns

| Quero ajustar... | Arquivo principal | Verificacao minima |
| --- | --- | --- |
| Promessa da home | `src/pages/HomePage.jsx` | `npm run build` |
| Menu e CTA | `src/components/Header.jsx` | `npm test` |
| Rodape | `src/components/Footer.jsx` | `npm test` |
| Rotas ou redirects | `src/App.jsx` | `node --test tests/v2-route-contract.test.js` |
| Formulario de diagnostico | `src/pages/AutomatizePage.jsx` | `node --test tests/subscribe.test.js tests/editorial-pages-copy.test.js` |
| Payload/API de lead | `api/subscribe.js` | `node --test tests/subscribe.test.js` |
| Prioridade/handoff no admin | `src/utils/adminLeads.js` e `src/pages/AdminPublishingPage.jsx` | `node --test tests/admin-leads.test.js` |
| Cores, cards e responsividade | `src/index.css` | `npm run build` e revisao visual |
| Logos e marca | `public/assets/brand/` e `src/components/VantLogo.jsx` | `npm test` e revisao visual |
| Banco de dados | `docs/supabase-setup.sql` e `supabase/migrations/` | conferir producao antes de depender de coluna nova |

## Fluxo comercial v2

```txt
visitante -> posicionamento -> solucoes/diagnostico -> briefing -> lead -> admin -> WhatsApp/follow-up -> proposta
```

O formulario de diagnostico envia leads de tipo `service`, com `ebook` padrao `diagnostico-vant`, `source` `diagnosis-page` e metadados comerciais como gargalo principal, estagio, objetivo e orcamento.

## Admin privado

A rota ativa do admin e `/admin-vant`, implementada por `src/pages/AdminPublishingPage.jsx`.

O admin deve ajudar Victor a responder rapidamente:

- quem entrou em contato;
- qual gargalo principal foi informado;
- qual prioridade comercial o lead tem;
- qual status o lead esta;
- qual mensagem pode continuar a conversa no WhatsApp.

Em localhost, parte do admin pode usar fallback local para rascunhos e pre-visualizacao. Em producao, as acoes dependem das APIs em `api/` e das variaveis configuradas na Vercel.

## Variaveis de ambiente

As variaveis abaixo devem ficar na Vercel ou em um `.env` local nao versionado.

| Variavel | Uso |
| --- | --- |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_KEY` | Chave server-side para APIs e admin |
| `RESEND_API_KEY` | Chave da API Resend para envio de emails |
| `EMAIL_FROM` | Remetente verificado |
| `LEAD_NOTIFY_EMAIL` | Email que recebe notificacoes internas de novos leads |
| `ADMIN_EMAIL` | Email autorizado no painel admin |
| `ADMIN_PASSWORD` | Senha do painel admin |
| `ADMIN_ACCESS_CODE` | Alternativa para senha admin |
| `ADMIN_SESSION_SECRET` | Segredo para assinar sessao admin |
| `CRON_SECRET` | Segredo para rotas agendadas |
| `VITE_VANT_WHATSAPP_NUMBER` | Numero da VANT em formato internacional para abrir briefing no WhatsApp |
| `NEWS_AGENT_LIMIT` | Limite opcional de itens no agente de noticias |

Nao versionar `.env`, tokens, senhas SMTP, service keys ou credenciais.

## APIs serverless

| Arquivo | Funcao |
| --- | --- |
| `api/subscribe.js` | Captura lead, salva no Supabase e envia email |
| `api/admin-leads.js` | Atualiza status, notas e prioridade de leads |
| `api/admin-login.js` | Login da area administrativa |
| `api/admin-data.js` | Dados do painel administrativo |
| `api/admin-run-agent.js` | Execucao logica dos agentes internos |
| `api/admin-content-drafts.js` | Rascunhos de conteudo |
| `api/admin-news-update.js` | Atualizacao de status das noticias/newsletter |
| `api/newsletter-digest.js` | Envia digest de newsletter, quando esse fluxo estiver ativo |
| `api/news.js` | Entrega itens de noticia, quando esse fluxo estiver ativo |
| `api/out.js` | Redireciona links externos com rastreamento |
| `api/track-click.js` | Registra eventos de clique |

## Conteudo, ferramentas e newsletter

Esses modulos continuam no codigo porque podem apoiar repertorio, admin, conteudo futuro, afiliados ou campanhas. A regra v2 e simples: eles nao devem tomar o lugar do diagnostico comercial como CTA principal.

Antes de reativar qualquer modulo publico de conteudo, conferir:

- se a rota esta registrada em `src/App.jsx`;
- se a pagina reforca a VANT como implementadora de solucoes;
- se existe proximo passo para `/diagnostico` ou `/solucoes`;
- se nao cria uma promessa paralela de catalogo, blog ou biblioteca como produto central.

## Supabase

A base inicial e os campos esperados estao documentados em:

```txt
docs/supabase-setup.sql
supabase/migrations/
```

Antes de publicar mudancas que dependem do banco, confira se as tabelas, indices e colunas existem no Supabase de producao. Mudancas de schema devem ser planejadas como etapa propria.

## Deploy

O deploy oficial deve ficar centralizado no projeto Vercel:

```txt
vant-business
```

Configuracao esperada:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Dominios: `vant.business` e `www.vant.business`
- Branch de producao: `main`

Checklist local antes de deploy:

```bash
git status
npm test
npm run build
```

Depois do deploy, validar no minimo:

- `/`
- `/solucoes`
- `/diagnostico`
- redirects de `/solucoes-digitais`, `/automatize`, `/conversao` e `/recursos`
- login em `/admin-vant`
- envio de lead de diagnostico em ambiente controlado
- notificacao interna e handoff de WhatsApp

## Seguranca operacional

- Nao versionar `.env`, senhas, service keys ou tokens.
- Manter `SUPABASE_SERVICE_KEY` apenas no servidor.
- Proteger `/admin-vant` com `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET`.
- Proteger rotas agendadas com `CRON_SECRET`.
- Revisar permissoes do Supabase antes de abrir novas tabelas.
- Rodar `npm audit --omit=dev` periodicamente.

## Autor

**Victor Hugo Santos de Jesus**

VANT.Business: diagnostico, presenca digital, IA aplicada, automacao e crescimento operacional.
