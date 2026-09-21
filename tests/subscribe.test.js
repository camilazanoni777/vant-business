import assert from 'node:assert/strict';
import test from 'node:test';

import { buildEmailBrandHeaderHtml, buildWelcomeHtml, getSubscriberWriteMode, normalizeSubscribePayload } from '../api/subscribe.js';

test('normalizes service leads with digital solution metadata', () => {
  const payload = normalizeSubscribePayload(
    {
      nome: '  Cliente VANT  ',
      email: 'CLIENTE@EXEMPLO.COM ',
      whatsapp: ' (11) 99999-9999 ',
      leadType: 'service',
      ebook: '',
      productTitle: 'Diagnóstico VANT',
      source: 'diagnosis-page',
      metadata: {
        businessName: 'Studio Exemplo',
        solutionType: 'Atendimento e follow-up',
        instagramHandle: '@studioexemplo',
        budgetRange: 'R$ 1.500 a R$ 3.000',
        projectStage: 'Preciso começar do zero',
        mainBottleneck: 'Atendimento e follow-up',
        message: 'Quero organizar minha entrada comercial.',
      },
    },
    {
      userAgent: 'node-test',
      referer: 'https://vant.business/diagnostico',
    }
  );

  assert.equal(payload.cleanName, 'Cliente VANT');
  assert.equal(payload.cleanEmail, 'cliente@exemplo.com');
  assert.equal(payload.cleanWhatsapp, '(11) 99999-9999');
  assert.equal(payload.cleanLeadType, 'service');
  assert.equal(payload.cleanEbook, 'diagnostico-vant');
  assert.equal(payload.cleanProductTitle, 'Diagnóstico VANT');
  assert.equal(payload.wantsNewsletter, false);
  assert.deepEqual(payload.metadata, {
    businessName: 'Studio Exemplo',
    solutionType: 'Atendimento e follow-up',
    instagramHandle: '@studioexemplo',
    budgetRange: 'R$ 1.500 a R$ 3.000',
    projectStage: 'Preciso começar do zero',
    mainBottleneck: 'Atendimento e follow-up',
    message: 'Quero organizar minha entrada comercial.',
    userAgent: 'node-test',
    referer: 'https://vant.business/diagnostico',
  });
});

test('normalizes newsletter leads from blog signup into recurring newsletter recipients', () => {
  const payload = normalizeSubscribePayload(
    {
      nome: '  Leitora IA ',
      email: 'LEITORA@EXEMPLO.COM ',
      whatsapp: ' 11988887777 ',
      ebook: 'daily-ai-news',
      productTitle: 'Canal diario de noticias de IA',
      leadType: 'newsletter',
      newsletterOptIn: true,
      source: 'blog-hero',
    },
    {
      userAgent: 'node-test',
      referer: 'https://vant.business/blog',
    }
  );

  assert.equal(payload.cleanName, 'Leitora IA');
  assert.equal(payload.cleanEmail, 'leitora@exemplo.com');
  assert.equal(payload.cleanWhatsapp, '11988887777');
  assert.equal(payload.cleanLeadType, 'newsletter');
  assert.equal(payload.cleanEbook, 'daily-ai-news');
  assert.equal(payload.cleanProductTitle, 'Canal diario de noticias de IA');
  assert.equal(payload.wantsNewsletter, true);
  assert.deepEqual(payload.metadata, {
    userAgent: 'node-test',
    referer: 'https://vant.business/blog',
  });
});

test('normalizes newsletter leads without requiring whatsapp for editorial capture', () => {
  const payload = normalizeSubscribePayload(
    {
      nome: '  Leitora Email ',
      email: 'EMAIL@EXEMPLO.COM ',
      whatsapp: ' ',
      ebook: 'daily-ai-news',
      productTitle: 'Canal diario de noticias de IA',
      leadType: 'newsletter',
      newsletterOptIn: true,
      source: 'blog-hero',
    },
    {
      userAgent: 'node-test',
      referer: 'https://vant.business/blog',
    }
  );

  assert.equal(payload.cleanLeadType, 'newsletter');
  assert.equal(payload.cleanEmail, 'email@exemplo.com');
  assert.equal(payload.cleanWhatsapp, '');
  assert.equal(payload.wantsNewsletter, true);
});

test('stores service briefings as history while keeping editorial captures idempotent', () => {
  assert.equal(getSubscriberWriteMode('service'), 'insert');
  assert.equal(getSubscriberWriteMode('newsletter'), 'upsert');
  assert.equal(getSubscriberWriteMode('ebook'), 'upsert');
});

import {
  buildBriefingWhatsAppMessage,
  buildBriefingWhatsAppUrl,
  normalizeWhatsAppNumber,
} from '../src/utils/briefingWhatsApp.js';

test('builds a WhatsApp briefing message from the service form fields', () => {
  const message = buildBriefingWhatsAppMessage({
    nome: 'Cliente VANT',
    empresa: 'Studio Exemplo',
    email: 'cliente@example.com',
    whatsapp: '(11) 99999-9999',
    instagram: '@studioexemplo',
    solucao: 'Atendimento e follow-up',
    momento: 'Ja tenho algo, mas preciso melhorar',
    objetivo: 'Gerar mais contatos e oportunidades',
    orcamento: 'R$ 1.500 a R$ 3.000',
    descricao: 'Os contatos chegam pelo WhatsApp, mas o retorno demora.',
  });

  assert.match(message, /VANT\.Business/);
  assert.match(message, /Nome: Cliente VANT/);
  assert.match(message, /Empresa\/projeto: Studio Exemplo/);
  assert.match(message, /Instagram: @studioexemplo/);
  assert.match(message, /Gargalo principal: Atendimento e follow-up/);
  assert.match(message, /Diagnostico:\nOs contatos chegam pelo WhatsApp, mas o retorno demora\./);
});

test('builds a WhatsApp URL with an optional target number and encoded briefing', () => {
  const url = buildBriefingWhatsAppUrl(
    {
      nome: 'Cliente VANT',
      empresa: 'Studio Exemplo',
      descricao: 'Quero conversar sobre o projeto.',
    },
    '+55 (11) 99999-0000'
  );

  assert.equal(normalizeWhatsAppNumber('+55 (11) 99999-0000'), '5511999990000');
  assert.ok(url.startsWith('https://wa.me/5511999990000?text='));
  assert.ok(decodeURIComponent(url).includes('Empresa/projeto: Studio Exemplo'));
});

test('email brand header uses the VANT logo as a remote image without attachment CID', () => {
  const html = buildEmailBrandHeaderHtml();

  assert.match(html, /VANT Business/);
  assert.match(html, /<img/i);
  assert.match(html, /https:\/\/vant-business-victor-hugos-projects-378ea6a7\.vercel\.app\/assets\/brand\/vant-logo-official\.png/);
  assert.match(html, /gap:18px/);
  assert.match(html, /padding-right:6px/);
  assert.doesNotMatch(html, /cid:vant-logo/);
});

test('welcome confirmation email does not include a reopen ebook link', () => {
  const html = buildWelcomeHtml('Victor', {
    productTitle: 'Teste de envio Resend',
    newsletterOptIn: true,
    newsItems: [],
    ebookUrl: 'https://vant.business/ebook/teste-resend',
  });

  assert.doesNotMatch(html, /Reabrir ebook/i);
  assert.doesNotMatch(html, /https:\/\/vant\.business\/ebook\/teste-resend/);
});
