import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';

export type WebsiteFormSignal = {
  action: string;
  method: string;
  fields: string[];
};

export type SourceLedgerEntry = {
  type: 'website';
  url: string;
  capturedAt: string;
  fields: string[];
};

export type LinkedSourceEvidence = {
  label: string;
  url: string;
  note?: string;
};

export type DecisionMakerEvidence = {
  name: string;
  title: string;
  sourceUrl: string;
  note?: string;
};

export type AwcWebsiteEnrichment = {
  candidateId: string;
  companyName: string;
  website: {
    url: string;
    title: string;
    description: string;
  };
  contacts: {
    emails: string[];
    phones: string[];
  };
  intakeChannels: string[];
  ctas: string[];
  forms: WebsiteFormSignal[];
  techStack: string[];
  workflowSignals: string[];
  reviewEvidence: LinkedSourceEvidence[];
  jobEvidence: LinkedSourceEvidence[];
  decisionMakerEvidence: DecisionMakerEvidence[];
  sources: SourceLedgerEntry[];
};

type BuildWebsiteEnrichmentInput = {
  candidateId: string;
  companyName: string;
  url: string;
  html: string;
  capturedAt?: string;
  additionalPages?: Array<{
    url: string;
    html: string;
  }>;
};

const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const phonePattern = /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/g;

function unique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function visibleText($: cheerio.CheerioAPI, element: AnyNode): string {
  return $(element).text().replace(/\s+/g, ' ').trim();
}

function normalizePhone(raw: string): string {
  return raw.replace(/[()\s.-]/g, '').replace(/^1(?=\d{10}$)/, '+1');
}

function absoluteUrl(href: string, baseUrl: string): string {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

function compactLabel(value: string, fallback: string): string {
  return value.replace(/\s+/g, ' ').trim() || fallback;
}

function linkedEvidenceFromAnchors($: cheerio.CheerioAPI, baseUrl: string, matcher: (text: string, href: string) => boolean, fallback: string, note: string): LinkedSourceEvidence[] {
  const evidence: LinkedSourceEvidence[] = $('a[href]')
    .map((_, element) => {
      const href = $(element).attr('href') ?? '';
      const text = visibleText($, element);
      if (!matcher(text, href)) return undefined;
      return {
        label: compactLabel(text, fallback),
        url: absoluteUrl(href, baseUrl),
        note
      };
    })
    .get()
    .filter((item) => Boolean(item?.url)) as LinkedSourceEvidence[];

  const seen = new Set<string>();
  return evidence.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  }).slice(0, 8);
}

function uniqueDecisionMakerEvidence(evidence: DecisionMakerEvidence[]): DecisionMakerEvidence[] {
  const seen = new Set<string>();
  return evidence.filter((item) => {
    const key = `${item.name}|${item.title}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 6);
}

function extractDecisionMakerEvidence($: cheerio.CheerioAPI, baseUrl: string): DecisionMakerEvidence[] {
  const titlePattern = '(Owner|Founder|Co-Founder|President|Partner|General Manager|Operations Manager|Office Manager|Clinic Manager|Practice Manager|Director(?: of [A-Z][A-Za-z ]{2,40})?)';
  const patterns = [
    new RegExp(`\\b([A-Z][a-z]+(?:\\s+[A-Z][a-z]+){1,2})\\s*[,–-]\\s*${titlePattern}\\b`, 'g'),
    new RegExp(`\\b${titlePattern}\\s*[:–-]\\s*([A-Z][a-z]+(?:\\s+[A-Z][a-z]+){1,2})\\b`, 'g')
  ];
  const evidence: DecisionMakerEvidence[] = [];
  const textBlocks = $('body h1, body h2, body h3, body h4, body p, body li, body figcaption, body article, body section')
    .map((_, element) => visibleText($, element))
    .get()
    .filter((text) => text.length <= 180);

  for (const text of textBlocks) {
    for (const pattern of patterns) {
      for (const match of text.matchAll(pattern)) {
        const firstGroupIsTitle = /owner|founder|president|partner|manager|director/i.test(match[1] ?? '');
        const name = firstGroupIsTitle ? match[2] : match[1];
        const title = firstGroupIsTitle ? match[1] : match[2];
        if (!name || !title) continue;
        evidence.push({
          name: name.trim(),
          title: title.trim(),
          sourceUrl: baseUrl,
          note: 'Public website text includes this person/title; verify role before outreach.'
        });
      }
    }
  }

  return uniqueDecisionMakerEvidence(evidence);
}

function detectTechStack(html: string, linksAndScripts: string[]): string[] {
  const haystack = `${html}\n${linksAndScripts.join('\n')}`.toLowerCase();
  const detected: string[] = [];

  if (haystack.includes('googletagmanager.com') || haystack.includes('gtm-')) detected.push('Google Tag Manager');
  if (haystack.includes('google-analytics.com') || haystack.includes('gtag(')) detected.push('Google Analytics');
  if (haystack.includes('connect.facebook.net') || haystack.includes('fbevents.js')) detected.push('Meta Pixel');
  if (haystack.includes('calendly.com')) detected.push('Calendly');
  if (haystack.includes('janeapp.com')) detected.push('JaneApp');
  if (haystack.includes('hubspot')) detected.push('HubSpot');
  if (haystack.includes('typeform.com')) detected.push('Typeform');
  if (haystack.includes('jotform')) detected.push('Jotform');
  if (haystack.includes('wp-content') || haystack.includes('wordpress')) detected.push('WordPress');
  if (haystack.includes('wixstatic.com')) detected.push('Wix');
  if (haystack.includes('squarespace.com')) detected.push('Squarespace');
  if (haystack.includes('webflow')) detected.push('Webflow');
  if (haystack.includes('tawk.to')) detected.push('Tawk.to chat');

  return unique(detected);
}

function inferIntakeChannels(emails: string[], phones: string[], forms: WebsiteFormSignal[], linksAndScripts: string[]): string[] {
  const channels: string[] = [];
  if (phones.length) channels.push('phone');
  if (emails.length) channels.push('email');
  if (forms.length) channels.push('contact form');
  if (linksAndScripts.some((value) => /calendly|janeapp|book|booking|schedule/i.test(value))) channels.push('booking link');
  return channels;
}

function buildWorkflowSignals(input: {
  forms: WebsiteFormSignal[];
  intakeChannels: string[];
  ctas: string[];
  techStack: string[];
}): string[] {
  const signals: string[] = [];

  if (input.forms.some((form) => form.fields.some((field) => /phone|email/i.test(field)))) {
    signals.push('Public form captures phone/email fields for follow-up routing.');
  }

  if (input.intakeChannels.includes('booking link')) {
    signals.push('Booking link exists; map whether booked appointments sync with follow-up reminders.');
  }

  if (input.intakeChannels.includes('phone') && input.intakeChannels.includes('contact form')) {
    signals.push('Phone and form intake both exist; map whether they land in one follow-up workflow.');
  }

  if (input.ctas.some((cta) => /quote|estimate/i.test(cta))) {
    signals.push('Quote-oriented CTA creates a natural conversation around lead qualification and quote follow-up.');
  }

  if (input.techStack.includes('Google Tag Manager') && input.forms.length) {
    signals.push('Analytics/tooling is present alongside forms; map whether lead events are tracked through follow-up.');
  }

  return unique(signals);
}

export function buildAwcEnrichmentFromWebsite(input: BuildWebsiteEnrichmentInput): AwcWebsiteEnrichment {
  const $ = cheerio.load(input.html);
  const title = $('title').first().text().replace(/\s+/g, ' ').trim();
  const description = $('meta[name="description"]').attr('content')?.trim() ?? '';
  const hrefs = $('a[href]').map((_, element) => $(element).attr('href') ?? '').get();
  const scripts = $('script[src]').map((_, element) => $(element).attr('src') ?? '').get();
  const linksAndScripts = [...hrefs, ...scripts];
  $('script, style, noscript').remove();
  const bodyText = $.root().text();

  const mailtoEmails = hrefs
    .filter((href) => href.toLowerCase().startsWith('mailto:'))
    .map((href) => href.replace(/^mailto:/i, '').split('?')[0]);
  const textEmails = bodyText.match(emailPattern) ?? [];
  const emails = unique([...mailtoEmails, ...textEmails].map((email) => email.toLowerCase()));

  const telPhones = hrefs
    .filter((href) => href.toLowerCase().startsWith('tel:'))
    .map((href) => href.replace(/^tel:/i, '').split('?')[0]);
  const textPhones = bodyText.match(phonePattern) ?? [];
  const phones = unique([...telPhones, ...textPhones].map(normalizePhone));

  const ctas = unique(
    $('a, button')
      .map((_, element) => visibleText($, element))
      .get()
      .filter((text) => /book|schedule|quote|estimate|contact|call|request|consult/i.test(text))
      .slice(0, 12)
  );

  const forms: WebsiteFormSignal[] = $('form').map((_, form) => {
    const fields = unique(
      $(form)
        .find('input[name], textarea[name], select[name]')
        .map((__, field) => $(field).attr('name') ?? '')
        .get()
    );

    return {
      action: $(form).attr('action') ?? '',
      method: ($(form).attr('method') ?? 'get').toLowerCase(),
      fields
    };
  }).get();

  const techStack = detectTechStack(input.html, linksAndScripts);
  const intakeChannels = inferIntakeChannels(emails, phones, forms, linksAndScripts);
  const workflowSignals = buildWorkflowSignals({ forms, intakeChannels, ctas, techStack });
  const reviewEvidence = linkedEvidenceFromAnchors(
    $,
    input.url,
    (text, href) => /review|testimonial|rating|google/i.test(`${text} ${href}`),
    'Review source',
    'Review/testimonial source linked from public website.'
  );
  const jobEvidence = linkedEvidenceFromAnchors(
    $,
    input.url,
    (text, href) => /career|job|employment|hiring|join.+team|work.+with.+us/i.test(`${text} ${href}`),
    'Careers / jobs source',
    'Careers/jobs source linked from public website.'
  );
  const decisionMakerEvidence = uniqueDecisionMakerEvidence([
    ...extractDecisionMakerEvidence($, input.url),
    ...(input.additionalPages ?? []).flatMap((page) => extractDecisionMakerEvidence(cheerio.load(page.html), page.url))
  ]);
  const sourceFields = [
    emails.length ? 'emails' : '',
    phones.length ? 'phones' : '',
    forms.length ? 'forms' : '',
    ctas.length ? 'ctas' : '',
    techStack.length ? 'techStack' : '',
    workflowSignals.length ? 'workflowSignals' : '',
    reviewEvidence.length ? 'reviewEvidence' : '',
    jobEvidence.length ? 'jobEvidence' : '',
    decisionMakerEvidence.length ? 'decisionMakerEvidence' : ''
  ].filter(Boolean);

  return {
    candidateId: input.candidateId,
    companyName: input.companyName,
    website: {
      url: input.url,
      title,
      description
    },
    contacts: {
      emails,
      phones
    },
    intakeChannels,
    ctas,
    forms,
    techStack,
    workflowSignals,
    reviewEvidence,
    jobEvidence,
    decisionMakerEvidence,
    sources: [
      {
        type: 'website',
        url: input.url,
        capturedAt: input.capturedAt ?? new Date().toISOString(),
        fields: sourceFields
      }
    ]
  };
}
