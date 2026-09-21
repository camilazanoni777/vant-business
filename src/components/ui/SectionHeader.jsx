function SectionHeader({ eyebrow, title, subtitle, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">{title}</h2>
      {subtitle ? <p className="max-w-4xl text-sm leading-6 text-slate-300 sm:text-base">{subtitle}</p> : null}
    </div>
  );
}

export default SectionHeader;
