function ButtonLink({ href, children, variant = 'secondary', external = false, className = '', ariaLabel }) {
  if (!href) {
    return null;
  }

  const variants = {
    primary:
      'border-cyan-300 bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/30 hover:bg-cyan-300',
    secondary:
      'border-white/15 bg-transparent text-slate-100 hover:border-cyan-300/40 hover:bg-cyan-300/10',
    subtle:
      'border-white/10 bg-slate-950/70 text-slate-200 hover:border-white/25 hover:bg-white/10',
  };

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      aria-label={ariaLabel}
      className={`inline-flex min-h-11 items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

export default ButtonLink;
