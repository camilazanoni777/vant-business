import { useEffect, useRef, useState } from 'react';

const LOGO_SOURCE = '/assets/brand/vant-logo-official.png';
const DEPTH_LAYERS = 8;

// Um unico objeto percorre a pagina. Cada zona corresponde a uma secao e
// define posicao, escala, angulos e opacidade; o CSS interpola entre elas.
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

    function measure() {
      const viewport = window.innerHeight || 1;
      const middle = window.scrollY + viewport / 2;
      targetPage = Math.max(0, Math.min(1, window.scrollY / viewport));

      const scrollable = Math.max(1, document.documentElement.scrollHeight - viewport);
      targetJourney = Math.max(0, Math.min(1, window.scrollY / scrollable));

      // Secao ativa: a que contem o meio da viewport.
      let index = 0;
      sections.forEach((section, i) => {
        const top = section.offsetTop;
        if (middle >= top) {
          index = i;
        }
      });

      const active = sections[index];
      if (active) {
        const local = (middle - active.offsetTop) / Math.max(active.offsetHeight, 1);
        targetFlow = Math.max(0, Math.min(1, local));
      }

      if (index !== currentZone) {
        currentZone = index;
        setZone(index);
      }
    }

    // Deslocamento continuo dentro da secao + parallax, tudo por variavel CSS.
    function render() {
      pointerX += (targetX - pointerX) * 0.06;
      pointerY += (targetY - pointerY) * 0.06;
      flow += (targetFlow - flow) * 0.09;
      page += (targetPage - page) * 0.12;
      journey += (targetJourney - journey) * 0.1;

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

    if (hasFinePointer) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    measure();
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div
      className="vant-journey"
      ref={rootRef}
      aria-hidden="true"
      data-zone={Math.min(zone, TOTAL_ZONES - 1)}
      data-reduced={isReduced ? 'true' : 'false'}
    >
      {/* Esteira: trilho industrial por onde o objeto desce. */}
      <div className="vant-journey-rail">
        <span className="vant-journey-rail-line" />
        <span className="vant-journey-rail-ticks" />
        <span className="vant-journey-rail-glow" />
      </div>

      <div className="vant-journey-object">
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
