const logoSources = {
  official: '/assets/brand/vant-logo-official.png',
};

function VantLogo({
  size = 40,
  width,
  height,
  variant = 'official',
  alt = '',
  className = '',
}) {
  const source = logoSources[variant] || logoSources.official;
  const resolvedSize = typeof size === 'number' ? `${size}px` : size;
  const resolvedWidth = width || resolvedSize;
  const resolvedHeight = height || resolvedSize;

  return (
    <img
      src={source}
      alt={alt}
      width={typeof width === 'number' ? width : typeof size === 'number' ? size : undefined}
      height={typeof height === 'number' ? height : typeof size === 'number' ? size : undefined}
      decoding="async"
      className={`shrink-0 object-contain ${className}`.trim()}
      style={{ width: resolvedWidth, height: resolvedHeight }}
    />
  );
}

export default VantLogo;
