function clean(value = '') {
  return String(value || '').trim();
}

export function normalizeWhatsAppNumber(value = '') {
  return clean(value).replace(/\D/g, '');
}

export function buildBriefingWhatsAppMessage(data = {}) {
  const lines = [
    'Ola, Victor. Vim pelo diagnostico VANT.Business e quero entender o melhor proximo passo.',
    '',
    `Nome: ${clean(data.nome) || '-'}`,
    `Empresa/projeto: ${clean(data.empresa) || '-'}`,
    `Instagram: ${clean(data.instagram) || '-'}`,
    `Email: ${clean(data.email) || '-'}`,
    `WhatsApp: ${clean(data.whatsapp) || '-'}`,
    `Gargalo principal: ${clean(data.solucao) || '-'}`,
    `Momento: ${clean(data.momento) || '-'}`,
    `Objetivo: ${clean(data.objetivo) || '-'}`,
    `Faixa de investimento: ${clean(data.orcamento) || '-'}`,
    '',
    'Diagnostico:',
    clean(data.descricao) || '-',
  ];

  return lines.join('\n');
}

export function buildBriefingWhatsAppUrl(data = {}, targetNumber = '') {
  const message = buildBriefingWhatsAppMessage(data);
  const phone = normalizeWhatsAppNumber(targetNumber);
  const baseUrl = phone ? `https://wa.me/${phone}` : 'https://wa.me/';
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
