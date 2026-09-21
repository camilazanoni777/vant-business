import assert from 'node:assert/strict';
import test from 'node:test';

import { getLeadNotificationEmail, hasEmailConfig } from '../api/_mailer.js';

test('detects Resend email configuration without SMTP credentials', () => {
  const original = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    LEAD_NOTIFY_EMAIL: process.env.LEAD_NOTIFY_EMAIL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  };

  try {
    process.env.RESEND_API_KEY = 're_test_key';
    process.env.EMAIL_FROM = 'VANT Business <noreply@vant.business>';
    process.env.LEAD_NOTIFY_EMAIL = 'victor@example.com';
    delete process.env.ADMIN_EMAIL;

    assert.equal(hasEmailConfig(), true);
    assert.equal(getLeadNotificationEmail(), 'victor@example.com');
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
});

test('falls back to admin email for lead notifications', () => {
  const original = {
    LEAD_NOTIFY_EMAIL: process.env.LEAD_NOTIFY_EMAIL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  };

  try {
    delete process.env.LEAD_NOTIFY_EMAIL;
    process.env.ADMIN_EMAIL = 'admin@example.com';

    assert.equal(getLeadNotificationEmail(), 'admin@example.com');
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
});

