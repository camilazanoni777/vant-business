import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const defaultNewsOutputPath = path.resolve('public/data/ai-news.json');
export const defaultNewsLimit = Number(process.env.NEWS_AGENT_LIMIT || 20);

export const newsSources = [
  { name: 'Google AI Blog', feedUrl: 'https://blog.google/technology/ai/rss/', category: 'Big tech' },
  { name: 'OpenAI News', feedUrl: 'https://openai.com/news/rss.xml', category: 'Modelos' },
  { name: 'Anthropic News', feedUrl: 'https://www.anthropic.com/news/rss.xml', category: 'Modelos' },
  { name: 'MIT Technology Review AI', feedUrl: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', category: 'Pesquisa' },
  { name: 'VentureBeat AI', feedUrl: 'https://venturebeat.com/category/ai/feed/', category: 'Mercado' },
  { name: 'The Verge AI', feedUrl: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', category: 'Mercado' },
];

const aiKeywords = [
  'ai',
  'artificial intelligence',
  'ia',
  'generative',
  'llm',
  'model',
  'openai',
  'anthropic',
  'google',
  'gemini',
  'chatgpt',
  'claude',
  'agent',
  'automation',
  'automacao',
];

function decodeEntities(value = '') {
  return value
    .replaceAll('<![CDATA[', '')
    .replaceAll(']]>', '')
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripHtml(value = '') {
  return decodeEntities(value.replace(/<[^>]*>/g, ' '));
}

function normalizeWhitespace(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function looksPortuguese(text = '') {
  const normalized = normalizeWhitespace(text).toLowerCase();
  if (!normalized) return false;

  const markers = [' de ', ' da ', ' do ', ' das ', ' dos ', ' para ', ' com ', ' que ', ' uma ', ' um ', ' em ', ' por ', ' no ', ' na ', ' e '];
  const score = markers.reduce((total, marker) => total + (normalized.includes(marker) ? 1 : 0), 0);
  const diacritics = /[ãõáàâéêíóôúç]/i.test(normalized) ? 1 : 0;
  return score + diacritics >= 3;
}

async function translateToPortuguese(text = '') {
  const normalized = normalizeWhitespace(text);
  if (!normalized) return '';

  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'auto');
  url.searchParams.set('tl', 'pt');
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', normalized);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'VANT Business AI News Agent/1.0',
        Accept: 'application/json',
      },
    });

    if (!response.ok) throw new Error(String(response.status) + ' ' + response.statusText);
    const payload = await response.json();
    const translated = (payload?.[0] || []).map((chunk) => chunk?.[0] || '').join('');
    return normalizeWhitespace(translated) || normalized;
  } catch {
    return normalized;
  }
}

async function localizeItem(item) {
  const sourceText = String(item.title || '') + ' ' + String(item.summary || '');
  const needsTranslation = !looksPortuguese(sourceText);

  if (!needsTranslation) {
    return { ...item, titlePt: item.titlePt || item.title, summaryPt: item.summaryPt || item.summary, translationStatus: 'original-pt' };
  }

  const [titlePt, summaryPt] = await Promise.all([
    item.titlePt ? Promise.resolve(item.titlePt) : translateToPortuguese(item.title),
    item.summaryPt ? Promise.resolve(item.summaryPt) : translateToPortuguese(item.summary),
  ]);

  return { ...item, titlePt: titlePt || item.title, summaryPt: summaryPt || item.summary, translationStatus: 'translated' };
}

function extractTag(block, tags) {
  for (const tag of tags) {
    const match = block.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'i'));
    if (match) return decodeEntities(match[1]);
  }
  return '';
}

function extractLink(block) {
  const directLink = extractTag(block, ['link']);
  if (directLink && !directLink.includes('<')) return directLink;
  const hrefMatch = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);
  return hrefMatch ? decodeEntities(hrefMatch[1]) : '';
}

export function parseNewsFeed(xml, source) {
  const blocks = xml.match(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi) || [];

  return blocks.map((block) => {
    const title = stripHtml(extractTag(block, ['title']));
    const link = extractLink(block);
    const description = stripHtml(extractTag(block, ['description', 'summary', 'content:encoded', 'content']));
    const publishedRaw = extractTag(block, ['pubDate', 'published', 'updated', 'dc:date']);
    const publishedAt = publishedRaw ? new Date(publishedRaw).toISOString() : new Date().toISOString();
    const text = String(title + ' ' + description).toLowerCase();

    return {
      id: String(source.name + '-' + title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90),
      title,
      link,
      source: source.name,
      category: source.category,
      publishedAt,
      summary: description.slice(0, 240),
      status: 'aguardando_avaliacao',
      score: aiKeywords.reduce((total, keyword) => total + (text.includes(keyword) ? 1 : 0), 0),
    };
  });
}

async function fetchFeed(source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(source.feedUrl, {
      headers: {
        'User-Agent': 'VANT Business AI News Agent/1.0',
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml',
      },
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(String(response.status) + ' ' + response.statusText);
    return parseNewsFeed(await response.text(), source);
  } finally {
    clearTimeout(timeout);
  }
}

async function readPrevious(outputPath) {
  try {
    return JSON.parse(await readFile(outputPath, 'utf8'));
  } catch {
    return { items: [] };
  }
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.link || item.title;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function collectNewsPayload({ limit = defaultNewsLimit, outputPath = defaultNewsOutputPath } = {}) {
  const results = await Promise.allSettled(newsSources.map(fetchFeed));
  const fetched = results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));
  const previous = await readPrevious(outputPath);
  const eligible = dedupe(fetched)
    .filter((item) => item.title && item.link && item.score > 0)
    .map((item) => ({ ...item, publishedTime: new Date(item.publishedAt).getTime() || 0 }));
  const localized = await Promise.all(eligible.map(localizeItem));

  const recentCutoff = Date.now() - 45 * 24 * 60 * 60 * 1000;
  const recent = localized.filter((item) => item.publishedTime >= recentCutoff);
  const pool = recent.length >= Math.min(limit, 10) ? recent : localized;

  const ranked = pool
    .sort((a, b) => {
      const dateDelta = b.publishedTime - a.publishedTime;
      if (dateDelta !== 0) return dateDelta;
      return b.score - a.score;
    })
    .slice(0, limit)
    .map(({ publishedTime, ...item }, index) => ({ ...item, rank: index + 1 }));

  return {
    generatedAt: new Date().toISOString(),
    reviewStatus: ranked.length ? 'aguardando_avaliacao' : 'sem_noticias_novas',
    items: ranked.length ? ranked : previous.items || [],
    failedSources: results
      .map((result, index) => (result.status === 'rejected' ? { source: newsSources[index].name, error: result.reason.message } : null))
      .filter(Boolean),
  };
}

export async function saveStaticNewsPayload(payload, outputPath = defaultNewsOutputPath) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  return payload;
}
