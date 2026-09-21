import { useEffect, useRef, useState } from 'react';

const LOGO_SOURCE = '/assets/brand/vant-logo-official.png';
// Parede de extrusao de cada simbolo. Menos camadas por simbolo porque agora
// existe um por secao, e nao um unico objeto viajando.
const DEPTH_LAYERS = 5;

/*
  Deslocamento horizontal do simbolo em cada dobra, em fracao da largura util.
  A alternancia e o que desenha o zigue-zague; o caminho passa pelo centro de
  cada simbolo, entao os dois vem sempre da mesma lista.
*/
const OFFSETS = [0, 0.15, -0.15, 0.09, -0.13, 0.13, -0.09, 0];

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
      const width = presentation.offsetWidth;
      const height = presentation.offsetHeight;

      // Amplitude menor em telas estreitas: o zigue-zague existe, mas nao
      // empurra o simbolo para cima do texto.
      const narrow = window.innerWidth < 1024;
      const amplitude = narrow ? 0.34 : 1;

      const anchors = sections.map((section, index) => {
        const rect = section.getBoundingClientRect();
        const offset = (OFFSETS[index % OFFSETS.length] || 0) * amplitude;
        // A composicao da secao segue o trajeto: o texto vai para o lado
        // oposto ao simbolo daquela dobra.
        section.dataset.symbolSide =
          offset > 0.02 ? 'right' : offset < -0.02 ? 'left' : 'centre';

        return {
          x: width / 2 + offset * width,
          y: rect.top + window.scrollY - base + rect.height / 2,
        };
      });

      setGeometry({ width, height, d: buildPath(anchors), anchors });
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
