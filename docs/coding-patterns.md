# Coding Patterns - VANT.Business v2

Padroes praticos para manter o projeto consistente com a VANT atual.

## Frontend

- Priorizar as rotas `/`, `/solucoes`, `/diagnostico` e `/admin-vant`.
- Manter CTAs publicos direcionados para diagnostico ou solucoes.
- Evitar reintroduzir blog, ebook, portfolio ou newsletter como proposta principal.
- Preferir componentes pequenos e alinhados ao fluxo comercial.
- Validar responsividade quando alterar layouts principais.

## Conteudo

- Manter textos publicos com tom profissional, direto, tecnologico e comercial.
- Falar primeiro de diagnostico, presenca, captacao, atendimento, automacao e crescimento operacional.
- Ferramentas, noticias e agentes so devem aparecer como suporte ou prova de repertorio.
- Evitar promessa exagerada sobre IA, automacao ou resultado financeiro.

## APIs

- Validar entrada antes de gravar ou enviar email.
- Nao expor segredos no frontend.
- Preservar compatibilidade do lead comercial antes de alterar banco ou schema.
- Centralizar mensagens de erro quando houver repeticao real.

## Validacao

- Rodar `npm test` para mudancas de rotas, copy, API, admin ou docs testadas.
- Rodar `npm run build` para mudancas de frontend, rotas, conteudo ou config.
- Rodar `node --test tests/legacy-cleanup.test.js` ao mexer em remocao de legado.
- Rodar `npm run check:tool-logos` apenas se tocar no catalogo interno de ferramentas.
