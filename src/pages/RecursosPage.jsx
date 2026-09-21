import { Link } from 'react-router-dom';
import VantLogo from '../components/VantLogo.jsx';

const heroSignals = ['Presença digital', 'Atendimento', 'Automação', 'Conversão'];

const journeyBreak = [
  {
    label: '01',
    title: 'Existe interesse',
    text: 'A empresa recebe visitas, mensagens, indicações e cliques, mas nem todo interesse vira uma oportunidade clara.',
  },
  {
    label: '02',
    title: 'Falta estrutura',
    text: 'Cada canal funciona de um jeito e o contato depende de improviso, memória ou resposta manual.',
  },
  {
    label: '03',
    title: 'A decisão trava',
    text: 'Sem triagem, contexto e próximo passo, o cliente perde ritmo e a empresa perde previsibilidade.',
  },
];

const pillars = [
  {
    title: 'Captar',
    text: 'Transformamos presença digital em entrada comercial rastreável, com contexto e intenção claros.',
    examples: 'Site • Landing page • Instagram • Formulário',
  },
  {
    title: 'Atender',
    text: 'Padronizamos a primeira resposta, coletamos o essencial e deixamos o atendimento pronto para decidir.',
    examples: 'WhatsApp • Briefing • Qualificação • Próximo passo',
  },
  {
    title: 'Converter',
    text: 'Criamos acompanhamento, registros e automações para manter a oportunidade viva até virar decisão.',
    examples: 'Follow-up • Dados • Proposta • Conversão',
  },
];

const transformations = [
  ['Site apenas apresenta', 'Site também identifica e capta oportunidades'],
  ['WhatsApp acumula mensagens', 'Cada contato entra em um processo e recebe um próximo passo'],
  ['Informações ficam espalhadas', 'Dados importantes ficam organizados'],
  ['A equipe precisa lembrar do follow-up', 'O processo acompanha as oportunidades automaticamente'],
  ['O cliente pergunta o que acontece agora', 'A jornada deixa claro o próximo passo'],
  ['Decisões são tomadas no achismo', 'A operação começa a gerar dados'],
];

function RecursosPage() {
  return (
    <div className="conversion-page mx-auto max-w-7xl lg:-mt-6">
      <section className="conversion-hero lg:-mt-4">
        <div className="conversion-hero-copy">
          <div>
            <h1 className="conversion-title brand-title">
              Estrutura digital para <span className="conversion-text-accent">captar, atender e converter</span> com mais organização.
            </h1>
            <p className="conversion-lead">
              A VANT conecta <span className="conversion-inline-accent">site, WhatsApp, dados e automação</span> em uma jornada clara para cada oportunidade comercial.
            </p>

            <div className="conversion-actions flex flex-col gap-3 sm:flex-row">
              <Link to="/diagnostico#briefing-form" className="brand-button-primary px-6 py-3 text-xs">
                Solicitar análise da operação
              </Link>
              <a href="#como-resolvemos" className="brand-button-secondary px-6 py-3 text-xs">
                Como funciona
              </a>
            </div>

            <div className="conversion-hero-line" aria-label="Serviços conectados">
              {heroSignals.map((signal) => (
                <span key={signal}>{signal}</span>
              ))}
            </div>
          </div>

          <div className="conversion-signature">
            <VantLogo size={48} />
            <span />
            <p>Estruture . Organize . Conecte.</p>
          </div>
        </div>

        <aside className="conversion-visual">
          <div className="conversion-pipeline" aria-label="Fluxo da VANT">
            <div className="conversion-pipeline-head">
              <div className="conversion-pipeline-logo">
                <VantLogo size={82} />
              </div>
              <p className="brand-title text-sm font-bold text-white">Jornada organizada</p>
              <p className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-[#7f7f7f]">
                captar → atender → converter
              </p>
            </div>

            <div className="conversion-outcomes">
              {pillars.map((item, index) => (
                <div key={item.title} className="conversion-outcome-row">
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  <span>
                    <strong>{item.title}</strong>
                    <em>{item.text}</em>
                  </span>
                  <span aria-hidden="true">→</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section id="como-resolvemos" className="conversion-system">
        <div className="conversion-system-intro">
          <p className="brand-kicker">O problema</p>
          <h2 className="brand-title mt-3 text-3xl font-bold leading-tight text-white">
            O problema não é falta de ferramenta. É a falta de uma <span className="conversion-inline-accent">jornada clara entre interesse e venda</span>.
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#a6a6a6]">
            O cliente pode chegar pelo site, Instagram, anúncio, WhatsApp ou indicação. A perda acontece quando cada entrada vira uma conversa solta, sem triagem, prioridade ou próximo passo.
          </p>
          <p className="conversion-highlight">
            A VANT estrutura esse caminho para que presença digital, atendimento, automação e acompanhamento trabalhem juntos como uma operação comercial.
          </p>
        </div>

        <div className="conversion-path-grid">
          {journeyBreak.map((item, index) => {
            const pillar = pillars[index];

            return (
              <article key={item.title} className="conversion-path-card">
                <div>
                  <small>{item.label}</small>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>

                <span className="conversion-path-bridge">A VANT estrutura</span>

                <div>
                  <strong>{pillar.title}</strong>
                  <p>{pillar.text}</p>
                  <em>{pillar.examples}</em>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="conversion-before-after">
        <div className="conversion-compare-head">
          <p className="brand-kicker">O que muda na prática</p>
          <h2 className="brand-title mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            A operação deixa de depender de mensagens soltas e passa a <span className="conversion-inline-accent">conduzir oportunidades</span>.
          </h2>
        </div>

        <div className="conversion-compare-list">
          {transformations.map(([before, after], index) => (
            <article key={before} className="conversion-compare-row">
              <small>{String(index + 1).padStart(2, '0')}</small>
              <p>
                <span>Antes</span>
                {before}
              </p>
              <p>
                <span>Com a VANT</span>
                {after}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="conversion-final-cta">
        <p className="brand-kicker">Próximo passo</p>
        <h2 className="brand-title mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl">
          Onde sua empresa está <span className="conversion-inline-accent">perdendo oportunidades</span> hoje?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#a6a6a6]">
          Pode ser no <span className="conversion-inline-accent">site</span>. No <span className="conversion-inline-accent">WhatsApp</span>. No <span className="conversion-inline-accent">atendimento</span>. No acompanhamento. Ou na falta de conexão entre tudo isso.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#d8d8d8]">
          A VANT analisa a jornada atual e identifica o que realmente precisa ser melhorado.
        </p>
        <Link to="/diagnostico#briefing-form" className="brand-button-primary mt-6 px-7 py-3 text-xs">
          Solicitar uma análise da minha operação
        </Link>
        <span>Sem pacote genérico. Primeiro entendemos o problema.</span>
      </section>
    </div>
  );
}

export default RecursosPage;
