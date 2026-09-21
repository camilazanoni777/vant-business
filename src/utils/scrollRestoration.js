export function scrollToTopOnRouteChange(previousPathname, currentPathname, currentHash = '', targetWindow = window) {
  if (!targetWindow) {
    return;
  }

  const hashTarget = String(currentHash || '').replace(/^#/, '');
  if (hashTarget && targetWindow.document?.getElementById) {
    const element = targetWindow.document.getElementById(hashTarget);
    if (element?.scrollIntoView) {
      element.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }
  }

  if (previousPathname === currentPathname) {
    return;
  }

  if (targetWindow.scrollTo) {
    targetWindow.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }
}
