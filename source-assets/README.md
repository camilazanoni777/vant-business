# source-assets

Arquivos originais que **não** são consumidos pela aplicação.

Ficam fora de `public/` porque o Vite copia todo o conteúdo de `public/` para
`dist/` no build — originais pesados iriam para o deploy sem nunca serem
baixados por um visitante.

## team/

| Original | Servido em produção | Motivo |
|---|---|---|
| `camila-zanoni.png` (2,2 MB) | `public/assets/team/camila-zanoni.webp` (237 KB) | WebP com as mesmas dimensões (1086x1448) |
| `saulo-teotonio.jpg` (217 KB) | `public/assets/team/saulo-teotonio.webp` (134 KB) | WebP com as mesmas dimensões (1206x1571) |

`victor-hugo.jpg` permanece em `public/assets/team/` porque é o arquivo
efetivamente servido: a conversão para WebP resultaria em um arquivo maior.

Nada aqui foi apagado. Para regenerar um WebP, parta destes originais.
