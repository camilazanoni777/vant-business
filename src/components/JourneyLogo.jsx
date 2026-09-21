import { useEffect, useRef, useState } from 'react';
import { systemsFlow } from '../data/vantPresentation.js';

const LOGO_SOURCE = '/assets/brand/vant-logo-official.png';
// Parede de extrusao atras da face. Poucas camadas com passo maior custam
// muito menos a compor do que muitas camadas finas, com a mesma espessura.
const DEPTH_LAYERS = 8;

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

    // Cada estacao acompanha o centro da sua secao, entao a logo passa por
    // elas de verdade conforme a pagina rola.
    function placeStations() {
      if (!presentation) return;
      const base = presentation.getBoundingClientRect().top + window.scrollY;
      sections.forEach((section, index) => {
        const station = root.querySelector(`[data-station-index="${index}"]`);
        if (!station) return;
        const rect = section.getBoundingClientRect();
        // 30% da altura: a estacao fica acima da logo quando a secao esta centrada.
        const centre = rect.top + window.scrollY - base + rect.height * 0.3;
        station.style.setProperty('--station-top', `${Math.round(centre)}px`);
        station.dataset.docTop = String(Math.round(centre));
      });
    }

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

      // O rotulo nao pode ficar sob a face da logo: apaga quando ela se aproxima.
      const presTop = presentation ? presentation.getBoundingClientRect().top + window.scrollY : 0;
      const logoY = viewport / 2 + targetJourney * viewport * 0.26;
      root.querySelectorAll('.vant-journey-station').forEach((station) => {
        const docTop = Number(station.dataset.docTop || 0);
        const stationY = docTop + presTop - window.scrollY;
        station.dataset.near = Math.abs(stationY - logoY) < viewport * 0.22 ? 'true' : 'false';
      });

      if (index !== currentZone) {
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
      placeStations();
      measure();
    }

    if (hasFinePointer) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    placeStations();
    measure();
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(pushTimer);
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
      {/* Coluna: trilho industrial, rota de dados e estrutura de crescimento. */}
      <div className="vant-journey-column">
        <span className="vant-journey-column-grid" />
        <span className="vant-journey-column-edge vant-journey-column-edge--left" />
        <span className="vant-journey-column-edge vant-journey-column-edge--right" />
        <span className="vant-journey-core" />
        {/* Trecho ja percorrido: cresce do topo conforme o scroll avanca. */}
        <span className="vant-journey-core-progress" />
        <span className="vant-journey-particles" />
        <span className="vant-journey-pulse" />
      </div>

      {/* Estacoes ancoradas ao centro de cada secao. */}
      <ol className="vant-journey-stations">
        {systemsFlow.map((name, index) => (
          <li
            key={name}
            className="vant-journey-station"
            data-station-index={index}
            data-state={index < activeZone ? 'done' : index === activeZone ? 'current' : 'ahead'}
            data-side={index % 2 === 0 ? 'left' : 'right'}
          >
            <span className="vant-journey-station-connector" />
            <span className="vant-journey-station-node" />
            <span className="vant-journey-station-label">
              <b>{String(index + 1).padStart(2, '0')}</b>
              {name}
            </span>
          </li>
        ))}
      </ol>

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
