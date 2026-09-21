function Tag({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'border-white/10 bg-white/5 text-slate-300',
    accent: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100',
  };

  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full border px-3 py-1 text-xs font-medium leading-5 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Tag;
