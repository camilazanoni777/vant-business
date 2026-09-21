import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import {
  ecosystemNodes,
  growthSystem,
  howWeWorkSteps,
  heroContent,
  squads,
  studioBusiness,
  systemsFlow,
  teamMembers,
  finalDiagnosticCta,
} from '../src/data/vantPresentation.js';

const homePageSource = readFileSync(
  new URL('../src/pages/HomePage.jsx', import.meta.url),
  'utf8',
);
const homeStyles = readFileSync(
  new URL('../src/index.css', import.meta.url),
  'utf8',
);
const teamCardSource = readFileSync(
  new URL('../src/components/ui/TeamCard.jsx', import.meta.url),
  'utf8',
);
const journeyLogoSource = readFileSync(
  new URL('../src/components/JourneyLogo.jsx', import.meta.url),
  'utf8',
);
const headerSource = readFileSync(
  new URL('../src/components/Header.jsx', import.meta.url),
  'utf8',
);


test('homepage presents the approved diagnosis-first narrative', () => {
  assert.equal(heroContent.eyebrow, 'ESTRATÉGIA • TECNOLOGIA • PESSOAS • RESULTADOS');
  assert.equal(heroContent.title, 'Estrutura digital para empresas que querem avançar.');
  assert.equal(heroContent.primaryCta.href, '/diagnostico');
  assert.equal(heroContent.secondaryCta.href, '#como-funciona');
  assert.match(homePageSource, /<h1/);
  assert.match(homePageSource, /id="como-funciona"/);
  assert.match(homePageSource, /id="solucoes"/);
  assert.match(homePageSource, /id="especialistas"/);
});

test('homepage keeps the ecosystem and systemic flow as data, not JSX literals', () => {
  assert.deepEqual(ecosystemNodes, [
    'Estratégia',
    'Marketing',
    'Tecnologia',
    'Dados',
    'Comercial',
    'Growth',
  ]);
  assert.deepEqual(systemsFlow, [
    'Posicionamento',
    'Aquisição',
    'Atendimento',
    'Conversão',
    'Operação',
    'Automação',
    'Dados',
    'Crescimento',
  ]);
});

test('homepage describes the approved method and offer', () => {
  assert.equal(howWeWorkSteps.length, 5);
  assert.deepEqual(howWeWorkSteps.map(({ name }) => name), [
    'Diagnóstico',
    'Estratégia',
    'Plano de ação',
    'Execução especializada',
    'Evolução',
  ]);
  assert.equal(studioBusiness.length, 2);
  assert.deepEqual(growthSystem.map(({ letter }) => letter), ['V', 'A', 'N', 'T']);
  assert.equal(squads.length, 3);
});

test('homepage exposes approved specialists only when a real portrait is available', () => {
  assert.equal(teamMembers.length, 4);
  assert.deepEqual(teamMembers.map(({ name }) => name), ['Victor Hugo', 'Camila', 'Saulo Teotônio', 'Kauã']);
  assert.deepEqual(
    teamMembers.filter(({ photo }) => photo).map(({ name, photo }) => ({ name, photo })),
    [
      { name: 'Victor Hugo', photo: '/assets/team/victor-hugo.jpg' },
      { name: 'Camila', photo: '/assets/team/camila-zanoni.webp' },
      { name: 'Saulo Teotônio', photo: '/assets/team/saulo-teotonio.webp' },
    ],
  );
  // Kauã continua fora da interface até a foto real chegar (sem placeholder).
  assert.deepEqual(teamMembers.filter(({ photo }) => !photo).map(({ name }) => name), ['Kauã']);
  assert.match(homePageSource, /id="especialistas"/);
  assert.doesNotMatch(homePageSource, /placeholder/i);
  assert.doesNotMatch(teamCardSource, /placeholder/i);

  teamMembers.forEach(({ name, photoAlt }) => {
    assert.equal(photoAlt, `Retrato profissional de ${name}`);
  });
});

test('every approved specialist keeps the copy free of unpublished metrics', () => {
  const teamCopy = teamMembers
    .map(({ role, description, skills }) => [role, description, ...skills].join(' '))
    .join(' ');

  [/seguidores/i, /faturamento/i, /\+\s*\d/, /R\$/, /\d+\s*(mil|milh|anos|k)/i].forEach((forbidden) => {
    assert.doesNotMatch(teamCopy, forbidden, `team copy must not publish metrics: ${forbidden}`);
  });
});

test('TeamCard is a reusable component driven only by team data', () => {
  assert.match(teamCardSource, /function TeamCard/);
  assert.match(teamCardSource, /export default TeamCard/);
  assert.match(homePageSource, /import TeamCard from '\.\.\/components\/ui\/TeamCard\.jsx'/);
  assert.doesNotMatch(homePageSource, /function TeamCard/);

  // Layout shift protection: lazy image with reserved, undistorted space.
  assert.match(teamCardSource, /loading="lazy"/);
  assert.match(teamCardSource, /width=\{photoWidth\}/);
  assert.match(teamCardSource, /height=\{photoHeight\}/);
  assert.match(homeStyles, /\.vant-team-card-image \{[^}]*aspect-ratio/);
  assert.match(homeStyles, /\.vant-team-card-image img \{[^}]*object-fit: cover/);

  // Published portraits must carry real dimensions so the space is reserved.
  teamMembers
    .filter(({ photo }) => photo)
    .forEach(({ name, photoWidth, photoHeight }) => {
      assert.ok(Number.isInteger(photoWidth) && photoWidth > 0, `${name} needs photoWidth`);
      assert.ok(Number.isInteger(photoHeight) && photoHeight > 0, `${name} needs photoHeight`);
    });
});

test('team cards keep hover discreet and never hide essential content behind it', () => {
  assert.match(homeStyles, /\.vant-team-card:hover \{[^}]*translateY\(-3px\)/);
  assert.match(homeStyles, /\.vant-team-card:hover \{[^}]*border-color: rgba\(155, 220, 0/);
  assert.doesNotMatch(homeStyles, /\.vant-team-card:hover [^{]*\{[^}]*(display: block|visibility: visible|opacity: 1)/);
});

test('team grid collapses to a single column on mobile without a carousel', () => {
  assert.match(homeStyles, /\.vant-team-grid \{[^}]*grid-template-columns/);
  assert.match(homeStyles, /@media \(max-width: 640px\) \{[^@]*\.vant-team-grid \{ grid-template-columns: 1fr; \}/);
  assert.doesNotMatch(homeStyles, /vant-team-carousel/);
  assert.match(homeStyles, /\.vant-team-card-skills[^{]*\{[^}]*flex-wrap: wrap/);
});

test('homepage ends with the approved diagnostic CTA', () => {
  assert.equal(finalDiagnosticCta.href, '/diagnostico');
  assert.equal(finalDiagnosticCta.label, 'Fazer diagnóstico VANT');
  assert.deepEqual(finalDiagnosticCta.benefits, ['Poucos minutos', 'Análise personalizada', 'Sem compromisso']);
  assert.match(homePageSource, /function FinalDiagnosticCta/);
  assert.equal(finalDiagnosticCta.title, 'Antes de contratar uma solução, descubra onde está o verdadeiro gargalo.');
  assert.match(homePageSource, /vant-final-diagnostic-ornament[^>]*aria-hidden="true"/);
  assert.match(
    homePageSource,
    /<Link to=\{finalDiagnosticCta\.href\} className="brand-button-primary vant-presentation-button">/,
  );
});

test('the final CTA sits after the specialists section', () => {
  assert.ok(
    homePageSource.indexOf('<TeamSection />') < homePageSource.indexOf('<FinalDiagnosticCta />'),
    'FinalDiagnosticCta must render after TeamSection',
  );
});

test('every home CTA that promises the diagnosis points at /diagnostico', () => {
  const linkTargets = [...homePageSource.matchAll(/<Link to="([^"]+)"/g)].map(([, href]) => href);
  assert.ok(linkTargets.length > 0);
  linkTargets.forEach((href) => assert.equal(href, '/diagnostico'));
  assert.equal(heroContent.primaryCta.href, '/diagnostico');
});

test('home anchors referenced in the page all exist', () => {
  const anchorLinks = [...homePageSource.matchAll(/href=\{?["']#([a-z-]+)["']\}?/g)].map(([, id]) => id);
  const hashDataAnchors = [heroContent.secondaryCta.href]
    .filter((href) => href.startsWith('#'))
    .map((href) => href.slice(1));

  [...anchorLinks, ...hashDataAnchors].forEach((id) => {
    assert.match(homePageSource, new RegExp(`id="${id}"`), `missing anchor target #${id}`);
  });
});

test('homepage anchors reserve space for the fixed header', () => {
  assert.match(homeStyles, /#como-funciona,\s*#solucoes,\s*\.vant-team-section/);
  assert.match(homeStyles, /scroll-margin-top:\s*90px/);
});

test('the page keeps a single h1 and no duplicated ids', () => {
  assert.equal((homePageSource.match(/<h1/g) || []).length, 1);

  const ids = [...homePageSource.matchAll(/id="([^"]+)"/g)].map(([, id]) => id);
  assert.deepEqual([...new Set(ids)].sort(), [...ids].sort(), 'HomePage must not repeat an id');
  assert.ok(ids.includes('especialistas'));
});

test('reduced motion disables smooth scrolling and card motion', () => {
  const block = homeStyles.match(/@media \(prefers-reduced-motion: reduce\) \{[^@]*/);
  assert.ok(block, 'a prefers-reduced-motion block must exist');
  assert.match(block[0], /html \{ scroll-behavior: auto !important; \}/);
  assert.match(block[0], /transition-duration: \.01ms !important/);
});

// Lê as dimensões reais do arquivo (PNG/JPEG) para provar que a imagem
// publicada é real e que width/height declarados batem com o bitmap.
function readImageSize(buffer) {
  if (buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { format: 'png', width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { format: 'jpeg', height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }
  if (buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP') {
    const chunk = buffer.slice(12, 16).toString('ascii');
    if (chunk === 'VP8X') {
      return {
        format: 'webp',
        width: buffer.readUIntLE(24, 3) + 1,
        height: buffer.readUIntLE(27, 3) + 1,
      };
    }
    if (chunk === 'VP8 ') {
      return {
        format: 'webp',
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
      };
    }
    if (chunk === 'VP8L') {
      const bits = buffer.readUInt32LE(21);
      return { format: 'webp', width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  return null;
}

test('every published portrait is a real file whose declared size matches the bitmap', () => {
  const published = teamMembers.filter(({ photo }) => photo);
  assert.ok(published.length > 0, 'at least one portrait must be published');

  published.forEach(({ name, photo, photoAlt, photoWidth, photoHeight, objectPosition }) => {
    assert.ok(photo.startsWith('/assets/team/'), `${name}: portrait must live in /assets/team/`);

    const file = new URL('../public' + photo, import.meta.url);
    assert.equal(existsSync(file), true, `${name}: missing portrait file ${photo}`);

    const size = readImageSize(readFileSync(file));
    assert.ok(size, `${name}: portrait must be a real PNG/JPEG`);
    assert.equal(photoWidth, size.width, `${name}: declared width must match the file`);
    assert.equal(photoHeight, size.height, `${name}: declared height must match the file`);

    assert.equal(photoAlt, `Retrato profissional de ${name}`);
    if (objectPosition !== undefined) {
      assert.equal(typeof objectPosition, 'string', `${name}: objectPosition must be a CSS string`);
    }
  });
});

test('TeamCard supports per-profile framing without a global crop', () => {
  assert.match(teamCardSource, /objectPosition/);
  assert.match(teamCardSource, /style=\{objectPosition \? \{ objectPosition \} : undefined\}/);
});

test('the first fold composes title, monumental object and support', () => {
  assert.match(homePageSource, /vant-hero--composed/);
  assert.match(homePageSource, /vant-hero-title-area/);
  assert.match(homePageSource, /vant-hero-object-slot/);
  assert.match(homePageSource, /<JourneyLogo \/>/);
  assert.match(homePageSource, /vant-hero-support/);
  assert.doesNotMatch(homePageSource, /BrandIntro|HeroLogo|FlyingLogo/);
  assert.equal(existsSync(new URL('../src/components/BrandIntro.jsx', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/components/HeroLogo.jsx', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/components/FlyingLogo.jsx', import.meta.url)), false);

  assert.ok(homePageSource.indexOf('vant-hero-title-area') < homePageSource.indexOf('vant-hero-object-slot'));
  assert.ok(homePageSource.indexOf('vant-hero-object-slot') < homePageSource.indexOf('vant-hero-support'));
  assert.ok(homePageSource.indexOf('vant-hero-stage') < homePageSource.indexOf('<EcosystemVisual />'));
});

test('the monumental object is scaled to the viewport height', () => {
  // 75vh a 95vh no desktop.
  const size = homeStyles.match(/--j-size: clamp\(320px, min\((\d+)vh, \d+vw\), 880px\)/);
  assert.ok(size, 'a altura do objeto deve vir de vh');
  const vh = Number(size[1]);
  assert.ok(vh >= 75 && vh <= 95, `--j-size deve ficar entre 75vh e 95vh, veio ${vh}vh`);

  // O espacador reserva menos que o objeto: o V sangra atras das colunas e o
  // texto ocupa as cunhas vazias.
  // A coluna reservada no hero e exatamente a faixa de exclusao.
  assert.match(homeStyles, /\.vant-hero-object-slot \{ width: var\(--vant-reserved\)/);
  assert.doesNotMatch(homeStyles, /\.vant-hero--composed \.vant-hero-title-area h1 \{[^}]*break-word/);
});

test('the object is built from layers of the real logo art', () => {
  // Pega o bloco que de fato declara a mascara (ha outro seletor com o
  // mesmo nome so para desligar as camadas fora da dobra).
  const maskRule = homeStyles.match(/\.vant-journey-depth,[\s\S]*?-webkit-mask:[^;]+;[\s\S]*?[\r\n]\}/);
  assert.ok(maskRule, 'depth/rim/fill/sheen compartilham a mascara da logo');
  assert.match(maskRule[0], /mask: url\("\/assets\/brand\/vant-logo-official\.png"\)/);
  assert.match(maskRule[0], /-webkit-mask: url\("\/assets\/brand\/vant-logo-official\.png"\)/);

  // A face frontal e a arte oficial, sem mascara nem gradiente por cima.
  assert.match(journeyLogoSource, /className="vant-journey-face"[\s\S]*?src=\{LOGO_SOURCE\}/);
  assert.doesNotMatch(homeStyles, /\.vant-journey-face \{[^}]*mask:/);

  assert.match(journeyLogoSource, /DEPTH_LAYERS = \d+/);
  assert.match(homeStyles, /\.vant-journey-depth \{[\s\S]*?translateZ/);
  assert.match(homeStyles, /transform-style: preserve-3d/);
  assert.match(homeStyles, /\.vant-journey-object \{[\s\S]*?perspective:/);
});

test('a single object travels the page along a rail', () => {
  // Um unico objeto, nunca duplicado por secao.
  assert.equal((homePageSource.match(/<JourneyLogo \/>/g) || []).length, 1);
  assert.equal((journeyLogoSource.match(/className="vant-journey-object"/g) || []).length, 1);
  assert.match(journeyLogoSource, /aria-hidden="true"/);
  assert.match(homeStyles, /\.vant-journey-object \{[\s\S]*?pointer-events: none/);

  // Uma zona por secao, com posicao e opacidade proprias.
  for (let zone = 0; zone <= 7; zone += 1) {
    assert.match(homeStyles, new RegExp(`\\.vant-journey\\[data-zone='${zone}'\\]`), `falta a zona ${zone}`);
  }

  // Esteira com linha, marcadores e ponto de luz que acompanha o objeto.
  assert.match(journeyLogoSource, /vant-journey-line-aura/);
  assert.match(journeyLogoSource, /vant-journey-beam-face/);
  assert.match(journeyLogoSource, /vant-journey-line-pulse/);
  assert.match(homeStyles, /\.vant-journey-line-pulse \{[\s\S]*?var\(--j-journey\)/);
});

test('the object only animates compositor-friendly properties', () => {
  const rule = homeStyles.match(/\.vant-journey-object \{[\s\S]*?\n\}/);
  assert.ok(rule);
  assert.match(rule[0], /transition:\s*[\s\S]*?transform [^;]*,\s*[\s\S]*?opacity/);
  assert.doesNotMatch(rule[0], /transition:[^;]*(left|top|margin)/);
  assert.match(journeyLogoSource, /requestAnimationFrame/);
  assert.match(journeyLogoSource, /\{ passive: true \}/);
});

test('the opaque hero object fades before content scrolls under it', () => {
  // O objeto e fixo: sem o decaimento, o conteudo da dobra passaria por baixo
  // dele enquanto ainda esta opaco.
  assert.match(homeStyles, /\[data-zone='0'\] \.vant-journey-object \{ opacity: calc\(1\.02 - var\(--j-page\)/);
  assert.match(journeyLogoSource, /--j-page/);

  // Fora da dobra a logo fica em primeiro plano, nunca abaixo de 45%.
  ['1', '2', '3', '4', '5', '6', '7'].forEach((zone) => {
    const rule = homeStyles.match(new RegExp(`\\.vant-journey\\[data-zone='${zone}'\\] \\{[^}]*\\}`));
    assert.ok(rule, `falta a zona ${zone}`);
    // '.5' e '.56' sao 50% e 56%: le o decimal, nao os digitos soltos.
    const opacity = Number(rule[0].match(/--j-opacity: (\.\d+|\d?\.?\d+)/)[1]);
    assert.ok(opacity >= 0.45, `zona ${zone} deve ficar em primeiro plano, veio ${opacity}`);
  });
});

test('mobile keeps content off the object and simplifies the rail', () => {
  // Objeto no topo, conteudo sempre depois dele.
  assert.match(homeStyles, /\.vant-hero-object-slot \{ order: 1;/);
  assert.match(homeStyles, /\.vant-hero-title-area \{ order: 2;/);
  assert.match(homeStyles, /\.vant-hero-support \{ order: 3;/);
  // Esteira simplificada.
  assert.match(homeStyles, /\.vant-journey-line-pulse \{ animation: none;/);
});

test('reduced motion keeps the object static, monumental and rail-free', () => {
  const blocks = homeStyles.split('@media (prefers-reduced-motion: reduce) {').slice(1);
  const block = blocks.find((b) => b.includes("[data-reduced='true']"));
  assert.ok(block, 'o bloco de movimento reduzido deve cobrir o objeto');
  assert.match(block, /opacity: 1 !important/);
  assert.match(block, /\.vant-journey-halo \{ animation: none !important; opacity: \.85/);
  // Sem viagem: o objeto fica preso a primeira dobra e a esteira some.
  assert.match(block, /\[data-reduced='true'\] \.vant-journey-object \{ position: absolute/);
  assert.match(block, /\[data-reduced='true'\] \.vant-journey-line \{ display: none/);
  assert.match(journeyLogoSource, /prefers-reduced-motion: reduce/);
});

test('the mobile menu is really hidden until it is opened', () => {
  // O atributo `hidden` sozinho nao basta: uma classe de display fixa venceria
  // o display:none do user agent e deixaria o menu aberto no carregamento.
  assert.match(headerSource, /\$\{isMenuOpen \? 'grid' : 'hidden'\}/);
  assert.match(headerSource, /hidden=\{!isMenuOpen\}/);
});

test('the conducting object and the rail never leave the centre', () => {
  // Nenhuma zona desloca o objeto na horizontal.
  assert.doesNotMatch(homeStyles, /\.vant-journey\[data-zone='\d'\][^}]*--j-x/);
  // data-side pertence as estacoes (conector esq/dir), nunca a logo.
  assert.doesNotMatch(homeStyles, /\.vant-journey\[data-side/);

  // A descida vem do progresso do documento, nao de saltos por zona.
  assert.match(homeStyles, /\.vant-journey-object \{[\s\S]*?translate3d\(0, calc\(var\(--j-y\) \+ var\(--j-journey\) \* 26vh\), 0\)/);
  assert.match(journeyLogoSource, /--j-journey/);
  assert.match(journeyLogoSource, /scrollHeight - viewport/);

  // A esteira nao tem transform horizontal e acompanha a mesma descida.
  const rail = homeStyles.match(/\.vant-journey-line \{[\s\S]*?[\r\n]\}/);
  assert.ok(rail);
  assert.doesNotMatch(rail[0], /transform:/);
  assert.match(homeStyles, /\.vant-journey-line-pulse \{[\s\S]*?var\(--j-journey\)/);
});

test('every section reserves the central exclusion band', () => {
  assert.match(homeStyles, /--vant-band: clamp\(/);
  assert.match(homeStyles, /--vant-side: calc\(\(100% - var\(--vant-reserved\)\) \/ 2\)/);

  // A copy nunca passa da lateral e alterna de lado por secao.
  assert.match(homeStyles, /\.vant-presentation-section-copy,[\s\S]*?max-width: var\(--vant-side\)/);
  assert.match(homeStyles, /section:nth-of-type\(even\) \.vant-presentation-section-copy/);

  // Toda grade larga abre uma trilha do tamanho da faixa.
  ['vant-systems-flow', 'vant-method-steps', 'vant-business-units-grid',
   'vant-growth-system-grid', 'vant-team-grid', 'vant-squads-table-row'].forEach((grid) => {
    assert.match(
      homeStyles,
      new RegExp(String.raw`\.` + grid + String.raw`[^{]*\{[^}]*grid-template-columns:[^;]*var\(--vant-reserved\)`),
      `${grid} deve reservar a faixa central`,
    );
  });

  // Graficos que nasciam centrados foram para uma lateral.
  assert.match(homeStyles, /\.vant-ecosystem \{[^}]*width: var\(--vant-side\)/);
  assert.match(homeStyles, /\.vant-final-diagnostic-content \{[^}]*max-width: var\(--vant-side\)/);
  assert.match(homeStyles, /\.vant-final-diagnostic-ornament \{ display: none; \}/);

  // Sem logo ao centro, a faixa desaparece e o conteudo volta a largura total.
  assert.match(homeStyles, /@media \(max-width: 1023px\) \{\s*\.vant-presentation \{ --vant-band: 0px; \}/);
});

test('sections reveal their parts in order, only once', () => {
  // Etiqueta -> titulo -> texto/CTA -> cards.
  const delays = ['eyebrow', 'title', 'body', 'grid'].map((part) => {
    // String.raw: em template literal, \[ e \d viram [ e d, quebrando o regex.
    const rule = homeStyles.match(new RegExp(String.raw`\[data-reveal='` + part + String.raw`'\]\s*\{ transition-delay: (\d+)ms`));
    assert.ok(rule, `falta o atraso de ${part}`);
    return Number(rule[1]);
  });
  assert.deepEqual(delays, [...delays].sort((a, b) => a - b), 'a ordem da revelacao deve ser crescente');
  assert.equal(delays[0], 0);

  // Fade + deslocamento lateral, invertido nas secoes com copy a direita.
  assert.match(homeStyles, /\[data-reveal\] \{\s*opacity: 0;\s*transform: translate3d\(var\(--reveal-shift, -18px\), 0, 0\)/);
  assert.match(homeStyles, /section:nth-of-type\(even\) \[data-reveal\] \{ --reveal-shift: 18px; \}/);

  // Uma unica vez: o observador para de observar a secao revelada.
  assert.match(homePageSource, /observer\.unobserve\(entry\.target\)/);
  assert.match(homePageSource, /data-revealed/);

  // Todas as partes marcadas no JSX.
  ['eyebrow', 'title', 'body', 'grid'].forEach((part) => {
    assert.match(homePageSource, new RegExp('data-reveal="' + part + '"'), `falta marcar ${part}`);
  });
});

test('the journey layers stack above the page without capturing input', () => {
  // grid/fundos < conteudo lateral < esteira < logo < header
  const obj = homeStyles.match(/\.vant-journey-object \{[\s\S]*?[\r\n]\}/);
  assert.ok(obj);
  const objZ = Number(obj[0].match(/z-index: (\d+)/)[1]);
  const rail = homeStyles.match(/\.vant-journey-line \{[\s\S]*?[\r\n]\}/);
  const railZ = Number(rail[0].match(/z-index: (\d+)/)[1]);

  assert.ok(objZ > railZ, 'a logo deve ficar acima da esteira');
    assert.ok(railZ >= 2, 'a coluna deve ficar acima do grid e dos fundos');
  assert.ok(objZ < 50, 'o header (z-50) deve continuar acima da logo');
  assert.match(obj[0], /pointer-events: none/);

  // Centralizacao independente do tamanho, sem margem negativa.
  assert.match(obj[0], /translate\(-50%, -50%\)/);
  assert.doesNotMatch(obj[0], /margin: calc\(var\(--j-size\)/);

  // A profundidade acompanha a logo por toda a pagina.
  assert.doesNotMatch(homeStyles, /not\(\[data-zone='0'\]\)[^{]*\{ display: none/);
});

test('the rail grows with the scroll and pulses with the object', () => {
  // Trecho percorrido cresce do topo para baixo.
  const prog = homeStyles.match(/\.vant-journey-line-progress \{[\s\S]*?[\r\n]\}/);
  assert.ok(prog, 'falta o trecho percorrido da coluna');
  assert.match(prog[0], /transform-origin: 50% 0/);
  assert.match(prog[0], /scaleY\(calc\(.*var\(--j-journey\)/);
  assert.match(journeyLogoSource, /vant-journey-line-progress/);

  // Pulso acompanha a logo na mesma descida.
  const glow = homeStyles.match(/\.vant-journey-line-pulse \{[\s\S]*?[\r\n]\}/);
  assert.match(glow[0], /var\(--j-journey\) \* 26vh/);
  assert.match(glow[0], /animation: vant-journey-pulse/);

  // Sem particulas soltas: o fluxo e o proprio brilho da linha.
  assert.doesNotMatch(homeStyles, /@keyframes vant-journey-flow/);
});

test('each section shifts the perspective of the object', () => {
  const eixos = ['1', '2', '3', '4', '5', '6', '7'].map((zone) => {
    const rule = homeStyles.match(new RegExp(String.raw`\.vant-journey\[data-zone='` + zone + String.raw`'\] \{[^}]*\}`));
    assert.ok(rule, `falta a zona ${zone}`);
    assert.match(rule[0], /--j-rx:/, `zona ${zone} sem inclinacao X`);
    assert.match(rule[0], /--j-ry:/, `zona ${zone} sem rotacao Y`);
    return rule[0].match(/--j-ry: (-?[\d.]+)deg/)[1];
  });
  // Angulos diferentes entre secoes: revela outra face a cada uma.
  assert.ok(new Set(eixos).size > 1, 'as zonas devem variar a perspectiva');
});




test('the object eases into each section with a short camera push', () => {
  assert.match(journeyLogoSource, /--j-push/);
  assert.match(journeyLogoSource, /setTimeout/);
  assert.match(homeStyles, /scale\(calc\(var\(--j-scale\) \* var\(--j-push, 1\)\)\)/);
});

test('a single central line replaces the old column', () => {
  // Nucleo fino + aura larga, sem trilhos paralelos nem bordas laterais.
  assert.match(journeyLogoSource, /vant-journey-beam-face/);
  assert.match(journeyLogoSource, /vant-journey-line-aura/);
  assert.match(homeStyles, /\.vant-journey-beam-face \{[\s\S]*?width: 3px/);
  assert.match(homeStyles, /\.vant-journey-line-aura \{[\s\S]*?linear-gradient\(90deg, transparent/);

  // Nada de estacoes, nos, chips ou particulas soltas.
  ['vant-journey-station', 'vant-journey-column-edge', 'vant-journey-particles',
   'vant-journey-rail'].forEach((antigo) => {
    assert.doesNotMatch(journeyLogoSource, new RegExp(antigo), `${antigo} nao deve existir`);
    assert.doesNotMatch(homeStyles, new RegExp(String.raw`\.` + antigo), `estilo de ${antigo} nao deve existir`);
  });

  // Rastro curto abaixo da logo permanece.
  assert.match(journeyLogoSource, /vant-journey-trail/);
});

test('the inner-section logo grew and gained presence', () => {
  // Opacidade entre 70% e 90% fora da primeira dobra.
  ['1', '2', '3', '4', '5', '6', '7'].forEach((zone) => {
    const rule = homeStyles.match(new RegExp(String.raw`\.vant-journey\[data-zone='` + zone + String.raw`'\] \{[^}]*\}`));
    assert.ok(rule, `falta a zona ${zone}`);
    const opacity = Number(rule[0].match(/--j-opacity: (\.\d+|\d?\.?\d+)/)[1]);
    assert.ok(opacity >= 0.7 && opacity <= 0.9, `zona ${zone} deve ficar entre .70 e .90, veio ${opacity}`);
    const scale = Number(rule[0].match(/--j-scale: (\.\d+|\d?\.?\d+)/)[1]);
    assert.ok(scale >= 0.5, `zona ${zone} deve ter crescido, veio ${scale}`);
  });
});

test('the centre reserves a visual column plus breathing room', () => {
  // Coluna visual entre 260px e 400px.
  // Varias declaracoes de --vant-band existem (a dobra 2 tem a sua).
  // Nenhuma pode passar de 400px, e a principal fica entre 260 e 400.
  const bandas = [...homeStyles.matchAll(/--vant-band: clamp\((\d+)px, [\d.]+vw, (\d+)px\)/g)]
    .map((m) => [Number(m[1]), Number(m[2])]);
  assert.ok(bandas.length > 0, 'a coluna central deve ter largura propria');
  bandas.forEach(([, max]) => assert.ok(max <= 400, `coluna nao pode passar de 400px, veio ${max}`));
  assert.ok(bandas.some(([min, max]) => min >= 260 && max <= 400), 'falta a coluna principal entre 260 e 400px');

  // A trilha das grades reserva coluna + folga dos dois lados.
  assert.match(homeStyles, /--vant-reserved: calc\(var\(--vant-band\) \+ var\(--vant-gutter\) \* 2\)/);
  assert.match(homeStyles, /--vant-side: calc\(\(100% - var\(--vant-reserved\)\) \/ 2\)/);

  // Laterais com minmax(0, 1fr) para nao cortar nem transbordar.
  assert.match(homeStyles, /\.vant-hero-stage \{[\s\S]*?minmax\(0, 1fr\)/);
  // Texto corrido entre 38 e 48 caracteres.
  assert.match(homeStyles, /max-width: min\(4[0-8]ch, 100%\)/);
  // Titulos com clamp para caberem na altura util.
  assert.match(homeStyles, /\.vant-presentation-section h2 \{ font-size: clamp\(/);
});

test('the second fold is an editorial three-area composition', () => {
  // Tres areas, 100svh e nenhum marcador 01-08.
  assert.match(homePageSource, /vant-fold--composed/);
  assert.match(homePageSource, /vant-fold-lead/);
  assert.match(homePageSource, /vant-fold-centre/);
  assert.match(homePageSource, /vant-fold-support/);
  assert.doesNotMatch(homePageSource, /vant-systems-flow|systemsFlow/);
  assert.match(homeStyles, /\.vant-fold--composed \{[\s\S]*?min-height: 100svh/);
  assert.match(homeStyles, /\.vant-fold-stage \{[\s\S]*?minmax\(0, 1\.15fr\) var\(--vant-reserved\) minmax\(0, 1\.3fr\)/);

  // Eyebrow acima do titulo, na esquerda; apoio na direita.
  assert.ok(homePageSource.indexOf("data-reveal=\"eyebrow\"") < homePageSource.indexOf('id="systemic-vision-title"'));
  assert.match(homeStyles, /\.vant-fold-support p \{[\s\S]*?max-width: min\(4[0-5]ch, 100%\)/);

  // A coluna central desta dobra e menor, e --vant-reserved e redeclarado:
  // calc() em custom property resolve no elemento que a define.
  assert.match(homeStyles, /\.vant-fold--composed \{[\s\S]*?--vant-reserved: calc\(var\(--vant-band\) \+ var\(--vant-gutter\) \* 2\)/);
});

test('the central line became an extruded 3D beam', () => {
  assert.match(journeyLogoSource, /BEAM_LAYERS = \d+/);
  assert.match(journeyLogoSource, /vant-journey-beam-side/);
  assert.match(journeyLogoSource, /vant-journey-beam-face/);
  assert.match(journeyLogoSource, /vant-journey-beam-edge/);
  assert.match(journeyLogoSource, /vant-journey-beam-shadow/);

  assert.match(homeStyles, /\.vant-journey-line \{[\s\S]*?perspective:/);
  assert.match(homeStyles, /\.vant-journey-beam \{[\s\S]*?transform-style: preserve-3d/);
  assert.match(homeStyles, /\.vant-journey-beam-side \{[\s\S]*?translateZ/);

  // Oscilacao lenta entre 8 e 14 graus, nunca 360.
  const sway = homeStyles.match(/@keyframes vant-beam-sway \{[\s\S]*?[\r\n]\}/);
  assert.ok(sway, 'falta a oscilacao da haste');
  const angulos = [...sway[0].matchAll(/rotate[YZ]\((-?[\d.]+)deg\)/g)].map((m) => Math.abs(Number(m[1])));
  assert.ok(Math.max(...angulos) <= 14, `oscilacao deve ficar ate 14 graus, veio ${Math.max(...angulos)}`);
  assert.doesNotMatch(sway[0], /360deg/);
});

test('entering a section ignites the beam, then the logo, then the text', () => {
  // Uma vez por secao: o Set impede repetir na mesma visita.
  assert.match(journeyLogoSource, /const ignited = new Set\(\)/);
  assert.match(journeyLogoSource, /ignited\.has\(index\)/);
  assert.match(journeyLogoSource, /data-igniting|igniting/);

  // Haste acende, logo se aproxima com atraso, texto de apoio por ultimo.
  assert.match(homeStyles, /@keyframes vant-beam-ignite/);
  assert.match(homeStyles, /\[data-igniting='true'\] \.vant-journey-enter \{[\s\S]*?vant-journey-approach/);
  assert.match(homeStyles, /@keyframes vant-journey-approach/);
  assert.match(homeStyles, /\[data-reveal='support'\] \{ transition-delay: (\d+)ms/);

  const apoio = Number(homeStyles.match(/\[data-reveal='support'\] \{ transition-delay: (\d+)ms/)[1]);
  const titulo = Number(homeStyles.match(/\[data-reveal='title'\]\s*\{ transition-delay: (\d+)ms/)[1]);
  assert.ok(apoio > titulo, 'o apoio deve entrar depois do titulo');
});
