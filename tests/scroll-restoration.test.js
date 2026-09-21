import assert from 'node:assert/strict';
import test from 'node:test';

import { scrollToTopOnRouteChange } from '../src/utils/scrollRestoration.js';

test('scrolls to the top when the route pathname changes', () => {
  const calls = [];
  const win = {
    scrollTo(options) {
      calls.push(options);
    },
  };

  scrollToTopOnRouteChange('/blog', '/recursos', '', win);

  assert.deepEqual(calls, [{ top: 0, left: 0, behavior: 'auto' }]);
});

test('scrolls to the anchored element when the route change includes a hash', () => {
  const calls = [];
  const element = {
    scrollIntoView(options) {
      calls.push(options);
    },
  };
  const win = {
    document: {
      getElementById(id) {
        return id === 'briefing-form' ? element : null;
      },
    },
    scrollTo(options) {
      calls.push(options);
    },
  };

  scrollToTopOnRouteChange('/conversao', '/solucoes-digitais', '#briefing-form', win);

  assert.deepEqual(calls, [{ behavior: 'auto', block: 'start' }]);
});

test('scrolls to the anchored element when the initial route has a hash', () => {
  const calls = [];
  const element = {
    scrollIntoView(options) {
      calls.push(options);
    },
  };
  const win = {
    document: {
      getElementById(id) {
        return id === 'especialistas' ? element : null;
      },
    },
  };

  scrollToTopOnRouteChange('/', '/', '#especialistas', win);

  assert.deepEqual(calls, [{ behavior: 'auto', block: 'start' }]);
});

test('does not scroll when the pathname stays the same', () => {
  const calls = [];
  const win = {
    scrollTo(options) {
      calls.push(options);
    },
  };

  scrollToTopOnRouteChange('/blog', '/blog', '', win);

  assert.deepEqual(calls, []);
});
