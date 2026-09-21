import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import VantLogo from './VantLogo.jsx';

// Âncoras reais da home. Nenhum item aponta para rota ou seção inexistente.
const navItems = [
  { label: 'Como funciona', to: '/#como-funciona' },
  { label: 'Soluções', to: '/#solucoes' },
  { label: 'Especialistas', to: '/#especialistas' },
];

const diagnosticCta = { label: 'Fazer diagnóstico', to: '/diagnostico' };

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const location = useLocation();

  function closeMenu() {
    setIsMenuOpen(false);
  }

  // Escape fecha o menu e devolve o foco ao botão que o abriu.
  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Clicar na âncora já ativa não muda a URL, então o scroll não dispararia
  // sozinho: reposiciona na mão para o link continuar previsível.
  function handleAnchorClick(event, to) {
    closeMenu();
    const [pathname, hash] = to.split('#');
    const samePlace = location.pathname === pathname && location.hash === `#${hash}`;
    if (!samePlace) {
      return;
    }

    const target = document.getElementById(hash);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ block: 'start' });
    }
  }

  function isAnchorActive(to) {
    const [pathname, hash] = to.split('#');
    return location.pathname === pathname && location.hash === `#${hash}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[58px] items-center justify-between gap-4 py-2">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <VantLogo size={46} />
            <div className="flex flex-col">
              <span className="brand-title text-xs font-bold leading-none text-white sm:text-sm">
                VANT.BUSINESS
              </span>
              <span className="mt-1 hidden text-[9px] uppercase tracking-[0.2em] text-[var(--vant-accent)] sm:block">
                Estruture . Organize . Conecte.
              </span>
            </div>
          </Link>

          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-[#a6a6a6] lg:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={(event) => handleAnchorClick(event, item.to)}
                aria-current={isAnchorActive(item.to) ? 'true' : undefined}
                className={`border-b px-3 py-2 font-semibold transition ${
                  isAnchorActive(item.to)
                    ? 'border-white text-white'
                    : 'border-transparent hover:border-white/35 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to={diagnosticCta.to}
            onClick={closeMenu}
            className="brand-button-secondary !hidden px-5 py-2 text-[11px] lg:!inline-flex"
          >
            {diagnosticCta.label} ›
          </Link>

          <button
            type="button"
            ref={menuButtonRef}
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            onClick={() => setIsMenuOpen((v) => !v)}
            className="inline-flex border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/45 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
          >
            {isMenuOpen ? 'Fechar' : 'Menu'}
          </button>
        </div>

        {/* Sempre no DOM para que aria-controls aponte para um alvo existente. */}
        <nav
          id="mobile-menu"
          aria-label="Navegação principal (mobile)"
          hidden={!isMenuOpen}
          /* A classe de display precisa acompanhar o atributo `hidden`: uma
             classe `grid` fixa venceria o `display:none` do user agent. */
          className={`${isMenuOpen ? 'grid' : 'hidden'} gap-2 border-t border-white/10 py-3 text-sm text-[#c9c9c9] lg:hidden`}
        >
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={(event) => handleAnchorClick(event, item.to)}
              aria-current={isAnchorActive(item.to) ? 'true' : undefined}
              className={`border px-4 py-3 transition ${
                isAnchorActive(item.to)
                  ? 'border-white/45 bg-white/[0.06] text-white'
                  : 'border-white/10 bg-black/80 hover:border-white/25 hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to={diagnosticCta.to}
            onClick={closeMenu}
            className="brand-button-primary px-4 py-3 text-center text-xs"
          >
            {diagnosticCta.label} ›
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
