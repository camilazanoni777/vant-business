import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import VantLogo from '../components/VantLogo.jsx';
import JourneyLogo from '../components/JourneyLogo.jsx';
import TeamCard from '../components/ui/TeamCard.jsx';
import {
  ecosystemNodes,
  growthSystem,
  howWeWorkSteps,
  heroContent,
  finalDiagnosticCta,
  squads,
  studioBusiness,
  systemicVision,
  systemsFlow,
  teamMembers,
} from '../data/vantPresentation.js';

function EcosystemVisual() {
  return (
    <div className="vant-ecosystem" aria-label="Ecossistema VANT: estratégia, marketing, tecnologia, dados, comercial e growth">
      <div className="vant-ecosystem-core">
        <VantLogo size={68} alt="" />
        <strong>VANT</strong>
      </div>
      {ecosystemNodes.map((node, index) => (
        <span key={node} className={`vant-ecosystem-node vant-ecosystem-node--${index}`}>
          {node}
        </span>
      ))}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="vant-presentation-hero vant-hero--composed" aria-labelledby="vant-hero-title">
      <div className="vant-hero-stage">
        <div className="vant-hero-title-area">
          <p className="brand-kicker" data-reveal="eyebrow">{heroContent.eyebrow}</p>
          <h1 id="vant-hero-title" data-reveal="title">{heroContent.title}</h1>
        </div>

        {/* O objeto e fixo e viaja a pagina: aqui so a largura e reservada. */}
        <div className="vant-hero-object-slot" aria-hidden="true" />

        <div className="vant-hero-support">
          <p className="vant-presentation-lead" data-reveal="body">{heroContent.description}</p>
          <div className="vant-presentation-actions" data-reveal="body">
            <Link to={heroContent.primaryCta.href} className="brand-button-primary vant-presentation-button">
              {heroContent.primaryCta.label} <span aria-hidden="true">→</span>
            </Link>
            <a href={heroContent.secondaryCta.href} className="brand-button-secondary vant-presentation-button">
              {heroContent.secondaryCta.label}
            </a>
          </div>
          <p className="vant-presentation-signature" data-reveal="body">Estruture . Organize . Conecte.</p>
        </div>
      </div>

      <JourneyLogo />

      <EcosystemVisual />
    </section>
  );
}

function SystemicVisionSection() {
  return (
    <section className="vant-presentation-section vant-systemic-vision" aria-labelledby="systemic-vision-title">
      <div className="vant-presentation-section-copy">
        <p className="brand-kicker" data-reveal="eyebrow">{systemicVision.eyebrow}</p>
        <h2 id="systemic-vision-title" data-reveal="title">{systemicVision.title}</h2>
        <p>{systemicVision.description}</p>
      </div>
      <ol className="vant-systems-flow" data-reveal="grid" aria-label="Fluxo de crescimento integrado">
        {systemsFlow.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}

function WorkMethodSection() {
  return (
    <section id="como-funciona" className="vant-presentation-section vant-work-method" aria-labelledby="work-method-title">
      <div className="vant-presentation-section-copy">
        <p className="brand-kicker" data-reveal="eyebrow">COMO TRABALHAMOS</p>
        <h2 id="work-method-title" data-reveal="title">Primeiro entendemos. Depois construímos.</h2>
      </div>
      <ol className="vant-method-steps" data-reveal="grid">
        {howWeWorkSteps.map((step) => (
          <li key={step.number}>
            <span>{step.number}</span>
            <div>
              <h3>{step.name}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function BusinessUnitsSection() {
  return (
    <section id="solucoes" className="vant-presentation-section vant-business-units" aria-labelledby="business-units-title">
      <div className="vant-presentation-section-copy">
        <p className="brand-kicker" data-reveal="eyebrow">DUAS FRENTES, UMA ESTRATÉGIA</p>
        <h2 id="business-units-title" data-reveal="title">Uma estratégia. Duas frentes complementares.</h2>
      </div>
      <div className="vant-business-units-grid" data-reveal="grid">
        {studioBusiness.map((unit, index) => (
          <article key={unit.name} className="vant-business-unit-card">
            <p className="vant-business-unit-index">0{index + 1}</p>
            <h3>{unit.name}</h3>
            <p>{unit.promise}</p>
            <ul>
              {unit.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
            </ul>
          </article>
        ))}
      </div>
      <p className="vant-business-units-note">Studio gera e fortalece a demanda. Business organiza, converte e escala.</p>
    </section>
  );
}

function GrowthSystemSection() {
  return (
    <section className="vant-presentation-section vant-growth-system" aria-labelledby="growth-system-title">
      <div className="vant-presentation-section-copy">
        <p className="brand-kicker" data-reveal="eyebrow">DO DIAGNÓSTICO À TRAÇÃO</p>
        <h2 id="growth-system-title" data-reveal="title">VANT Growth System.</h2>
      </div>
      <div className="vant-growth-system-grid" data-reveal="grid">
        {growthSystem.map((item) => (
          <article key={item.letter}>
            <span aria-hidden="true">{item.letter}</span>
            <div>
              <h3>{item.pillar}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ChallengeSquadsSection() {
  return (
    <section className="vant-presentation-section vant-challenge-squads" aria-labelledby="challenge-squads-title">
      <div className="vant-presentation-section-copy">
        <p className="brand-kicker" data-reveal="eyebrow">NÃO EXISTE PACOTE PADRÃO</p>
        <h2 id="challenge-squads-title" data-reveal="title">O projeto é montado de acordo com o desafio.</h2>
      </div>
      <div className="vant-squads-table" data-reveal="grid" role="table" aria-label="Squads por desafio">
        <div className="vant-squads-table-head" role="row">
          <span role="columnheader">Situação</span>
          <span role="columnheader">Competências</span>
          <span role="columnheader">Composição indicativa</span>
        </div>
        {squads.map((squad) => (
          <div key={squad.situation} className="vant-squads-table-row" role="row">
            <p role="cell"><span>Situação</span>{squad.situation}</p>
            <p role="cell"><span>Competências</span>{squad.competencies}</p>
            <p role="cell"><span>Composição indicativa</span>{squad.composition}</p>
          </div>
        ))}
      </div>
      <Link to="/diagnostico" className="brand-button-primary vant-presentation-button vant-intermediate-cta" data-reveal="grid">
        Descobrir meus gargalos <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

function TeamSection() {
  const membersWithPortraits = teamMembers.filter(({ photo }) => photo);

  return (
    <section id="especialistas" className="vant-presentation-section vant-team-section" aria-labelledby="team-title">
      <div className="vant-presentation-section-copy">
        <p className="brand-kicker" data-reveal="eyebrow">ESPECIALISTAS VANT</p>
        <h2 id="team-title" data-reveal="title">Especialistas diferentes. Trabalhando sobre o mesmo resultado.</h2>
        <p>Cada profissional lidera uma competência, mas todos trabalham sobre uma mesma estratégia: gerar resultado real para o cliente.</p>
      </div>
      {membersWithPortraits.length > 0 ? (
        <div className="vant-team-grid" data-reveal="grid">
          {membersWithPortraits.map((member) => <TeamCard key={member.name} member={member} />)}
        </div>
      ) : null}
    </section>
  );
}

function FinalDiagnosticCta() {
  return (
    <section className="vant-presentation-section vant-final-diagnostic-cta" aria-labelledby="final-diagnostic-title">
      <div className="vant-final-diagnostic-ornament" aria-hidden="true" />
      <div className="vant-final-diagnostic-content">
        <p className="brand-kicker" data-reveal="eyebrow">PRÓXIMO PASSO</p>
        <h2 id="final-diagnostic-title" data-reveal="title">{finalDiagnosticCta.title}</h2>
        <p>{finalDiagnosticCta.description}</p>
        <Link to={finalDiagnosticCta.href} className="brand-button-primary vant-presentation-button">
          {finalDiagnosticCta.label} <span aria-hidden="true">→</span>
        </Link>
        <ul className="vant-final-diagnostic-benefits" data-reveal="grid">
          {finalDiagnosticCta.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
        </ul>
      </div>
    </section>
  );
}

// Revela cada secao uma unica vez ao entrar na viewport. O CSS escalona
// etiqueta -> titulo -> texto/CTA -> cards a partir de data-revealed.
function useSectionReveal() {
  useEffect(() => {
    const sections = [...document.querySelectorAll('.vant-presentation-hero, .vant-presentation-section')];
    if (sections.length === 0) {
      return undefined;
    }

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      sections.forEach((section) => section.setAttribute('data-revealed', 'true'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', 'true');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
}

function HomePage() {
  useSectionReveal();

  return (
    <div className="vant-presentation">
      <HeroSection />
      <SystemicVisionSection />
      <WorkMethodSection />
      <BusinessUnitsSection />
      <GrowthSystemSection />
      <ChallengeSquadsSection />
      <TeamSection />
      <FinalDiagnosticCta />
    </div>
  );
}

export default HomePage;
