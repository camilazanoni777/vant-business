import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const headerSource = readFileSync(new URL('../src/components/Header.jsx', import.meta.url), 'utf8');
const footerSource = readFileSync(new URL('../src/components/Footer.jsx', import.meta.url), 'utf8');
const blueprintSource = readFileSync(new URL('../docs/vant-v2-blueprint.md', import.meta.url), 'utf8');
const readmeSource = readFileSync(new URL('../README.md', import.meta.url), 'utf8');

test('v2 blueprint documents the commercial route contract', () => {
  assert.match(blueprintSource, /\| `\/solucoes` \| Service areas and solution types \|/);
  assert.match(blueprintSource, /\| `\/diagnostico` \| Commercial briefing form \|/);
  assert.match(blueprintSource, /Cases page is preserved in `draft\/vant-cases-page` and is not published in this release/);
  assert.match(blueprintSource, /visitor -> positioning -> solution\/diagnosis -> briefing -> lead -> admin/);
});

test('app exposes v2 public routes and keeps old routes as redirects', () => {
  assert.match(appSource, /path="\/solucoes"/);
  assert.match(appSource, /path="\/diagnostico"/);
  assert.doesNotMatch(appSource, /path="\/cases"/);
  assert.match(appSource, /path="\/solucoes-digitais" element={<Navigate to="\/diagnostico" replace \/>}/);
  assert.match(appSource, /path="\/automatize" element={<Navigate to="\/diagnostico" replace \/>}/);
  assert.match(appSource, /path="\/conversao" element={<Navigate to="\/solucoes" replace \/>}/);
  assert.match(appSource, /path="\/recursos" element={<Navigate to="\/solucoes" replace \/>}/);
});

test('navigation points to the v2 commercial routes', () => {
  // Contrato de navegação da fase final: as âncoras publicadas da home levam
  // ao conteúdo, e o CTA de conversão aponta para a rota /diagnostico.
  assert.match(headerSource, /label: 'Soluções', to: '\/#solucoes'/);
  assert.match(headerSource, /label: 'Como funciona', to: '\/#como-funciona'/);
  assert.match(headerSource, /label: 'Especialistas', to: '\/#especialistas'/);
  assert.match(headerSource, /label: 'Fazer diagnóstico', to: '\/diagnostico'/);

  assert.doesNotMatch(headerSource, /to: '\/conversao'/);
  assert.doesNotMatch(headerSource, /to: '\/solucoes-digitais'/);
  assert.doesNotMatch(headerSource, /to: '\/cases'/);
  assert.doesNotMatch(footerSource, /to="\/cases"/);

  // O footer monta a lista a partir de dados, então o contrato vive no array.
  assert.match(footerSource, /\{ label: 'Início', to: '\/' \}/);
  assert.match(footerSource, /\{ label: 'Soluções', to: '\/#solucoes' \}/);
  assert.match(footerSource, /\{ label: 'Diagnóstico', to: '\/diagnostico' \}/);
});

test('README documents VANT v2 as a commercial solutions site', () => {
  assert.match(readmeSource, /VANT v2/);
  assert.match(readmeSource, /diagnostico, estrategia, implementacao e organizacao comercial/);
  assert.ok(readmeSource.includes('/solucoes'));
  assert.ok(readmeSource.includes('Areas de solucao'));
  assert.ok(readmeSource.includes('/diagnostico'));
  assert.ok(readmeSource.includes('Entrada comercial principal'));
  assert.ok(readmeSource.includes('draft/vant-cases-page'));
  assert.doesNotMatch(readmeSource, /Exemplos conceituais/);
  assert.ok(readmeSource.includes('/solucoes-digitais'));
  assert.ok(readmeSource.includes('/conversao'));
  assert.ok(readmeSource.includes('Redireciona para'));
  assert.doesNotMatch(readmeSource, /agencia e plataforma editorial-operacional focada em/);
  assert.doesNotMatch(readmeSource, /testar uma ferramenta recomendada/);
});
