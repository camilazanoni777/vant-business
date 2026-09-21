import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const asset = (path) => new URL('../public/assets/brand/' + path, import.meta.url);

const logoSource = readFileSync(
  new URL('../src/components/VantLogo.jsx', import.meta.url),
  'utf8'
);

const headerSource = readFileSync(
  new URL('../src/components/Header.jsx', import.meta.url),
  'utf8'
);

const footerSource = readFileSync(
  new URL('../src/components/Footer.jsx', import.meta.url),
  'utf8'
);

const homeSource = readFileSync(
  new URL('../src/pages/HomePage.jsx', import.meta.url),
  'utf8'
);

const cssSource = readFileSync(
  new URL('../src/index.css', import.meta.url),
  'utf8'
);

test('VANT uses one official logo asset as the brand source of truth', () => {
  assert.equal(existsSync(asset('vant-logo-official.png')), true);
  [
    'vant-identity-2026-green-board.png',
    'vant-logo-primary.png',
    'vant-logo-reversed.png',
    'vant-symbol-reversed.png',
    'vant-favicon.png',
  ].forEach((fileName) => {
    assert.equal(existsSync(asset(fileName)), false, `${fileName} should live only in the archive branch`);
  });
});

test('VANT logo component exposes only the official logo from one source of truth', () => {
  assert.match(logoSource, /official:\s*'\/assets\/brand\/vant-logo-official\.png'/);
  assert.doesNotMatch(logoSource, /vant-logo-primary/);
  assert.doesNotMatch(logoSource, /vant-logo-reversed/);
  assert.doesNotMatch(logoSource, /vant-symbol-reversed/);
  assert.doesNotMatch(logoSource, /symbolHero/);
});

test('public brand surfaces use the official identity language', () => {
  assert.match(cssSource, /--vant-accent:\s*#9bdc00/);
  assert.match(headerSource, /Estruture \. Organize \. Conecte\./);
  assert.match(footerSource, /Estruture \. Organize \. Conecte\./);
  assert.match(homeSource, /Estruture \. Organize \. Conecte\./);
  assert.doesNotMatch(homeSource, /reference-kicker-logo/);
  assert.doesNotMatch(homeSource, /variant="symbolReversed"/);
});
