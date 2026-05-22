import type { EvidenceSource, JobPostSignal } from '../types';

const highIntentKeywords = new Set([
  'ai',
  'automation',
  'workflow',
  'operations',
  'systems',
  'crm',
  'integration',
  'integrations',
  'reporting',
  'revops',
  'business analyst',
  'process improvement'
]);

const highIntentTools = new Set([
  'zapier',
  'make',
  'hubspot',
  'salesforce',
  'airtable',
  'monday',
  'notion',
  'servicetitan',
  'jobber',
  'quickbooks',
  'power bi'
]);

export type HiringSignalScore = {
  total: number;
  painBoost: number;
  valueBoost: number;
  fitBoost: number;
  reachabilityBoost: number;
};

const normalize = (value: string) => value.trim().toLowerCase();

export function scoreHiringSignals(signals: JobPostSignal[] = []): HiringSignalScore {
  if (signals.length === 0) {
    return { total: 0, painBoost: 0, valueBoost: 0, fitBoost: 0, reachabilityBoost: 0 };
  }

  const keywords = signals.flatMap((signal) => signal.keywords).map(normalize);
  const tools = signals.flatMap((signal) => signal.tools).map(normalize);
  const painSignals = signals.flatMap((signal) => signal.painSignals).map(normalize);
  const titles = signals.map((signal) => normalize(signal.title));
  const sources = signals.map((signal) => signal.sourceUrl).filter(Boolean);

  const keywordHits = keywords.filter((keyword) => highIntentKeywords.has(keyword)).length;
  const toolHits = tools.filter((tool) => highIntentTools.has(tool)).length;
  const titleHits = titles.filter((title) => ['ai', 'automation', 'systems', 'operations', 'crm', 'revops'].some((term) => title.includes(term))).length;

  const total = Math.min(100, 40 + keywordHits * 8 + toolHits * 7 + painSignals.length * 8 + titleHits * 12 + Math.min(signals.length, 3) * 5);

  return {
    total,
    painBoost: painSignals.length > 0 || keywordHits >= 2 ? 15 : 0,
    valueBoost: signals.length > 0 ? 10 : 0,
    fitBoost: keywordHits > 0 || titleHits > 0 ? 5 : 0,
    reachabilityBoost: sources.length > 0 ? 5 : 0
  };
}

export function summarizeHiringSignals(signals: JobPostSignal[] = []): string {
  if (signals.length === 0) return 'No public automation/AI hiring signals captured yet.';

  return signals.map((signal) => {
    const tools = signal.tools.length > 0 ? ` Tools mentioned: ${signal.tools.join(', ')}.` : '';
    const pain = signal.painSignals.length > 0 ? ` Pain language: ${signal.painSignals.join('; ')}.` : '';
    return `${signal.title} via ${signal.source}.${tools}${pain} AWC angle: ${signal.awcAngle}`;
  }).join('\n');
}

export function buildJobSearchUrls(companyName: string, location: string): EvidenceSource[] {
  const query = encodeURIComponent(`${companyName} automation AI workflow CRM ${location}`);
  const linkedInQuery = encodeURIComponent(`${companyName} automation OR AI OR CRM OR operations`);

  return [
    {
      label: 'Canada Job Bank',
      url: `https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=${query}`,
      note: 'Search public Canadian postings for automation, AI, CRM, operations, and workflow language.'
    },
    {
      label: 'Indeed',
      url: `https://ca.indeed.com/jobs?q=${query}`,
      note: 'Search public job listings for hiring intent and tool-stack clues.'
    },
    {
      label: 'LinkedIn Jobs search',
      url: `https://www.linkedin.com/jobs/search/?keywords=${linkedInQuery}`,
      note: 'Use manual/authorized review only; do not scrape private or access-controlled LinkedIn pages.'
    }
  ];
}
