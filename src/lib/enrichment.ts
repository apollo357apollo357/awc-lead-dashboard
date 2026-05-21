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
  sources: SourceLedgerEntry[];
};

type BuildWebsiteEnrichmentInput = {
  candidateId: string;
  companyName: string;
  url: string;
  html: string;
  capturedAt?: string;
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
  const sourceFields = [
    emails.length ? 'emails' : '',
    phones.length ? 'phones' : '',
    forms.length ? 'forms' : '',
    ctas.length ? 'ctas' : '',
    techStack.length ? 'techStack' : '',
    workflowSignals.length ? 'workflowSignals' : ''
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
