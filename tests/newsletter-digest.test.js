import assert from 'node:assert/strict';
import test from 'node:test';

import { selectDigestRecipients } from '../api/newsletter-digest.js';

test('selects unique recurring newsletter recipients by email', () => {
  const recipients = selectDigestRecipients([
    {
      nome: 'Ana',
      email: 'ana@exemplo.com',
      lead_type: 'newsletter',
      newsletter_opt_in: true,
    },
    {
      nome: 'Ana Ebook',
      email: 'ana@exemplo.com',
      lead_type: 'ebook',
      newsletter_opt_in: true,
    },
    {
      nome: 'Bruno',
      email: 'bruno@exemplo.com',
      lead_type: 'ebook',
      newsletter_opt_in: true,
    },
  ]);

  assert.deepEqual(recipients, [
    { nome: 'Ana', email: 'ana@exemplo.com' },
    { nome: 'Bruno', email: 'bruno@exemplo.com' },
  ]);
});

test('normalizes recipient emails, skips empty emails, and falls back to a default name', () => {
  const recipients = selectDigestRecipients([
    {
      nome: '   ',
      email: 'CARLA@EXEMPLO.COM ',
      lead_type: 'newsletter',
      newsletter_opt_in: true,
    },
    {
      nome: 'Ignorar',
      email: '   ',
      lead_type: 'newsletter',
      newsletter_opt_in: true,
    },
    {
      nome: 'Carla Blog',
      email: 'carla@exemplo.com',
      lead_type: 'ebook',
      newsletter_opt_in: true,
    },
  ]);

  assert.deepEqual(recipients, [{ nome: 'Leitor VANT', email: 'carla@exemplo.com' }]);
});

test('keeps a real newsletter name when a duplicate newsletter row falls back to the default name', () => {
  const recipients = selectDigestRecipients([
    {
      nome: 'Ana Clara',
      email: 'ana@exemplo.com',
      lead_type: 'newsletter',
      newsletter_opt_in: true,
    },
    {
      nome: '   ',
      email: 'ana@exemplo.com',
      lead_type: 'newsletter',
      newsletter_opt_in: true,
    },
  ]);

  assert.deepEqual(recipients, [{ nome: 'Ana Clara', email: 'ana@exemplo.com' }]);
});
