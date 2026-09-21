import { createClient } from '@supabase/supabase-js';
import { approvedStatuses, getNewsItems } from './_newsStore.js';
import { getNewsletterIssues, markNewsletterIssueSent, selectDigestIssue } from './_newsletterStore.js';
import { hasEmailConfig, sendEmail } from './_mailer.js';

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    : null;


function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function selectDigestRecipients(subscribers = []) {
  const uniqueRecipients = new Map();

  for (const subscriber of subscribers) {
    const email = String(subscriber?.email || '').trim().toLowerCase();
    if (!email) continue;

    const nome = String(subscriber?.nome || '').trim();
    const currentRecipient = {
      nome: nome || 'Leitor VANT',
      email,
      _isNewsletter: String(subscriber?.lead_type || '').trim().toLowerCase() === 'newsletter',
      _hasRealName: Boolean(nome),
    };

    if (!uniqueRecipients.has(email)) {
      uniqueRecipients.set(email, currentRecipient);
      continue;
    }

    const existing = uniqueRecipients.get(email);
    const shouldReplace =
      (currentRecipient._isNewsletter && !existing._isNewsletter) ||
      (currentRecipient._isNewsletter === existing._isNewsletter && currentRecipient._hasRealName && !existing._hasRealName);

    if (shouldReplace) {
      uniqueRecipients.set(email, currentRecipient);
    }
  }

  return Array.from(uniqueRecipients.values()).map(({ nome, email }) => ({ nome, email }));
}

function buildDigestHtml(nome, digest) {
  const newsHtml = digest.items
    .map(
      (item) => `
        <li style="margin:0 0 18px;padding:0 0 18px;border-bottom:1px solid #e2e8f0;">
          <a href="${escapeHtml(item.link)}" style="font-weight:700;color:#0369a1;text-decoration:none;">${escapeHtml(item.titlePt || item.title)}</a>
          <p style="margin:6px 0 0;color:#475569;font-size:14px;line-height:1.55;">${escapeHtml(item.summaryPt || item.summary || '')}</p>
          <p style="margin:8px 0 0;color:#94a3b8;font-size:12px;">${escapeHtml(item.source || 'Fonte externa')}</p>
        </li>
      `
    )
    .join('');
  const introHtml = digest.intro
    ? `<p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">${escapeHtml(digest.intro)}</p>`
    : '<p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">Curadoria automatizada e revisada antes do envio para manter o canal objetivo.</p>';

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;padding:28px;background:#f8fafc;color:#0f172a;">
      <p style="margin:0 0 8px;color:#0891b2;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">VANT Business</p>
      <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;">${escapeHtml(nome)}, ${escapeHtml(digest.subject)}</h1>
      ${introHtml}
      <ol style="margin:0;padding-left:20px;">${newsHtml}</ol>
      <p style="margin:24px 0 0;color:#64748b;font-size:12px;line-height:1.6;">
        Voce recebeu este email porque entrou no canal de noticias da VANT Business.
      </p>
    </div>
  `;
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  const querySecret = req.query?.secret;
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}` && querySecret !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!supabase || !hasEmailConfig()) {
    return res.status(500).json({ error: 'Ambiente de email ou banco nao configurado' });
  }

  try {
    const news = await getNewsItems(req);
    const approved = (news.items || []).filter((item) => approvedStatuses.includes(item.status));
    const issueResult = await getNewsletterIssues();
    const digest = selectDigestIssue({ issues: issueResult.issues || [], approvedNews: approved });

    if (digest.items.length === 0) {
      return res.status(200).json({
        ok: true,
        sent: 0,
        skipped: true,
        reason: 'Nenhuma noticia aprovada ou edicao agendada para envio.',
        availableForReview: (news.items || []).length,
      });
    }

    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('nome,email,lead_type,newsletter_opt_in')
      .or('newsletter_opt_in.eq.true,lead_type.eq.newsletter');

    if (error) throw error;
    const recipients = selectDigestRecipients(subscribers || []);

    const dryRun = req.query?.dryRun === 'true';
    if (!dryRun) {
      await Promise.all(
        recipients.map((subscriber) =>
          sendEmail({
            to: subscriber.email,
            subject: digest.subject,
            html: buildDigestHtml(subscriber.nome, digest),
          })
        )
      );

      if (digest.source === 'issue' && digest.issue?.id) {
        await markNewsletterIssueSent(digest.issue.id);
      }
    }

    return res.status(200).json({
      ok: true,
      dryRun,
      source: digest.source,
      issueId: digest.issue?.id || null,
      sent: dryRun ? 0 : recipients.length,
      recipients: recipients.length,
      news: digest.items.length,
    });
  } catch (error) {
    console.error('Newsletter digest error:', error);
    return res.status(500).json({ error: 'Falha ao enviar newsletter diaria' });
  }
}
