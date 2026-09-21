# Vant.Business - Instrucoes do Projeto

## Objetivo do projeto

O Vant.Business e uma marca unica que une agencia premium de identidade
digital, presenca online, sites, solucoes digitais, IA aplicada, ferramentas,
conteudo, afiliados e automacao. Ele tambem funciona como vitrine comercial,
hub de autoridade, captacao de leads e base operacional para crescimento de
audiencia e clientes.

## Prioridades

1. Design sofisticado, limpo e profissional.
2. Boa performance.
3. Codigo simples e facil de manter.
4. Estrutura escalavel para servicos, leads comerciais, ferramentas de IA, noticias, afiliados, ebooks e biblioteca de conteudos.
5. Nao quebrar paginas existentes.
6. Manter consistencia visual da marca.

## Regras de implementacao

- Antes de alterar componentes visuais, identificar onde o layout esta definido.
- Evitar mudancas globais de CSS sem necessidade.
- Nao remover conteudo existente sem autorizacao.
- Quando criar nova secao, manter o padrao visual do projeto.
- Se houver dados mockados, separar dados de componentes.
- Se alterar rotas, validar navegacao.
- Se alterar build/config, explicar impacto.
- Nunca alterar `.env`, credenciais ou segredos.

## Fonte da verdade

- Proposta publica e estrutura tecnica: `README.md`.
- Checklist de deploy: `docs/deploy-checklist.md`.
- Manutencao operacional: `docs/maintenance.md`.
- Notas operacionais da IA: `docs/ai-notes.md`.
- Log de sessoes Codex: `logs/codex-session.md`.

## Checklist obrigatorio

Apos alteracoes:

- Rodar `npm run build` quando a mudanca tocar frontend, rotas, dados ou build.
- Rodar `npm run check:tool-logos` quando a mudanca tocar logos ou catalogo de ferramentas.
- Verificar se arquivos sensiveis nao foram alterados.
- Listar arquivos alterados.
- Explicar o que mudou em linguagem simples.
- Sugerir uma commit message.

## Tom do produto

Profissional, direto, tecnologico e acessivel.

Evitar aparencia generica de template. A marca deve parecer uma empresa
tecnologica premium focada em crescimento digital, identidade, IA e solucoes
para negocios.

## Memoria operacional

Codex pode registrar descobertas e sugestoes em:

- `docs/ai-notes.md`
- `logs/codex-session.md`

Codex nao deve transformar uma sugestao em decisao final sem aprovacao do Victor.
