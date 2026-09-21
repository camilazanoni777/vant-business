# Guia de manutencao - VANT Business v2

Este guia cobre a VANT atual: site comercial, diagnostico, captura de leads, admin e handoff para WhatsApp.

O material antigo de blog publico, ebook publico, portfolio/recrutador e newsletter visual foi arquivado na branch `archive/pre-vant-v2-cleanup-2026-07-09`.

## Rotas atuais

| Rota | Funcao |
| --- | --- |
| `/` | Home comercial |
| `/solucoes` | Areas de solucao |
| `/diagnostico` | Formulario principal de lead |
| `/admin-vant` | Operacao privada |

Rotas antigas mantidas como redirect: `/solucoes-digitais`, `/automatize`, `/conversao` e `/recursos`.

## Como alterar a home

Arquivo principal:

```txt
src/pages/HomePage.jsx
```

Ao alterar a home:

1. Mantenha a VANT como solucao comercial, nao como hub editorial.
2. Direcione CTAs para `/solucoes` ou `/diagnostico`.
3. Rode `npm test` e `npm run build`.

## Como alterar solucoes

Arquivo principal:

```txt
src/pages/RecursosPage.jsx
```

Apesar do nome historico do arquivo, esta pagina representa `/solucoes`. Ela deve explicar areas de solucao, gargalos e como a VANT estrutura a operacao.

## Como alterar diagnostico

Arquivos principais:

```txt
src/pages/AutomatizePage.jsx
api/subscribe.js
src/utils/briefingWhatsApp.js
src/utils/adminLeads.js
```

O diagnostico envia lead do tipo `service` com source `diagnosis-page` e produto `diagnostico-vant`.

Ao mudar campos do formulario:

1. Ajuste o payload em `AutomatizePage.jsx`.
2. Confira a normalizacao em `api/subscribe.js`.
3. Atualize a mensagem em `briefingWhatsApp.js`, se necessario.
4. Rode `node --test tests/subscribe.test.js tests/editorial-pages-copy.test.js`.

## Como alterar o admin

Arquivo principal:

```txt
src/pages/AdminPublishingPage.jsx
```

O admin deve priorizar leads, status, notas, contexto comercial e continuidade no WhatsApp.

Antes de mexer em noticias, ferramentas ou agentes internos, confirme se o modulo ainda apoia a operacao comercial atual. Se for apenas editorial, trate como legado preservado no backup.

## Como alterar marca

Arquivos principais:

```txt
public/assets/brand/
src/components/VantLogo.jsx
index.html
```

Depois de alterar marca, rode:

```bash
npm test
npm run build
```

## Checklist antes de publicar

- [ ] Conferir `git status`.
- [ ] Rodar `npm test`.
- [ ] Rodar `npm run build`.
- [ ] Testar home, `/solucoes` e `/diagnostico`.
- [ ] Testar redirects antigos.
- [ ] Testar `/admin-vant`.
- [ ] Testar captura de lead em ambiente controlado.
- [ ] Conferir handoff de WhatsApp.

## Segurança

- Nunca versionar `.env`, tokens, service keys ou senhas.
- Manter `SUPABASE_SERVICE_KEY` apenas em ambiente server-side.
- Proteger admin com `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET`.
- Mudancas de banco devem ser planejadas como etapa propria.
