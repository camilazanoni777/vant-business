# Decisions - Vant.Business

Este arquivo guarda apenas decisoes aprovadas pelo Victor.

Notas, ideias e sugestoes da IA devem entrar primeiro em `docs/ai-notes.md`.
Depois de aprovadas, podem ser resumidas aqui.

## Decisoes aprovadas

### 2026-05-12 - Memoria operacional controlada

Status: aprovada como estrutura inicial.

O projeto passa a ter uma separacao entre:

- memoria operacional da IA em `docs/ai-notes.md` e `logs/codex-session.md`;
- decisoes aprovadas neste arquivo;
- instrucoes de execucao em `AGENTS.md`.

Regra: Codex pode propor e registrar, mas nao transformar sugestao em decisao
final sem aprovacao do Victor.

### 2026-05-12 - VANT.BUSINESS como marca unica de agencia e hub IA

Status: aprovada pelo Victor como decisao final.

A VANT.BUSINESS passa a ser uma marca unica no mesmo dominio, sem separacao
em marcas paralelas. O posicionamento final combina:

- agencia premium de marketing, identidade digital, presenca online,
  branding, sites e solucoes digitais;
- hub de IA, ferramentas, noticias, conteudo, afiliados, newsletter e
  automacoes;
- operacao comercial orientada a leads, servicos de entrada e escalada para
  solucoes mais complexas.

Direcao central:

```txt
Ajudamos empresas e criadores a crescer utilizando tecnologia, IA, automacao
e posicionamento digital.
```

Regra de marca:

- TikTok atrai audiencia com ferramentas, IA, automacao, marketing e
  tendencias.
- Instagram convence com autoridade visual, branding, portfolio, antes/depois
  e prova de valor.
- Site converte com oferta clara, formulario de briefing, portfolio,
  biblioteca IA, noticias, newsletter e captura de leads.

Decisao operacional:

- A area publica principal passa a ser `/solucoes-digitais`.
- A rota antiga `/automatize` fica como compatibilidade para links ja
  existentes, mas deixa de ser tratada como pagina de automacoes isoladas.
- A area comercial recebe clientes interessados em identidade digital, sites,
  Instagram, Google Meu Negocio, funis, solucoes digitais e sistemas sob
  medida.
- Automacao e IA continuam existindo como oferta de escalada, nao como unica
  porta de entrada.

### 2026-06-30 - Site voltado apenas para solucoes

Status: aprovada pelo Victor como decisao final.

O site VANT.Business passa a ser orientado apenas para solucoes digitais,
automacao, IA aplicada, presenca digital e crescimento operacional de clientes.

A VANT nao deve mais ser posicionada como catalogo de ferramentas, hub editorial
ou biblioteca de IA como proposta principal. Ferramentas, conteudos, exemplos e
estudos podem existir apenas como suporte comercial para demonstrar repertorio,
prova de capacidade, possibilidades de implementacao e caminhos de escala.

Direcao central:

```txt
A VANT vende solucoes digitais que estruturam, automatizam e escalam a presenca,
o atendimento, a captacao e a operacao do cliente no digital.
```

Decisao operacional:

- O site deve priorizar paginas, secoes e CTAs de conversao para solucoes.
- A navegacao publica deve evitar dispersao institucional ou editorial.
- A aba `Ferramentas`, se mantida, deve vender a VANT e nao as ferramentas.
- Estudos, exemplos e ferramentas devem mostrar o valor da implementacao feita
  pela VANT.
- O cliente precisa entender que paga por diagnostico, estrategia, execucao,
  automacao, padronizacao e estrutura escalavel, nao por acesso a uma ferramenta
  isolada.
- O proximo passo principal do usuario deve ser pedir uma solucao, diagnostico
  ou briefing comercial.
