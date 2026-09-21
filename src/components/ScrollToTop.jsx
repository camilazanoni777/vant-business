import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTopOnRouteChange } from '../utils/scrollRestoration.js';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    scrollToTopOnRouteChange(previousPathname.current, pathname, hash);
    previousPathname.current = pathname;
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
