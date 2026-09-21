export function trackEvent(payload) {
  const body = JSON.stringify({
    ...payload,
    path: payload.path || window.location.pathname,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/track-click', new Blob([body], { type: 'application/json' }));
    return;
  }

  fetch('/api/track-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function trackedToolHref(toolId, source) {
  return `/api/out?kind=tool&id=${encodeURIComponent(toolId)}&source=${encodeURIComponent(source)}`;
}
