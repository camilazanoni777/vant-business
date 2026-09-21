# Caminho da VANT.BUSINESS

Este arquivo registra o caminho aprovado para transformar a VANT.BUSINESS em
uma marca unica de agencia premium e hub de IA no mesmo dominio.

## Objetivo

Construir uma empresa digital premium que usa tecnologia, IA, automacao,
branding e posicionamento para ajudar empresas e criadores a crescer.

## Fase 1 - Captacao comercial clara

Entrada:
- Visitante chega ao site procurando presenca digital, identidade visual,
  site, Instagram, Google Meu Negocio, funil ou solucao digital.

Etapas:
- Reposicionar a antiga area de automacoes como `/solucoes-digitais`, mantendo
  `/automatize` apenas como compatibilidade.
- Capturar nome, empresa, email, WhatsApp, tipo de solucao, momento,
  investimento e briefing.
- Salvar o lead no Supabase como `leadType: service`.
- Mostrar o lead no painel administrativo junto dos demais contatos.

Saida:
- Lead comercial qualificado para conversa direta.

## Fase 2 - Homepage de agencia premium

Entrada:
- Decisao de marca aprovada em `docs/decisions.md`.

Etapas:
- Atualizar headline, subtitulo e CTA principal da home.
- Comunicar a VANT como agencia premium de crescimento digital com IA.
- Destacar ofertas de entrada: identidade digital, Instagram, Google Meu
  Negocio e site profissional.
- Manter biblioteca IA e noticias como portas de entrada de autoridade.

Saida:
- Home alinhada com o novo posicionamento.

## Fase 3 - Ofertas e portfolio

Entrada:
- Servicos iniciais definidos.

Etapas:
- Criar secoes ou paginas para servicos.
- Organizar portfolio/cases com problema, solucao e resultado esperado.
- Separar ofertas de entrada e ofertas de escalada.

Saida:
- Site preparado para convencer e converter clientes.

## Fase 4 - Conteudo como motor de autoridade

Entrada:
- TikTok e Instagram definidos como canais complementares.

Etapas:
- TikTok: ferramentas IA, tendencias, automacao, apps e tutoriais rapidos.
- Instagram: branding, antes/depois, autoridade visual, portfolio e
  posicionamento.
- Site: posts, noticias, biblioteca IA, newsletter e lead magnets.

Saida:
- Conteudo alimentando audiencia, confianca, afiliados e leads.

## Fase 5 - Operacao e escala

Entrada:
- Leads, conteudos e ofertas rodando.

Etapas:
- Melhorar painel admin para classificar leads comerciais.
- Criar status de lead: novo, em contato, proposta, fechado e perdido.
- Conectar formularios, newsletter, ferramentas e campanhas.
- Evoluir para CRM, WhatsApp inteligente, integracoes e automacoes internas.

Saida:
- VANT operando como ecossistema digital com aquisicao, conversao e entrega.

## Proximo passo pratico

Finalizar a Fase 1 no codigo e validar:

- formulario publico;
- envio para `/api/subscribe`;
- registro do lead como `service`;
- build do frontend;
- painel admin exibindo o lead recebido.
