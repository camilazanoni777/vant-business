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
  new URL('../src/components/JourneyPath.jsx', import.meta.url),
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






test('the mobile menu is really hidden until it is opened', () => {
  // O atributo `hidden` sozinho nao basta: uma classe de display fixa venceria
  // o display:none do user agent e deixaria o menu aberto no carregamento.
  assert.match(headerSource, /\$\{isMenuOpen \? 'grid' : 'hidden'\}/);
  assert.match(headerSource, /hidden=\{!isMenuOpen\}/);
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

test('the journey is one continuous SVG path across every section', () => {
  // Um caminho so, nao um traco por secao.
  assert.match(journeyLogoSource, /buildPath/);
  assert.equal((journeyLogoSource.match(/<svg/g) || []).length, 1);
  assert.match(journeyLogoSource, /let d = `M /);

  // Tres camadas acesas + trilho apagado + pulso.
  ['vant-journey-track', 'vant-journey-glow', 'vant-journey-stroke',
   'vant-journey-core', 'vant-journey-pulse'].forEach((camada) => {
    assert.match(journeyLogoSource, new RegExp(camada), `falta ${camada}`);
    assert.match(homeStyles, new RegExp(String.raw`\.` + camada), `falta o estilo de ${camada}`);
  });

  // O traco principal e mais espesso que a linha antiga (2px).
  const stroke = homeStyles.match(/\.vant-journey-stroke \{[\s\S]*?stroke-width: (\d+)/);
  assert.ok(Number(stroke[1]) >= 5, `traco principal deve ser mais espesso, veio ${stroke[1]}`);
  assert.match(homeStyles, /\.vant-journey-glow \{[\s\S]*?filter: blur/);
});

test('the path zig-zags and passes through each symbol centre', () => {
  // Os mesmos offsets alimentam o caminho e a posicao do simbolo.
  // Os extremos alternam: esquerda ~11% e direita ~89% da viewport.
  const edges = journeyLogoSource.match(/desktop: \[([\d.]+), ([\d.]+)\]/);
  assert.ok(edges, 'faltam os extremos do zigue-zague');
  assert.ok(Number(edges[1]) >= 0.08 && Number(edges[1]) <= 0.12, `extremo esquerdo deve ficar entre 8% e 12%, veio ${edges[1]}`);
  assert.ok(Number(edges[2]) >= 0.88 && Number(edges[2]) <= 0.92, `extremo direito deve ficar entre 88% e 92%, veio ${edges[2]}`);
  // Tablet e mobile tem os seus proprios extremos.
  assert.match(journeyLogoSource, /EDGES\.mobile : vw < 1280 \? EDGES\.tablet : EDGES\.desktop/);
});

test('the path is drawn progressively with the scroll', () => {
  assert.match(journeyLogoSource, /strokeDasharray/);
  assert.match(journeyLogoSource, /strokeDashoffset/);
  assert.match(journeyLogoSource, /length \* \(1 - progress\)/);
  // Pulso percorrendo o caminho.
  assert.match(homeStyles, /@keyframes vant-path-pulse/);
  assert.match(homeStyles, /\.vant-journey-pulse \{[\s\S]*?stroke-dasharray/);
});

test('each symbol spins with the scroll, not on a loop', () => {
  // Rotacao proporcional ao trecho percorrido da secao, entre 90 e 180 graus.
  const giro = journeyLogoSource.match(/ROTATION_PER_SECTION = (\d+)/);
  assert.ok(giro, 'falta a rotacao por secao');
  assert.ok(Number(giro[1]) >= 90 && Number(giro[1]) <= 180,
    `rotacao deve ficar entre 90 e 180 graus, veio ${giro[1]}`);
  assert.match(journeyLogoSource, /--spin/);
  assert.match(homeStyles, /\.vant-journey-symbol-solid \{[\s\S]*?rotateZ\(var\(--spin\)\)/);

  // Sem animacao automatica girando sozinha.
  // Sem animacao automatica: a rotacao vem do scroll.
  const solid = homeStyles.match(/\.vant-journey-symbol-solid \{[\s\S]*?[\r\n]\}/);
  assert.doesNotMatch(solid[0], /animation:/);

  // Inclinacao 3D, foco ao centrar, sombra e halo.
  assert.match(homeStyles, /\.vant-journey-symbol-solid \{[\s\S]*?rotateY/);
  assert.match(homeStyles, /--focus/);
  assert.match(homeStyles, /\.vant-journey-symbol-shadow \{/);
  assert.match(homeStyles, /\.vant-journey-symbol-halo \{/);
});

test('every fold fills the viewport with bigger type', () => {
  assert.match(homeStyles, /\.vant-presentation-section \{[\s\S]*?min-height: 100svh/);

  // Titulos grandes com clamp e entrelinha fechada.
  const h2 = homeStyles.match(/\.vant-presentation-section h2 \{[\s\S]*?[\r\n]\}/);
  assert.ok(h2);
  assert.match(h2[0], /font-size: clamp\([^)]*\)/);
  assert.match(h2[0], /line-height: 1;/);

  // Paragrafos entre 380px e 520px.
  assert.match(homeStyles, /\.vant-fold-support p \{[\s\S]*?max-width: clamp\(380px, [\d.]+vw, 520px\)/);
});

test('the composition follows the path side by side', () => {
  // O lado vem do mesmo offset que desenha o caminho.
  assert.match(journeyLogoSource, /section\.dataset\.symbolSide/);
  assert.match(homeStyles, /\[data-symbol-side='right'\]/);
  assert.match(homeStyles, /\[data-symbol-side='left'\]/);
  assert.match(homeStyles, /\[data-symbol-side='centre'\]/);

  // Nenhuma grade reserva mais a faixa central: o simbolo saiu de la.
  // As grades de conteudo nao reservam mais o centro; so a dobra 2 reserva
  // uma trilha, e ela fica do lado onde o simbolo esta.
  ['vant-method-steps', 'vant-business-units-grid', 'vant-growth-system-grid',
   'vant-team-grid'].forEach((grade) => {
    const regra = homeStyles.match(new RegExp(String.raw`\.` + grade + String.raw` \{[\s\S]*?[\r\n]\}`));
    if (regra) assert.doesNotMatch(regra[0], /var\(--vant-reserved\)/, `${grade} nao deve reservar o centro`);
  });
});

test('reduced motion shows the whole composition, static', () => {
  assert.match(journeyLogoSource, /prefers-reduced-motion: reduce/);
  // Caminho inteiro desenhado, sem animar.
  assert.match(journeyLogoSource, /setProperty\('--path-progress', '1'\)/);
  const blocks = homeStyles.split('@media (prefers-reduced-motion: reduce) {').slice(1);
  const block = blocks.find((b) => b.includes('vant-journey-symbol-solid'));
  assert.ok(block, 'falta o bloco de movimento reduzido da jornada');
  assert.match(block, /transform: none !important/);
  assert.match(block, /opacity: 1 !important/);
});

test('the journey cleans up its listeners and observers', () => {
  assert.match(journeyLogoSource, /cancelAnimationFrame\(frame\)/);
  assert.match(journeyLogoSource, /observer\.disconnect\(\)/);
  ['pointermove', 'scroll', 'resize'].forEach((evento) => {
    // Parenteses precisam ser escapados na RegExp montada por string.
    assert.match(journeyLogoSource, new RegExp(String.raw`removeEventListener\('` + evento), `falta remover ${evento}`);
  });
  assert.match(journeyLogoSource, /\{ passive: true \}/);
});
