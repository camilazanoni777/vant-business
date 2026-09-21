import { useEffect, useRef, useState } from 'react';

const LOGO_SOURCE = '/assets/brand/vant-logo-official.png';
// Parede de extrusao atras da face. Poucas camadas com passo maior custam
// muito menos a compor do que muitas camadas finas, com a mesma espessura.
const DEPTH_LAYERS = 8;
// Planos de profundidade da haste central.
const BEAM_LAYERS = 6;

// Uma estacao por secao da jornada.
const TOTAL_ZONES = 8;

function JourneyLogo() {
  const rootRef = useRef(null);
  const [zone, setZone] = useState(0);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setIsReduced(true);
      return undefined;
    }

    const presentation = root.closest('.vant-presentation');
    const sections = presentation
      ? [...presentation.querySelectorAll('.vant-presentation-hero, .vant-presentation-section')]
      : [];

    const hasFinePointer = window.matchMedia?.('(pointer: fine)')?.matches;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let flow = 0;
    let targetFlow = 0;
    // Progresso bruto da pagina, usado so pela primeira dobra.
    let page = 0;
    let targetPage = 0;
    // Progresso ao longo do documento inteiro: alimenta a descida continua.
    let journey = 0;
    let targetJourney = 0;
    let currentZone = 0;
    let pushTimer = 0;
    let igniteTimer = 0;
    const ignited = new Set();

    function measure() {
      const viewport = window.innerHeight || 1;
      const middle = window.scrollY + viewport / 2;
      targetPage = Math.max(0, Math.min(1, window.scrollY / viewport));

      const scrollable = Math.max(1, document.documentElement.scrollHeight - viewport);
      targetJourney = Math.max(0, Math.min(1, window.scrollY / scrollable));

      // Secao ativa: a que contem o meio da viewport.
      let index = 0;
      sections.forEach((section, i) => {
        if (middle >= section.offsetTop) {
          index = i;
        }
      });

      const active = sections[index];
      if (active) {
        const local = (middle - active.offsetTop) / Math.max(active.offsetHeight, 1);
        targetFlow = Math.max(0, Math.min(1, local));
      }

      if (index !== currentZone) {
        // Uma vez por visita: a haste acende e a logo se aproxima.
        if (!ignited.has(index)) {
          ignited.add(index);
          root.dataset.igniting = 'true';
          window.clearTimeout(igniteTimer);
          igniteTimer = window.setTimeout(() => {
            root.dataset.igniting = 'false';
          }, 1500);
        }

        currentZone = index;
        setZone(index);

        // Aproximacao de camera curta ao entrar na secao, com retorno suave.
        root.style.setProperty('--j-push', '1.055');
        window.clearTimeout(pushTimer);
        pushTimer = window.setTimeout(() => {
          root.style.setProperty('--j-push', '1');
        }, 620);
      }
    }

    // Inercia: a logo persegue o alvo em vez de saltar ate ele.
    function render() {
      pointerX += (targetX - pointerX) * 0.06;
      pointerY += (targetY - pointerY) * 0.06;
      flow += (targetFlow - flow) * 0.09;
      page += (targetPage - page) * 0.12;
      journey += (targetJourney - journey) * 0.07;

      root.style.setProperty('--j-pointer-x', pointerX.toFixed(4));
      root.style.setProperty('--j-pointer-y', pointerY.toFixed(4));
      root.style.setProperty('--j-flow', flow.toFixed(4));
      root.style.setProperty('--j-page', page.toFixed(4));
      root.style.setProperty('--j-journey', journey.toFixed(4));

      frame = requestAnimationFrame(render);
    }

    function handlePointerMove(event) {
      const halfWidth = window.innerWidth / 2;
      const halfHeight = window.innerHeight / 2;
      targetX = Math.max(-1, Math.min(1, (event.clientX - halfWidth) / halfWidth));
      targetY = Math.max(-1, Math.min(1, (event.clientY - halfHeight) / halfHeight));
    }

    function handleResize() {
      measure();
    }

    if (hasFinePointer) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    measure();
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(pushTimer);
      window.clearTimeout(igniteTimer);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const activeZone = Math.min(zone, TOTAL_ZONES - 1);

  return (
    <div
      className="vant-journey"
      ref={rootRef}
      aria-hidden="true"
      data-zone={activeZone}
      data-reduced={isReduced ? 'true' : 'false'}
    >
      {/*
        Haste 3D: planos de profundidade em verde-escuro atras de uma face
        frontal verde-lima, com brilho de borda, sombra e halo.
      */}
      <div className="vant-journey-line">
        <div className="vant-journey-beam">
          {Array.from({ length: BEAM_LAYERS }, (_, index) => (
            <span
              key={index}
              className="vant-journey-beam-side"
              style={{ '--layer': index + 1 }}
            />
          ))}
          <span className="vant-journey-beam-face" />
          <span className="vant-journey-beam-edge" />
        </div>
        <span className="vant-journey-beam-shadow" />
        <span className="vant-journey-line-aura" />
        {/* Trecho percorrido: brilho que cresce do topo conforme o scroll. */}
        <span className="vant-journey-line-progress" />
        {/* Pulso que acompanha a altura da logo. */}
        <span className="vant-journey-line-pulse" />
      </div>

      {/* Estacoes ancoradas ao centro de cada secao. */}
      <div className="vant-journey-object">
        {/* Rastro curto: energia deixada no ponto por onde a logo passou. */}
        <span className="vant-journey-trail" />
        <span className="vant-journey-halo" />
        <span className="vant-journey-shadow" />
        <div className="vant-journey-enter">
          <div className="vant-journey-parallax">
            <div className="vant-journey-tilt">
              <div className="vant-journey-float">
                <div className="vant-journey-solid" style={{ '--depth-count': DEPTH_LAYERS }}>
                  {Array.from({ length: DEPTH_LAYERS }, (_, index) => (
                    <span
                      key={index}
                      className="vant-journey-depth"
                      style={{ '--layer': index + 1 }}
                    />
                  ))}
                  <span className="vant-journey-rim" />
                  {/* Face frontal: arte oficial intacta, sem mascara por cima. */}
                  <img
                    className="vant-journey-face"
                    src={LOGO_SOURCE}
                    alt=""
                    width="1024"
                    height="1024"
                    decoding="async"
                  />
                  <span className="vant-journey-fill" />
                  <span className="vant-journey-sheen" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JourneyLogo;
