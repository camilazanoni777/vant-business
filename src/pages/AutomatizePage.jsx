import { useState } from 'react';
import VantLogo from '../components/VantLogo.jsx';
import { buildBriefingWhatsAppUrl } from '../utils/briefingWhatsApp.js';

const defaultVantWhatsAppNumber = '5561982099480';

const serviceOptions = [
  'Presenca digital',
  'Captacao de leads',
  'Atendimento e follow-up',
  'Automacao e IA aplicada',
  'Conversao em proposta ou venda',
  'Organizacao interna da operacao',
  'Ainda nao sei',
];

const stageOptions = [
  'Preciso comecar do zero',
  'Ja tenho algo, mas preciso melhorar',
  'Quero reposicionar minha marca',
  'Tenho uma demanda urgente',
];

const budgetOptions = [
  'Ainda quero entender valores',
  'Ate R$ 1.500',
  'R$ 1.500 a R$ 3.000',
  'R$ 3.000 a R$ 6.000',
  'Acima de R$ 6.000',
];

const goalOptions = [
  'Transmitir mais confianca',
  'Gerar mais oportunidades',
  'Passar profissionalismo com atendimento padronizado',
  'Ser encontrado por novos clientes',
  'Ganhar tempo com automacao',
  'Ainda estou definindo isso',
];

const trustPillars = [
  {
    label: 'Estrategia',
    title: 'Diagnostico antes da execucao',
    text: 'Antes de implementar, identificamos onde a jornada comercial realmente quebra.',
  },
  {
    label: 'Atendimento',
    title: 'Entrada preparada',
    text: 'Diagnostico, WhatsApp e proximos passos claros para nenhum contato chegar solto.',
  },
  {
    label: 'Conversao',
    title: 'Acompanhamento real',
    text: 'Fluxo para captar, atender, acompanhar e converter com mais consistencia.',
  },
];

const solutionCards = [
  {
    title: 'Entrada com destino claro',
    text: 'A campanha deixa de mandar pessoas para uma presença improvisada e passa a apontar para uma estrutura pronta para receber, entender e conduzir cada oportunidade.',
    meta: 'Captacao preparada',
  },
  {
    title: 'Diagnostico que qualifica',
    text: 'O primeiro contato ja chega com contexto suficiente para separar curiosidade, oportunidade real, urgencia e melhor proximo passo.',
    meta: 'Entrada comercial',
  },
  {
    title: 'Atendimento que nao perde o timing',
    text: 'WhatsApp, formulario e follow-up trabalham juntos para que o lead nao dependa de memoria, improviso ou resposta tardia.',
    meta: 'Atendimento + follow-up',
  },
  {
    title: 'Conversao com processo',
    text: 'A oportunidade sai do contato inicial com status, pendencias e caminho comercial mais claro para proposta, remarketing ou triagem.',
    meta: 'Conversao organizada',
  },
];

const inputClassName = 'brand-input min-h-[38px] rounded-lg border-white/12 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-[#707070] lg:min-h-[34px] lg:px-3 lg:py-1.5 lg:text-[0.72rem]';
const labelClassName = 'mb-1.5 block text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#a6a6a6] lg:mb-1 lg:text-[0.56rem] lg:tracking-[0.16em]';

function AutomatizePage() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deliveryWarning, setDeliveryWarning] = useState('');
  const [whatsAppUrl, setWhatsAppUrl] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setDeliveryWarning('');
    setIsSubmitting(true);

    const form = e.target;
    const data = new FormData(form);

    const formValues = {
      nome: data.get('nome'),
      empresa: data.get('empresa'),
      instagram: data.get('instagram'),
      email: data.get('email'),
      whatsapp: data.get('whatsapp'),
      solucao: data.get('gargalo'),
      momento: data.get('momento'),
      objetivo: data.get('objetivo'),
      orcamento: data.get('orcamento'),
      descricao: data.get('descricao'),
    };
    const nextWhatsAppUrl = buildBriefingWhatsAppUrl(
      formValues,
      import.meta.env.VITE_VANT_WHATSAPP_NUMBER || defaultVantWhatsAppNumber
    );

    const payload = {
      nome: formValues.nome,
      email: formValues.email,
      whatsapp: formValues.whatsapp,
      ebook: 'diagnostico-vant',
      productTitle: 'Diagnostico VANT',
      leadType: 'service',
      source: 'diagnosis-page',
      metadata: {
        businessName: formValues.empresa,
        instagramHandle: formValues.instagram,
        solutionType: formValues.solucao,
        mainBottleneck: formValues.solucao,
        mainGoal: formValues.objetivo,
        projectStage: formValues.momento,
        budgetRange: formValues.orcamento,
        message: formValues.descricao,
      },
    };

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'Nao foi possivel enviar agora.');
      }

      setWhatsAppUrl(nextWhatsAppUrl);
      form.reset();
      setSent(true);
    } catch (err) {
      setWhatsAppUrl(nextWhatsAppUrl);
      setDeliveryWarning('Nao consegui registrar automaticamente agora, mas seu diagnostico ja esta pronto para continuar pelo WhatsApp.');
      form.reset();
      setSent(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6 lg:-mt-6 lg:max-w-[1180px]">
      <section className="overflow-hidden rounded-none border-y border-white/10 bg-[#050505] sm:border lg:min-h-[520px]">
        <div className="brand-mark-panel px-4 py-8 sm:px-8 lg:grid lg:min-h-[520px] lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.55fr)] lg:items-start lg:gap-8 lg:px-8 lg:py-4 xl:gap-10">
          <div className="lg:pl-2">
            <h1 className="brand-title mt-0 max-w-3xl text-[2.2rem] font-bold leading-[0.98] text-white sm:text-5xl lg:mt-2 lg:max-w-[650px] lg:text-[3rem] xl:text-[3.25rem]">
              Diagnostico VANT
              <span className="brand-metal block">Onde sua empresa <span className="diagnosis-text-accent">perde oportunidades</span> hoje?</span>
            </h1>
            <p className="mt-5 max-w-[600px] text-sm leading-6 text-[#cfcfcf] sm:text-base lg:mt-4 lg:text-[0.82rem] lg:leading-5">
              A VANT identifica se o gargalo esta em <span className="diagnosis-inline-accent">presenca, captacao, atendimento, follow-up, automacao ou conversao</span> antes de sugerir qualquer implementacao.
            </p>
            <p className="mt-2 max-w-[620px] text-sm leading-6 text-[#a6a6a6] lg:text-[0.78rem] lg:leading-5">
              O diagnostico transforma uma entrada solta em contexto comercial: onde a jornada quebra, qual prioridade vem primeiro e qual proximo passo faz sentido.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:mt-6 lg:max-w-[660px] lg:gap-2.5">
              {trustPillars.map((pillar) => (
                <article key={pillar.label} className="diagnosis-card-accent rounded-lg border border-white/10 bg-white/[0.035] p-3 transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.055] lg:min-h-[86px]">
                  <p className="brand-kicker text-[0.55rem] tracking-[0.18em]">{pillar.label}</p>
                  <h2 className="mt-2 text-[0.72rem] font-semibold text-white lg:text-[0.66rem]">{pillar.title}</h2>
                  <p className="mt-1.5 text-[0.66rem] leading-4 text-[#8f8f8f] lg:text-[0.58rem] lg:leading-4">{pillar.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div id="briefing-form" className="diagnosis-panel-accent mt-8 scroll-mt-24 rounded-lg border border-white/10 bg-black/55 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-5 lg:mt-0 lg:scroll-mt-[120px] lg:p-5">
            {sent ? (
              <div className="grid gap-3 py-4 text-center lg:text-left">
                <div>
                  <p className="brand-title text-2xl font-bold text-white">Recebi seu diagnostico</p>
                  <p className="mt-2 text-sm leading-6 text-[#a6a6a6]">Vou analisar onde sua jornada perde oportunidades e qual estrutura precisa vir primeiro.</p>
                  {deliveryWarning ? <p className="mt-3 text-sm leading-6 text-amber-100">{deliveryWarning}</p> : null}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  {whatsAppUrl ? <a href={whatsAppUrl} target="_blank" rel="noreferrer" className="brand-button-primary px-6 py-3 text-xs">Continuar no WhatsApp</a> : null}
                  <button type="button" onClick={() => { setSent(false); setDeliveryWarning(''); setWhatsAppUrl(''); }} className="brand-button-secondary px-6 py-3 text-xs">Enviar outro diagnostico</button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="brand-title text-[0.72rem] font-bold leading-4 text-white">Vamos diagnosticar sua operacao</p>
                    <p className="mt-1 text-[0.64rem] leading-4 text-[#808080]">Entrada rapida para entender onde <span className="diagnosis-inline-accent">oportunidades se perdem</span> antes da proposta.</p>
                  </div>
                  <span className="diagnosis-plus mt-0.5 text-sm">+</span>
                </div>
                <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2 lg:gap-x-2 lg:gap-y-1.5">
                  <div className="sm:col-span-1">
                    <label className={labelClassName} htmlFor="nome">Nome</label>
                    <input id="nome" name="nome" type="text" required placeholder="Como posso te chamar?" className={inputClassName} />
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelClassName} htmlFor="empresa">Empresa</label>
                    <input id="empresa" name="empresa" type="text" placeholder="Nome da sua empresa" className={inputClassName} />
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelClassName} htmlFor="email">E-mail</label>
                    <input id="email" name="email" type="email" required placeholder="seu@email.com" className={inputClassName} />
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelClassName} htmlFor="whatsapp">WhatsApp</label>
                    <input id="whatsapp" name="whatsapp" type="tel" required placeholder="(11) 99999-9999" className={inputClassName} />
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelClassName} htmlFor="instagram">Instagram</label>
                    <input id="instagram" name="instagram" type="text" placeholder="@suaempresa" className={inputClassName} />
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelClassName} htmlFor="gargalo">Gargalo principal</label>
                    <select id="gargalo" name="gargalo" required className={`${inputClassName} appearance-none`}>
                      <option value="">Selecione</option>
                      {serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelClassName} htmlFor="momento">Momento</label>
                    <select id="momento" name="momento" required className={`${inputClassName} appearance-none`}>
                      <option value="">Selecione</option>
                      {stageOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelClassName} htmlFor="objetivo">Objetivo principal</label>
                    <select id="objetivo" name="objetivo" className={`${inputClassName} appearance-none`}>
                      <option value="">Selecione</option>
                      {goalOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClassName} htmlFor="orcamento">Investimento previsto</label>
                    <select id="orcamento" name="orcamento" className={`${inputClassName} appearance-none`}>
                      {budgetOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClassName} htmlFor="descricao">Conte-nos mais sobre seu projeto</label>
                    <textarea id="descricao" name="descricao" required rows={3} placeholder="Hoje, onde as oportunidades se perdem entre trafego, atendimento, follow-up ou conversao?" className={`${inputClassName} min-h-[86px] resize-none py-3 lg:min-h-[76px] lg:py-2`} />
                  </div>
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={isSubmitting} className="brand-button-primary h-[40px] w-full px-6 py-3 text-xs disabled:cursor-not-allowed disabled:opacity-60 lg:h-[38px] lg:py-2 lg:text-[0.62rem]">
                      {isSubmitting ? 'Enviando...' : 'Solicitar diagnostico'}
                    </button>
                  </div>
                  {error ? <p className="sm:col-span-2 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100">{error}</p> : null}
                  <p className="sm:col-span-2 text-center text-[0.6rem] leading-4 text-[#777777]">Seus dados estao seguros. Nao compartilhamos suas informacoes.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="brand-panel px-4 py-5 sm:px-8 lg:px-10 lg:py-5">
        <p className="brand-kicker">Resultado</p>
        <h2 className="brand-title mt-3 text-2xl font-bold leading-tight text-white sm:text-4xl">O que a VANT <span className="diagnosis-text-accent">analisa primeiro</span></h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#c9c9c9]">
          A primeira leitura separa <span className="diagnosis-inline-accent">percepcao, entrada comercial, atendimento, follow-up e automacao</span> para definir o que realmente precisa ser implementado.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {solutionCards.map((solution) => (
            <article key={solution.title} className="brand-card diagnosis-card-accent rounded-xl p-4 lg:p-5">
              <p className="diagnosis-meta text-[0.65rem] uppercase tracking-[0.18em]">{solution.meta}</p>
              <h3 className="brand-title mt-3 text-lg font-bold leading-tight text-white">{solution.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#a6a6a6]">{solution.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AutomatizePage;
