# AI Notes - Vant.Business

Este arquivo e a caixa de entrada da memoria operacional da IA.

Use para registrar descobertas, riscos, sugestoes e proximos passos depois de
uma sessao de trabalho. Nada aqui e decisao final ate Victor aprovar e mover
para `docs/decisions.md`, `docs/architecture.md` ou para uma nota autoral no
Obsidian.

## Regras

- Registrar fatos observados no codigo ou na documentacao.
- Separar fato, inferencia e sugestao.
- Nao registrar credenciais, tokens ou dados sensiveis.
- Nao tratar recomendacoes da IA como decisao final.

## Registro inicial

Data: 2026-05-12

### Fatos

- O projeto Vant.Business tem `README.md` com proposta oficial, rotas,
  tecnologias e estrutura.
- O projeto usa React, Vite, Tailwind CSS, Vercel Functions e Supabase.
- Existem scripts `npm run build`, `npm run dev`, `npm run preview`,
  `npm run agent:news` e `npm run check:tool-logos`.

### Inferencias

- O `README.md` deve ser tratado como fonte inicial da verdade tecnica e de
  produto.
- Mudancas de produto devem ser sincronizadas com a area Vant Business no
  Obsidian antes de virarem decisoes permanentes.

### Sugestoes

- Manter este arquivo como rascunho de memoria da IA.
- Mover apenas decisoes aprovadas para `docs/decisions.md`.
- Registrar sessoes longas em `logs/codex-session.md`.

## 2026-05-12 - Nova visao estrategica informada pelo Victor

### Fatos informados pelo Victor

- A VANT.BUSINESS deve evoluir para uma agencia de marketing, tecnologia,
  IA, automacao, presenca digital, branding, crescimento de negocios,
  ferramentas digitais e marketing inteligente.
- A estrategia nao e criar marcas separadas. A direcao desejada e construir
  um ecossistema digital com multiplas portas de entrada sob a mesma marca.
- Posicionamento central desejado:
  "Ajudamos empresas e criadores a crescer utilizando tecnologia, IA,
  automacao e posicionamento digital."
- A marca deve transmitir sofisticacao, estrategia, modernidade, tecnologia,
  autoridade, percepcao premium e confianca.
- O TikTok deve funcionar como canal de alcance, descoberta e crescimento,
  com conteudos rapidos sobre ferramentas de IA, automacao, marketing,
  produtividade, tendencias, apps uteis, tutoriais, afiliados e sistemas
  inteligentes.
- O Instagram deve funcionar como canal de autoridade e conversao, com foco
  em branding, identidade visual, posicionamento digital, sites
  profissionais, antes e depois, organizacao de perfil, autoridade visual,
  estrategia digital, presenca online, resultados de clientes e mockups
  premium.
- O site deve funcionar como centro do ecossistema: hub principal, portfolio,
  biblioteca de ferramentas IA, noticias IA, area de automacoes, servicos,
  newsletter, captura de leads e motor de conversao.
- Funcao estrategica dos canais:
  - TikTok: atrair.
  - Instagram: convencer.
  - Site: converter.
- Identidade visual desejada:
  - Preto: `#050505`, `#0B0B0B`, `#111111`.
  - Metalico/prata: `#BFC2C7`, `#E5E5E5`, `#8E8E8E`.
  - Glow discreto: `rgba(255,255,255,0.08)`.
  - Fontes ideais: Space Grotesk, Satoshi, Clash Display e Inter.
- A VANT nao deve parecer freelancer comum, designer generico, perfil
  aleatorio de IA, agencia barata ou pagina amadora.
- A VANT deve parecer uma empresa tecnologica premium focada em crescimento
  digital, com percepcao de startup seria de tecnologia.
- Monetizacao desejada:
  - Entrada: identidade visual, Instagram, Google Meu Negocio e sites.
  - Escalada: automacao, IA, WhatsApp inteligente, CRM, integracoes, funis e
    sistemas personalizados.
  - Paralela: afiliados IA, ferramentas, newsletter, conteudo, automacoes,
    produtos digitais e consultoria.
- Frases-chave informadas:
  - Automacao. IA. Escala.
  - Presenca gera percepcao.
  - Empresas fortes parecem fortes.
  - O digital virou vitrine.
  - Posicionamento e autoridade.
  - Design vende confianca.
  - Estrategia. Conexao. Resultados.
  - Impulsionamos negocios. Geramos valor.

### Inferencias

- A VANT deve deixar de ser percebida apenas como site de conteudo, portfolio
  ou biblioteca de IA, e passar a operar como marca central de uma agencia
  premium com conteudo, autoridade, leads, afiliados e servicos conectados.
- A biblioteca de ferramentas IA e as noticias IA continuam valiosas, mas
  devem servir ao posicionamento maior: atrair audiencia qualificada,
  construir autoridade e gerar oportunidades comerciais.
- O site provavelmente precisa priorizar clareza de oferta, prova de
  autoridade, servicos, portfolio, captura de leads e caminhos de conversao,
  sem perder os ativos de conteudo e afiliados ja existentes.
- O TikTok e o Instagram pedem estrategias visuais e editoriais diferentes:
  TikTok mais rapido, tech e viral; Instagram mais premium, organizado e
  orientado a confianca/comercial.
- As proximas mudancas de produto devem separar rascunho, revisao e
  publicacao para conteudos, ferramentas, cases, servicos e campanhas.

### Sugestoes

- Tratar esta secao como briefing estrategico operacional ate Victor aprovar
  quais pontos viram decisao permanente em `docs/decisions.md`.
- Revisar a homepage para comunicar rapidamente que a VANT e uma empresa
  premium de crescimento digital com IA, automacao, branding e presenca
  online.
- Reorganizar a arquitetura do site em torno de:
  Homepage premium, Servicos, Portfolio/Cases, Automacao, Biblioteca IA,
  Noticias IA, Newsletter e Captura de leads.
- Criar uma matriz simples de canais:
  TikTok atrai, Instagram convence, Site converte.
- Definir ofertas de entrada antes de mexer no funil:
  identidade visual, organizacao de Instagram, Google Meu Negocio e site
  profissional.
- Definir ofertas de escalada depois:
  automacao, IA, CRM, WhatsApp inteligente, integracoes, funis e sistemas.
- Fazer a primeira mudanca de implementacao de forma pequena e reversivel:
  atualizar copy/posicionamento da homepage e navegacao antes de refatorar
  componentes grandes ou mudar arquitetura.

### Pontos para aprovacao do Victor

- Confirmar se o README deve ser atualizado para refletir a nova visao.
- Confirmar se a VANT deixa de ter foco principal em "conteudo/curadoria de
  IA" e passa a ter foco principal em "agencia premium de crescimento digital
  com IA e automacao".
- Confirmar quais servicos entram primeiro na homepage.
- Confirmar se biblioteca IA e noticias IA continuam como secoes principais
  ou passam a funcionar como portas de entrada de conteudo.

## 2026-05-16 - Ajuste operacional da homepage

### Fatos

- A homepage passou a priorizar linguagem de posicionamento digital, presenca
  premium, IA aplicada e crescimento.
- O CTA principal da home agora aponta para `solucoes-digitais`.
- Ferramentas, ebooks e conteudo permaneceram na home, mas com mensagem de
  apoio e descoberta, nao como proposta principal.

### Inferencias

- O site esta mais proximo da direcao "TikTok atrai, Instagram convence, site
  converte", porque a home passou a empurrar o visitante para a oferta de
  solucoes.
- O proximo desalinhamento mais provavel agora esta na profundidade comercial
  da pagina `solucoes-digitais`, nao mais no hero principal da home.

### Sugestoes

- Revisar a pagina `solucoes-digitais` com foco em prova, escopo inicial,
  qualificacao do lead e proximo passo comercial.
- Decidir se o README deve ser atualizado agora ou apenas depois de aprovar a
  narrativa definitiva da nova VANT.

## 2026-05-22 - Refinamento do posicionamento por canal

### Fatos informados pelo Victor

- O TikTok deve funcionar com entrada mais editorial e descoberta:
  noticias de IA, ferramentas e, em breve, ebooks com mini projetos de uso.
- O Instagram deve funcionar com entrada mais comercial:
  solucoes, presenca digital, percepcao premium e conversa sobre projeto.

### Inferencias

- Nao existem duas marcas diferentes; existem duas portas de entrada no mesmo
  funil.
- O TikTok opera como topo de funil, com promessa de curadoria, repertorio e
  aplicacao pratica.
- O Instagram opera como meio/fundo de funil, com promessa de confianca,
  direcao e solucao.
- O site precisa reconciliar as duas entradas, sem parecer nem um simples hub
  de noticias/ferramentas, nem uma landing desconectada do ecossistema
  editorial.

### Sugestoes

- Tratar a homepage como ponte entre autoridade editorial e oferta de
  solucoes, preservando a hierarquia:
  posicionamento principal, solucoes, depois ecossistema de conteudo.
- Manter dois trilhos claros no site:
  - Trilho editorial: noticias, ferramentas, ebooks, mini projetos e
    newsletter.
  - Trilho de solucoes: briefing, diagnostico, presenca digital,
    posicionamento e estrutura operacional.
- Usar a seguinte regra de consistencia:
  - TikTok: o que esta acontecendo e como usar.
  - Instagram: por que isso importa para posicionamento e negocio.
  - Site: ecossistema completo e proximo passo certo.
- Consolidar a mensagem-mae da marca como proposta operacional:
  "A VANT transforma tecnologia, presenca digital e IA em crescimento real."
- Tratar as subpromessas dos canais como apoio, nao como reposicionamentos
  concorrentes:
  - Trilha editorial: curadoria de IA, ferramentas e aplicacoes praticas.
  - Trilha de solucoes: direcao, presenca digital e estrutura para crescer.

### Pontos para aprovacao do Victor

- Confirmar se a homepage deve assumir explicitamente a hierarquia:
  marca/solucoes primeiro, conteudo/editorial depois.
- Confirmar se TikTok deve empurrar principalmente para newsletter, ebooks e
  paginas de conteudo, enquanto o Instagram empurra principalmente para
  `solucoes-digitais`.

## 2026-05-22 - Copy-base para canais e homepage

### Fatos

- O posicionamento por canal foi refinado para duas entradas no mesmo funil:
  TikTok editorial e Instagram comercial.
- Ainda nao ha decisao final registrada sobre bios e hero definitivos.

### Sugestoes

- Usar a seguinte copy-base como proposta operacional inicial.

#### Bio TikTok - opcao principal

- Noticias de IA, ferramentas e aplicacoes praticas.
- Menos ruido. Mais contexto.
- Ebooks, mini projetos e curadoria da VANT.

#### Bio TikTok - opcao curta

- IA, ferramentas e mini projetos.
- Curadoria pratica sem ruido.
- Newsletter e ebooks da VANT.

#### Bio Instagram - opcao principal

- Presenca digital, IA e estrutura para crescer.
- Marca, paginas, automacao e direcao.
- Fale com a VANT sobre seu projeto.

#### Bio Instagram - opcao curta

- Presenca premium + IA aplicada.
- Estrutura digital para crescer.
- Briefing aberto na VANT.

#### Hero homepage - proposta principal

- Titulo:
  Presenca. IA. Crescimento.
- Subtitulo:
  A VANT transforma presenca digital, tecnologia e IA em crescimento real.
  Explore ferramentas, noticias e guias práticos ou avance para a pagina de
  solucoes se o seu foco for posicionamento, estrutura e conversao.
- CTA primario:
  Conhecer solucoes
- CTA secundario:
  Explorar conteudo

#### Hero homepage - proposta alternativa

- Titulo:
  Posicionamento forte. Tecnologia util. Crescimento real.
- Subtitulo:
  Conteudo, curadoria e aplicacao pratica para atrair a audiencia certa.
  Direcao, presenca digital e estrutura para transformar interesse em
  oportunidade.
- CTA primario:
  Falar sobre seu projeto
- CTA secundario:
  Ver noticias e ferramentas

### Inferencias

- A homepage deve falar primeiro com quem chega pelo Instagram, sem expulsar a
  audiencia que entra pelo TikTok.
- O CTA primario deve continuar levando para `solucoes-digitais`, enquanto o
  CTA secundario funciona como ponte para o trilho editorial.
- As bios devem compartilhar o mesmo nucleo de marca, mudando apenas a
  promessa principal de entrada.

### Pontos para aprovacao do Victor

- Escolher qual versao de bio do TikTok vira base oficial.
- Escolher qual versao de bio do Instagram vira base oficial.
- Confirmar se a hero da homepage deve usar a formula mais curta
  ("Presenca. IA. Crescimento.") ou a mais explicativa.

## 2026-07-07 - Sugestao operacional: identidade visual verde-lima

### Fatos

- Victor enviou uma nova referencia visual da VANT com simbolo em destaque,
  versao primary, versao reversed e assinatura "Automate. Intelligently. Grow.".
- A primeira aplicacao local organizou os arquivos finais do Drive em
  `public/assets/brand/`.
- A identidade antiga em `public/assets/` foi preservada como fallback tecnico.

### Sugestoes

- Tratar `public/assets/brand/vant-identity-2026-green-board.png` como board de
  referencia local ate aprovacao final.
- Usar verde-lima como acento principal da marca, sem transformar todo o site em
  uma interface monocromatica.
- Priorizar a aplicacao em superficies publicas antes do admin: header, footer,
  homepage, pagina de solucoes, pagina de conversao, emails e favicon.

### Pontos para aprovacao do Victor

- Confirmar se a assinatura em ingles deve ser definitiva no site inteiro.
- Confirmar se os PNGs transparentes do Drive podem ser tratados como assets
  oficiais finais da marca.

## 2026-07-09 - Sugestao operacional: README alinhado a VANT v2

### Fatos

- O README foi reescrito para tratar a VANT v2 como site comercial de solucoes digitais, diagnostico, presenca, captacao, atendimento, automacao e crescimento operacional.
- As rotas principais documentadas passaram a ser `/`, `/solucoes`, `/diagnostico`, `/cases` e `/admin-vant`.
- As rotas antigas `/solucoes-digitais`, `/automatize`, `/conversao` e `/recursos` foram documentadas como compatibilidade/redirecionamento.
- Conteudos, ferramentas, newsletter, ebooks e agentes foram mantidos como suporte operacional ou legado preservado, nao como promessa publica principal.

### Inferencias

- O README agora esta mais proximo da decisao aprovada em 2026-06-30 no BrainOS.
- A proxima fonte com maior risco de residuo estrategico e a documentacao auxiliar: `docs/maintenance.md`, `docs/deploy-checklist.md`, `docs/coding-patterns.md` e possiveis componentes antigos preservados.

### Sugestoes

- Revisar `AGENTS.md`/instrucoes locais do repo, se existir, para refletir o posicionamento v2.
- Fazer uma varredura controlada de residuos por bucket: core v2, suporte comercial, legado inativo e residuo deletavel.
- Evitar remover arquivos de conteudo/ferramentas antes de confirmar dependencias do admin e das APIs.

## 2026-07-09 - Sugestao operacional: backup e limpeza do repo VANT atual

### Fatos

- Foi criada e enviada ao GitHub a branch `archive/pre-vant-v2-cleanup-2026-07-09` com o estado completo antes da limpeza.
- A branch de trabalho `chore/vant-v2-cleanup` passou a conter a VANT v2 como base atual.
- Foram removidos da branch de trabalho os modulos publicos inativos de blog, ebook, portfolio/recrutador, curriculo PDF, admin antigo e componentes/dados associados.
- `marked` e `gray-matter` foram removidos por ficarem sem uso apos a retirada do suporte publico de blog/ebook.

### Inferencias

- A VANT atual ficou mais direcionada para home, solucoes, diagnostico, cases, admin ativo e captura comercial.
- Noticias, ferramentas e agentes ainda existem como suporte interno/admin e devem ser avaliados em um corte separado antes de qualquer remocao maior.

### Sugestoes

- Usar a branch de arquivo como fonte de recuperacao para qualquer modulo removido.
- Fazer o proximo corte especificamente no admin: manter apenas o que apoia lead comercial, ou renomear/ocultar noticias/ferramentas/agentes se ainda forem uteis.
- Nao apagar tabelas Supabase ou automacoes externas ate concluir a revisao do admin e das APIs.

## 2026-07-09 - Sugestao de regra visual para primeira dobra

### Fato informado pelo Victor

- Ao abrir uma pagina, a primeira dobra nao deve cortar informacoes importantes no meio.
- O layout deve se adaptar automaticamente ao tamanho do monitor, preservando responsividade por largura e altura.

### Inferencia

- Heroes e primeiras secoes da VANT devem evitar altura fixa rigida, `max-height` que corte conteudo e visuais secundarios grandes demais para telas menores.
- Elementos secundarios podem compactar, esconder ou mudar de posicao quando a altura/largura disponivel nao comportar tudo.

### Sugestao

- Usar esta regra como checklist antes de concluir ajustes visuais: desktop grande, notebook, tablet e mobile devem abrir sem cortar mensagem principal, CTA ou bloco visual essencial.
- Priorizar `svh`, `clamp()`, breakpoints por altura e conteudo secundario adaptavel nas primeiras dobras.
