import { useState } from 'react';

function ToolLogo({ tool, className = '' }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className={`tool-logo-frame ${className}`} aria-hidden="true">
      {tool.logo && !failed ? (
        <span className="tool-logo-plate">
          <img
            src={tool.logo}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
          />
        </span>
      ) : (
        <span className="tool-logo-fallback">{tool.emoji}</span>
      )}
    </span>
  );
}

export default ToolLogo;
