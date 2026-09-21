import { Resend } from 'resend';

function getResendClient() {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
}

export function hasEmailConfig() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export function getLeadNotificationEmail() {
  return process.env.LEAD_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || '';
}


export async function sendEmail({ to, subject, html }) {
  const resend = getResendClient();

  if (!resend || !process.env.EMAIL_FROM) {
    throw new Error('Resend nao configurado. Configure RESEND_API_KEY e EMAIL_FROM.');
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || 'Falha ao enviar email via Resend');
  }
}
