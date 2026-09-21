import { createClient } from '@supabase/supabase-js';
import { approvedStatuses, getNewsItems } from './_newsStore.js';
import { getLeadNotificationEmail, hasEmailConfig, sendEmail } from './_mailer.js';

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    : null;

const VICTOR_EMAIL = getLeadNotificationEmail();

export function buildEmailBrandHeaderHtml() {
  return `
    <div style="display:flex;align-items:center;gap:18px;margin-bottom:20px;">
      <img src="https://vant-business-victor-hugos-projects-378ea6a7.vercel.app/assets/brand/vant-logo-official.png" alt="VANT Business" width="44" height="44" style="display:block;width:44px;height:44px;border-radius:10px;object-fit:contain;padding-right:6px;" />
      <div>
        <p style="margin:0;color:#0f172a;font-size:14px;font-weight:800;letter-spacing:.04em;">VANT Business</p>
        <p style="margin:3px 0 0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.12em;">IA · Automacao · Presenca digital</p>
      </div>
    </div>
  `;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalize(value = '') {
  return String(value).trim();
}

function normalizeMetadata(metadata = {}, context = {}) {
  const normalized = {};

  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;

      if (typeof value === 'string') {
        const cleanValue = normalize(value);
        if (!cleanValue) return;
        normalized[key] = cleanValue;
        return;
      }

      if (typeof value === 'number' || typeof value === 'boolean') {
        normalized[key] = value;
      }
    });
  }

  return {
    ...normalized,
    userAgent: context.userAgent || null,
    referer: context.referer || null,
  };
}

export function normalizeSubscribePayload(input = {}, context = {}) {
  const {
    nome,
    email,
    whatsapp,
    ebook,
    productTitle,
    leadType = 'ebook',
    newsletterOptIn = false,
    source = 'unknown',
    metadata = {},
  } = input;

  const cleanName = normalize(nome);
  const cleanEmail = normalize(email).toLowerCase();
  const cleanWhatsapp = normalize(whatsapp);
  const rawLeadType = normalize(leadType).toLowerCase();
  const cleanLeadType = ['ebook', 'newsletter', 'service'].includes(rawLeadType)
    ? rawLeadType
    : 'ebook';
  const cleanEbook = normalize(ebook) || (cleanLeadType === 'service' ? 'diagnostico-vant' : '');
  const cleanProductTitle = normalize(productTitle) || cleanEbook;
  const wantsNewsletter = cleanLeadType === 'newsletter' || Boolean(newsletterOptIn);

  return {
    cleanName,
    cleanEmail,
    cleanWhatsapp,
    cleanEbook,
    cleanProductTitle,
    cleanLeadType,
    wantsNewsletter,
    source: normalize(source) || 'unknown',
    metadata: normalizeMetadata(metadata, context),
  };
}

export function getSubscriberWriteMode(leadType = '') {
  return normalize(leadType).toLowerCase() === 'service' ? 'insert' : 'upsert';
}

function buildNewsPreviewHtml(items) {
  if (!items.length) {
    return `
      <div style="margin-top:20px;padding:16px;border:1px solid #bae6fd;border-radius:16px;background:#ecfeff;">
        <p style="margin:0;color:#0f172a;font-size:14px;line-height:1.6;">
          Assim que houver noticias aprovadas, voce recebe a curadoria completa no mesmo canal.
        </p>
      </div>
    `;
  }

  return `
    <div style="margin-top:20px;">
      <p style="margin:0 0 10px;color:#0891b2;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">
        Previa do que voce vai receber
      </p>
      <div style="border:1px solid #bae6fd;border-radius:16px;overflow:hidden;background:#ffffff;">
        ${items
          .map(
            (item) => `
              <div style="padding:14px 16px;border-top:1px solid #e2e8f0;">
                <a href="${item.link}" style="font-weight:700;color:#0369a1;text-decoration:none;line-height:1.4;">
                  ${escapeHtml(item.titlePt || item.title)}
                </a>
                <p style="margin:6px 0 0;color:#475569;font-size:13px;line-height:1.55;">
                  ${escapeHtml(item.summaryPt || item.summary || '')}
                </p>
              </div>
            `
          )
          .join('')}
      </div>
    </div>
  `;
}

export function buildWelcomeHtml(nome, { productTitle, newsletterOptIn, newsItems }) {
  const previewItems = (newsItems || []).filter((item) => approvedStatuses.includes(item.status)).slice(0, 3);
  const safeName = escapeHtml(nome);
  const safeProductTitle = escapeHtml(productTitle);
  const newsPreviewHtml = buildNewsPreviewHtml(previewItems);

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;padding:28px;background:#f8fafc;color:#0f172a;">
      ${buildEmailBrandHeaderHtml()}
      <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;">Ola, ${safeName}</h1>
      <p style="margin:0;color:#475569;font-size:14px;line-height:1.65;">
        Seu cadastro foi confirmado e a curadoria da VANT Business já começou a trabalhar para voce.
      </p>
      <div style="margin-top:20px;padding:18px;border-radius:18px;background:#0f172a;color:#f8fafc;">
        <p style="margin:0 0 8px;color:#67e8f9;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Seu acesso</p>
        <p style="margin:0;font-size:15px;line-height:1.65;">
          ${newsletterOptIn ? 'Voce entrou no canal diario de noticias de IA.' : 'Voce também pode ativar o canal diario de noticias de IA a qualquer momento.'}
        </p>
        <p style="margin:12px 0 0;color:#cbd5e1;font-size:14px;line-height:1.6;">
          Material registrado: <strong>${safeProductTitle}</strong>
        </p>
      </div>
      <div style="margin-top:22px;padding:18px;border:1px solid #e2e8f0;border-radius:18px;background:#ffffff;">
        <p style="margin:0 0 8px;color:#0f172a;font-size:16px;font-weight:700;">O que você vai receber</p>
        <p style="margin:0;color:#475569;font-size:14px;line-height:1.65;">
          Noticias curadas, ebooks práticos, ideias de ferramentas e, quando fizer sentido, roteiros para conteudo e afiliados.
        </p>
        ${newsPreviewHtml}
      </div>
      <p style="margin:20px 0 0;color:#64748b;font-size:12px;line-height:1.6;">
        A VANT Business só envia o que foi aprovado na curadoria.
      </p>
    </div>
  `;
}

function buildServiceConfirmationHtml(nome, { productTitle }) {
  const safeName = escapeHtml(nome);
  const safeProductTitle = escapeHtml(productTitle);

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;padding:28px;background:#f8fafc;color:#0f172a;">
      ${buildEmailBrandHeaderHtml()}
      <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;">Ola, ${safeName}</h1>
      <p style="margin:0;color:#475569;font-size:14px;line-height:1.65;">
        Recebi seu briefing para <strong>${safeProductTitle}</strong>. Vou analisar o contexto do seu negocio e responder com o melhor proximo passo.
      </p>
      <div style="margin-top:20px;padding:18px;border-radius:18px;background:#0f172a;color:#f8fafc;">
        <p style="margin:0 0 8px;color:#67e8f9;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Proximo passo</p>
        <p style="margin:0;font-size:15px;line-height:1.65;">
          A VANT avalia presenca, captacao, atendimento, follow-up, automacao e conversao antes de sugerir uma entrega.
        </p>
      </div>
      <p style="margin:20px 0 0;color:#64748b;font-size:12px;line-height:1.6;">
        Esta mensagem confirma que seu contato entrou no fluxo comercial da VANT Business.
      </p>
    </div>
  `;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    cleanName,
    cleanEmail,
    cleanWhatsapp,
    cleanEbook,
    cleanProductTitle,
    cleanLeadType,
    wantsNewsletter,
    source,
    metadata,
  } = normalizeSubscribePayload(req.body, {
    userAgent: req.headers['user-agent'] || null,
    referer: req.headers.referer || null,
  });

  if (!cleanEmail || !cleanName || !cleanEbook) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  if (cleanLeadType === 'service' && !cleanWhatsapp) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Email invalido' });
  }

  if (!supabase || !hasEmailConfig() || !VICTOR_EMAIL) {
    return res.status(500).json({ error: 'Ambiente de email ou banco nao configurado' });
  }

  const now = new Date().toISOString();
  const safeName = escapeHtml(cleanName);
  const safeEmail = escapeHtml(cleanEmail);
  const safeWhatsapp = escapeHtml(cleanWhatsapp || '-');
  const safeProductTitle = escapeHtml(cleanProductTitle);
  const safeLeadType = escapeHtml(cleanLeadType);
  const safeSource = escapeHtml(source);

  try {
    // 1. Salva no Supabase
    const subscriberRow = {
      nome: cleanName,
      email: cleanEmail,
      whatsapp: cleanWhatsapp || null,
      ebook: cleanEbook,
      product_title: cleanProductTitle,
      lead_type: cleanLeadType,
      newsletter_opt_in: wantsNewsletter,
      source,
      metadata,
      created_at: now,
      updated_at: now,
    };

    const writeMode = getSubscriberWriteMode(cleanLeadType);
    const { error } = writeMode === 'insert'
      ? await supabase.from('subscribers').insert(subscriberRow)
      : await supabase
          .from('subscribers')
          .upsert(subscriberRow, { onConflict: 'email,ebook', ignoreDuplicates: false });

    if (error) throw error;

    const news = await getNewsItems(req);
    const subscriberSubject = cleanLeadType === 'service'
      ? `${cleanName}, recebemos seu briefing na VANT Business`
      : cleanLeadType === 'newsletter'
        ? `${cleanName}, bem-vindo ao canal de noticias de IA`
        : `${cleanName}, seu material e a curadoria da VANT Business`;

    const subscriberHtml = cleanLeadType === 'service'
      ? buildServiceConfirmationHtml(cleanName, { productTitle: cleanProductTitle })
      : buildWelcomeHtml(cleanName, {
          productTitle: cleanProductTitle,
          newsletterOptIn: wantsNewsletter,
          newsItems: news.items || [],
        });

    const serviceDetailsHtml = cleanLeadType === 'service'
      ? `
              <tr>
                <td style="padding:8px 0;color:#64748b;">Empresa</td>
                <td style="padding:8px 0;color:#475569;">${escapeHtml(metadata.businessName || '-')}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;">Instagram</td>
                <td style="padding:8px 0;color:#475569;">${escapeHtml(metadata.instagramHandle || '-')}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;">Solucao</td>
                <td style="padding:8px 0;color:#475569;">${escapeHtml(metadata.solutionType || '-')}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;">Momento</td>
                <td style="padding:8px 0;color:#475569;">${escapeHtml(metadata.projectStage || '-')}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;">Orcamento</td>
                <td style="padding:8px 0;color:#475569;">${escapeHtml(metadata.budgetRange || '-')}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;">Briefing</td>
                <td style="padding:8px 0;color:#475569;line-height:1.6;">${escapeHtml(metadata.message || '-')}</td>
              </tr>
        `
      : '';

    // 2. Emails em paralelo
    await Promise.all([
      // Notificação para Victor
      sendEmail({
        to: VICTOR_EMAIL,
        subject: `Novo lead VANT - ${cleanProductTitle}`,
        html: `
          <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
            ${buildEmailBrandHeaderHtml()}
            <h2 style="color:#0f172a;margin-bottom:16px;">Novo lead captado</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr>
                <td style="padding:8px 0;color:#64748b;width:140px;">Nome</td>
                <td style="padding:8px 0;font-weight:600;color:#0f172a;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;">Email</td>
                <td style="padding:8px 0;font-weight:600;color:#0f172a;">${safeEmail}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;">WhatsApp</td>
                <td style="padding:8px 0;font-weight:600;color:#0f172a;">${safeWhatsapp}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;">Produto</td>
                <td style="padding:8px 0;font-weight:600;color:#0ea5e9;">${safeProductTitle}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;">Tipo</td>
                <td style="padding:8px 0;color:#475569;">${safeLeadType}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;">Noticias</td>
                <td style="padding:8px 0;color:#475569;">${wantsNewsletter ? 'sim' : 'nao'}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;">Origem</td>
                <td style="padding:8px 0;color:#475569;">${safeSource}</td>
              </tr>
              ${serviceDetailsHtml}
              <tr>
                <td style="padding:8px 0;color:#64748b;">Data</td>
                <td style="padding:8px 0;color:#475569;">${new Date(now).toLocaleString('pt-BR')}</td>
              </tr>
            </table>
          </div>
        `,
      }),

      // Confirmação para o inscrito
      sendEmail({
        to: cleanEmail,
        subject: subscriberSubject,
        html: subscriberHtml,
      }),
    ]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Falha ao processar inscrição' });
  }
}
