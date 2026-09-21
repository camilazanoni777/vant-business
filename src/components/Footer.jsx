import { Link } from 'react-router-dom';
import VantLogo from './VantLogo.jsx';

// Somente destinos reais: rotas existentes e âncoras publicadas na home.
const footerLinks = [
  { label: 'Início', to: '/' },
  { label: 'Como funciona', to: '/#como-funciona' },
  { label: 'Soluções', to: '/#solucoes' },
  { label: 'Especialistas', to: '/#especialistas' },
  { label: 'Diagnóstico', to: '/diagnostico' },
];

function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <VantLogo size={48} />
            <div>
              <p className="brand-title text-sm font-bold text-white">VANT.BUSINESS</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--vant-accent)]">
                Estruture . Organize . Conecte.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-[#a6a6a6] leading-relaxed">
            Soluções digitais para presença, captação, atendimento, automação e crescimento.
          </p>
        </div>
        <div>
          <p className="brand-kicker mb-3">Navegação</p>
          <ul className="space-y-2 text-sm text-[#a6a6a6]">
            {footerLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="brand-kicker mb-3">Contato</p>
          <p className="text-sm text-[#a6a6a6]">
            Por Victor Hugo — desenvolvedor de automação e IA.
          </p>
          <p className="mt-2 text-xs text-[#6f6f6f]">
            Diagnóstico, estruturação e implementação para empresas que querem crescer no digital.
          </p>
          <Link to="/diagnostico" className="brand-button-secondary mt-4 inline-flex px-5 py-2 text-[11px]">
            Fazer diagnóstico ›
          </Link>
          <Link
            to="/admin-vant?view=login"
            className="mt-6 block text-[10px] lowercase text-[#6f6f6f] transition hover:text-[#a6a6a6]"
          >
            admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
