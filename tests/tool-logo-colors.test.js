import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const cssSource = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');

test('tool logos keep their original colors instead of being grayscale-inverted', () => {
  assert.match(cssSource, /\.tool-logo-frame img\s*\{/);
  assert.doesNotMatch(cssSource, /\.tool-logo-frame img\s*\{[^}]*grayscale\(1\)[^}]*invert\(1\)/s);
  assert.doesNotMatch(cssSource, /\.reference-tool-card:hover \.tool-logo-frame img[^}]*grayscale\(1\)[^}]*invert\(1\)/s);
});
