import { useEffect, useRef, useState } from 'react';

const LOGO_SOURCE = '/assets/brand/vant-logo-official.png';
// Parede de extrusao de cada simbolo. Menos camadas por simbolo porque agora
// existe um por secao, e nao um unico objeto viajando.
const DEPTH_LAYERS = 5;

/*
  A camada decorativa vive nos extremos: o simbolo alterna entre 8% e 92%
  da largura, sempre respeitando MIN_SYMBOL_EDGE. O conteudo nunca acompanha
  esse movimento - ele fica no container editorial central.
*/
const EDGES = { desktop: [0.08, 0.92], tablet: [0.08, 0.92], mobile: [0.07, 0.93] };

/*
  Em telas estreitas nao cabe simbolo AO LADO do texto: 110px de simbolo mais
  os respiros consomem metade da largura. Entao a linha corre rente a borda e o
  simbolo ocupa a faixa livre entre uma secao e outra - que e justamente onde a
  diagonal ja acontecia.
*/
const COMPACT_MAX = 1100;
// Distancia minima do simbolo ate a borda da tela.
const MIN_SYMBOL_EDGE = 32;
// Folga entre a linha e o inicio do texto (espelhada no CSS via --line-inset).
const BAND_PADDING = 48;

// Quanto cada simbolo gira enquanto a sua secao atravessa a viewport.
const ROTATION_PER_SECTION = 150;

function buildPath(anchors) {
  if (anchors.length < 2) return '';

  // Comeca acima do primeiro ancoradouro e termina abaixo do ultimo, para o
  // caminho nao parecer cortado nas pontas.
  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  let d = `M ${first.x} ${Math.max(0, first.y - 260)}`;
  d += ` L ${first.x} ${first.y}`;

  for (let i = 1; i < anchors.length; i += 1) {
    const from = anchors[i - 1];
    const to = anchors[i];
    // Curvas suaves: controles no meio do trecho vertical, nunca em diagonal
    // reta, para o traco nao virar um raio.
    const mid = (to.y - from.y) / 2;
    d += ` C ${from.x} ${from.y + mid}, ${to.x} ${to.y - mid}, ${to.x} ${to.y}`;
  }

  d += ` L ${last.x} ${last.y + 260}`;
  return d;
}

function JourneyPath() {
  const rootRef = useRef(null);
  const pathsRef = useRef([]);
  // Sonda invisivel: devolve --sym-size ja resolvido pelo CSS.
  const metricRef = useRef(null);
  const [geometry, setGeometry] = useState({ width: 0, height: 0, d: '', anchors: [] });
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const presentation = root.closest('.vant-presentation');
    if (!presentation) return undefined;

    const sections = [...presentation.querySelectorAll('.vant-presentation-hero, .vant-presentation-section')];
    if (sections.length === 0) return undefined;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduced) setIsReduced(true);

    let frame = 0;
    let progress = 0;
    let targetProgress = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    // ---- geometria ----
    function measure() {
      const box = presentation.getBoundingClientRect();
      const base = box.top + window.scrollY;
      /*
        A camada decorativa rompe o container editorial: as posicoes sao em
        fracao da VIEWPORT, nao da largura de .vant-presentation (limitada a
        1280px), senao o simbolo nunca alcancaria os extremos. clientWidth e
        nao 100vw porque 100vw inclui a barra de rolagem e criaria scroll
        horizontal; o alinhamento com a borda da tela vem do offset abaixo.
      */
      const width = document.documentElement.clientWidth;
      root.style.width = `${width}px`;
      root.style.left = `${-box.left}px`;

      const vw = window.innerWidth;
      const compact = vw <= COMPACT_MAX;
      const [near, far] = compact ? EDGES.mobile : vw < 1280 ? EDGES.tablet : EDGES.desktop;

      /*
        O CSS afasta o texto da linha usando este recuo, por isso ele e definido
        antes de medir as secoes - a altura delas depende do padding resultante.
      */
      presentation.style.setProperty('--line-inset', compact ? `${Math.round(width * near)}px` : '0px');
      const symbolSize = metricRef.current?.offsetWidth || 160;

      /*
        Recuo real do centro do simbolo ate a borda, ja garantindo os 32px
        minimos. O CSS deriva a largura do conteudo deste valor, entao existe
        uma unica fonte de verdade para o territorio da decoracao.
      */
      const inset = Math.max(width * near, MIN_SYMBOL_EDGE + symbolSize / 2);
      presentation.style.setProperty('--sym-inset', `${Math.round(inset)}px`);

      const symbols = [];
      const anchors = [];

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const top = rect.top + window.scrollY - base;
        const side = index % 2 === 0 ? 'left' : 'right';
        const x = side === 'left' ? inset : width - inset;

        section.dataset.symbolSide = side;

        if (compact) {
          /*
            O simbolo vai para a faixa superior vazia da secao, encostado na sua
            borda mas sem nunca ser cortado.
          */
          // A linha corre rente a borda; o simbolo ja veio recuado pelo inset.
          const lineX = side === 'left' ? width * near : width * far;
          const symbolY = top + symbolSize / 2 + BAND_PADDING / 2;

          symbols.push({ x, y: symbolY, side });

          // A diagonal passa pelo simbolo e desce rente a borda, fora do texto.
          anchors.push({ x, y: symbolY });
          anchors.push({ x: lineX, y: top + symbolSize + BAND_PADDING });
          anchors.push({ x: lineX, y: top + rect.height - 16 });
          return;
        }

        symbols.push({ x, y: top + rect.height / 2, side });

        /*
          Dois ancoradouros por secao mantem o traco vertical enquanto a dobra
          esta em leitura; a diagonal acontece so no intervalo entre secoes.
        */
        anchors.push({ x, y: top + rect.height * 0.12 });
        anchors.push({ x, y: top + rect.height * 0.88 });
      });

      // A altura so agora: o recuo e o lado da linha ja mudaram o layout.
      setGeometry({ width, height: presentation.offsetHeight, d: buildPath(anchors), anchors: symbols });
    }

    // ---- scroll ----
    function readScroll() {
      const viewport = window.innerHeight || 1;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - viewport);
      targetProgress = Math.max(0, Math.min(1, window.scrollY / scrollable));
    }

    function handlePointerMove(event) {
      const halfWidth = window.innerWidth / 2;
      const halfHeight = window.innerHeight / 2;
      targetX = Math.max(-1, Math.min(1, (event.clientX - halfWidth) / halfWidth));
      targetY = Math.max(-1, Math.min(1, (event.clientY - halfHeight) / halfHeight));
    }

    // Inercia suave: o desenho persegue o alvo e estabiliza ao parar o scroll.
    function render() {
      progress += (targetProgress - progress) * 0.09;
      pointerX += (targetX - pointerX) * 0.06;
      pointerY += (targetY - pointerY) * 0.06;

      root.style.setProperty('--path-progress', progress.toFixed(4));
      root.style.setProperty('--pointer-x', pointerX.toFixed(4));
      root.style.setProperty('--pointer-y', pointerY.toFixed(4));

      pathsRef.current.forEach((path) => {
        if (!path) return;
        const length = path.getTotalLength?.() || 0;
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length * (1 - progress)}`;
      });

      // Rotacao por secao: proporcional ao trecho ja percorrido dela.
      const viewport = window.innerHeight || 1;
      sections.forEach((section, index) => {
        const symbol = root.querySelector(`[data-symbol="${index}"]`);
        if (!symbol) return;
        const rect = section.getBoundingClientRect();
        const local = (viewport / 2 - rect.top) / Math.max(rect.height, 1);
        const clamped = Math.max(-0.5, Math.min(1.5, local));
        symbol.style.setProperty('--spin', `${(clamped - 0.5) * ROTATION_PER_SECTION}deg`);
        // Perto do centro da viewport: escala e brilho sobem um pouco.
        const focus = Math.max(0, 1 - Math.abs(clamped - 0.5) * 2.4);
        symbol.style.setProperty('--focus', focus.toFixed(3));
      });

      frame = requestAnimationFrame(render);
    }

    const hasFinePointer = window.matchMedia?.('(pointer: fine)')?.matches;
    if (hasFinePointer && !reduced) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }
    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });

    measure();
    readScroll();
    if (reduced) {
      // Composicao completa e estatica: caminho inteiro desenhado.
      progress = 1;
      targetProgress = 1;
      root.style.setProperty('--path-progress', '1');
    } else {
      frame = requestAnimationFrame(render);
    }

    // As secoes mudam de altura quando as imagens carregam.
    const observer = new ResizeObserver(measure);
    observer.observe(presentation);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { width, height, d, anchors } = geometry;

  return (
    <div className="vant-journey" ref={rootRef} aria-hidden="true" data-reduced={isReduced ? 'true' : 'false'}>
      <span className="vant-journey-metric" ref={metricRef} />
      {d ? (
        <svg
          className="vant-journey-svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          focusable="false"
        >
          {/* Trecho ainda nao percorrido: presente, porem discreto. */}
          <path className="vant-journey-track" d={d} />
          {/* Tres camadas acesas: glow externo, traco principal e nucleo. */}
          <path className="vant-journey-glow" d={d} ref={(el) => { pathsRef.current[0] = el; }} />
          <path className="vant-journey-stroke" d={d} ref={(el) => { pathsRef.current[1] = el; }} />
          <path className="vant-journey-core" d={d} ref={(el) => { pathsRef.current[2] = el; }} />
          {/* Pulso: um traco curto percorrendo o caminho. */}
          <path className="vant-journey-pulse" d={d} />
        </svg>
      ) : null}

      {anchors.map((anchor, index) => (
        <div
          key={index}
          className="vant-journey-symbol"
          data-symbol={index}
          style={{ '--symbol-x': `${anchor.x}px`, '--symbol-y': `${anchor.y}px` }}
        >
          <span className="vant-journey-symbol-halo" />
          <span className="vant-journey-symbol-shadow" />
          <div className="vant-journey-symbol-solid" style={{ '--depth-count': DEPTH_LAYERS }}>
            {Array.from({ length: DEPTH_LAYERS }, (_, layer) => (
              <span
                key={layer}
                className="vant-journey-symbol-depth"
                style={{ '--layer': layer + 1 }}
              />
            ))}
            <span className="vant-journey-symbol-rim" />
            {/* Face frontal: arte oficial intacta, sem mascara por cima. */}
            <img
              className="vant-journey-symbol-face"
              src={LOGO_SOURCE}
              alt=""
              width="1024"
              height="1024"
              loading="lazy"
              decoding="async"
            />
            <span className="vant-journey-symbol-sheen" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default JourneyPath;
