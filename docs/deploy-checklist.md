# Checklist de deploy - VANT Business v2

## Antes do commit

- [ ] Conferir `git status`
- [ ] Rodar `npm test`
- [ ] Rodar `npm run build`
- [ ] Testar menu e CTAs principais
- [ ] Testar `/`
- [ ] Testar `/solucoes`
- [ ] Testar `/diagnostico`
- [ ] Testar redirects: `/solucoes-digitais`, `/automatize`, `/conversao` e `/recursos`
- [ ] Testar `/admin-vant`
- [ ] Testar captura de lead de diagnostico em ambiente controlado
- [ ] Conferir notificacao interna e handoff de WhatsApp
- [ ] Conferir responsividade mobile/desktop

## Git

- [ ] Confirmar que a branch de backup existe: `archive/pre-vant-v2-cleanup-2026-07-09`
- [ ] Commitar apenas o escopo da VANT v2 atual
- [ ] Evitar incluir credenciais, arquivos `.env` ou lixo de build
- [ ] Abrir PR ou publicar branch de forma intencional

## Vercel

- [ ] Projeto: `vant-business`
- [ ] Framework: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Dominios: `vant.business` e `www.vant.business`
- [ ] Configurar `SUPABASE_URL`
- [ ] Configurar `SUPABASE_SERVICE_KEY`
- [ ] Configurar `RESEND_API_KEY`
- [ ] Configurar `EMAIL_FROM`
- [ ] Configurar `LEAD_NOTIFY_EMAIL`
- [ ] Configurar `ADMIN_EMAIL`
- [ ] Configurar `ADMIN_PASSWORD`
- [ ] Configurar `ADMIN_SESSION_SECRET`
- [ ] Configurar `CRON_SECRET`, se rotas agendadas continuarem ativas
- [ ] Configurar `VITE_VANT_WHATSAPP_NUMBER`

## Depois do deploy

- [ ] Validar home em producao
- [ ] Validar formulario de diagnostico
- [ ] Validar admin login
- [ ] Validar email/notificacao com teste controlado
- [ ] Validar que rotas antigas redirecionam corretamente
