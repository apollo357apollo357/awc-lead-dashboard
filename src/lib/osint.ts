import type { CandidateBusiness, EvidenceSource, Lead, ValidationQueueItem } from '../types';
import type { AwcWebsiteEnrichment } from './enrichment';
import { buildJobSearchUrls, scoreHiringSignals, summarizeHiringSignals } from './hiringSignals';

const categoryLabels: Record<string, string> = {
  accountant: 'Professional services',
  car_repair: 'Automotive service',
  cleaning: 'Commercial / field service',
  clinic: 'Healthcare clinic',
  company: 'Industrial / B2B company',
  dentist: 'Dental clinic',
  electrician: 'Electrical / trades',
  insurance: 'Professional services',
  lawyer: 'Professional services',
  physiotherapist: 'Healthcare clinic',
  roofer: 'Roofing / trades',
  signmaker: 'Signage / fabrication',
  veterinary: 'Veterinary clinic'
};

const fieldServiceCategories = new Set(['car_repair', 'cleaning', 'electrician', 'roofer', 'signmaker', 'veterinary']);
const appointmentCategories = new Set(['clinic', 'dentist', 'physiotherapist', 'veterinary']);
const professionalCategories = new Set(['accountant', 'insurance', 'lawyer']);

export function sourceIdForCandidate(candidate: CandidateBusiness): string {
  return `${candidate.source}:${candidate.id}`;
}

export function normalizeCandidateWebsite(website?: string): string {
  const trimmed = website?.trim() ?? '';
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function categoryLabel(category: string): string {
  return categoryLabels[category] ?? category.replace(/_/g, ' ');
}

function inferNiches(candidate: CandidateBusiness): string[] {
  const niches = new Set<string>([categoryLabel(candidate.category), 'Local owner-led business']);

  if (fieldServiceCategories.has(candidate.category)) niches.add('Field service operations');
  if (appointmentCategories.has(candidate.category)) niches.add('Appointment-based intake');
  if (professionalCategories.has(candidate.category)) niches.add('Professional services workflow');
  if (candidate.publicTags.opening_hours) niches.add('Published operating hours');
  if (candidate.website) niches.add('Public website available');
  if (candidate.email) niches.add('Public email available');

  return Array.from(niches);
}

function scoreReachability(candidate: CandidateBusiness): number {
  let score = 35;
  if (candidate.website) score += 25;
  if (candidate.phone) score += 20;
  if (candidate.email) score += 20;
  if (candidate.address) score += 5;
  return Math.min(score, 100);
}

function scoreFit(candidate: CandidateBusiness): number {
  let score = 62;
  if (fieldServiceCategories.has(candidate.category)) score += 16;
  if (appointmentCategories.has(candidate.category)) score += 12;
  if (professionalCategories.has(candidate.category)) score += 8;
  if (candidate.website) score += 4;
  return Math.min(score, 95);
}

function scorePain(candidate: CandidateBusiness): number {
  let score = 58;
  if (fieldServiceCategories.has(candidate.category)) score += 14;
  if (appointmentCategories.has(candidate.category)) score += 12;
  if (candidate.publicTags.opening_hours) score += 5;
  if (!candidate.email) score += 5;
  return Math.min(score, 92);
}

function scoreValue(candidate: CandidateBusiness): number {
  let score = 60;
  if (fieldServiceCategories.has(candidate.category)) score += 16;
  if (appointmentCategories.has(candidate.category)) score += 12;
  if (candidate.website && candidate.phone) score += 8;
  if (candidate.email) score += 6;
  return Math.min(score, 94);
}

function buildDiscoveryQuestions(candidate: CandidateBusiness): string[] {
  const businessType = categoryLabel(candidate.category).toLowerCase();
  const questions = [
    `When a new ${businessType} inquiry comes in, where does it go first: phone, email, website form, or someone's personal inbox?`,
    'How do you track follow-ups so quoted work, appointments, or service requests do not fall through the cracks?',
    'Which handoff creates the most admin drag right now: intake, scheduling, reminders, quoting, dispatch, or post-job follow-up?'
  ];

  if (appointmentCategories.has(candidate.category)) {
    questions.push('How are appointment reminders, cancellations, and rebooking handled today?');
  }

  if (fieldServiceCategories.has(candidate.category)) {
    questions.push('How does your team move a request from first call to booked job to completed follow-up?');
  }

  return questions;
}

function buildSellingPoints(candidate: CandidateBusiness): string[] {
  return [
    'Turn inbound calls, forms, and emails into a consistent intake workflow instead of scattered manual follow-up.',
    'Connect existing tools before adding new software, reducing duplicate entry and tool sprawl.',
    'Create simple owner/operator visibility into leads, open follow-ups, and stalled handoffs.',
    fieldServiceCategories.has(candidate.category)
      ? 'Automate field-service handoffs from inquiry to scheduling, reminder, completion, and review request.'
      : 'Automate appointment and follow-up workflows without disrupting the current front-desk process.'
  ];
}

function buildGoogleMapsUrl(candidate: CandidateBusiness): string | undefined {
  const query = [candidate.companyName, candidate.address, candidate.location].filter(Boolean).join(' ');
  if (!query) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function buildContactProfile(input: {
  candidate: CandidateBusiness;
  industry: string;
  website: string;
  websiteEnrichment?: AwcWebsiteEnrichment;
}): Lead['contact'] {
  const { candidate, industry, website, websiteEnrichment } = input;
  const decisionMaker = websiteEnrichment?.decisionMakerEvidence[0];
  const email = websiteEnrichment?.contacts.emails[0] ?? candidate.email;
  const phone = websiteEnrichment?.contacts.phones[0] ?? candidate.phone;

  return {
    name: decisionMaker?.name ?? 'Not found yet',
    title: decisionMaker?.title ?? 'No verified public person captured',
    email,
    phone,
    summary: decisionMaker
      ? 'Found on a public company source. Verify current role before personalized outreach.'
      : 'Use the business phone/email first. Add a named contact only after the website, LinkedIn, registry source, or call confirms a real person.',
    conversationOpeners: [
      `I was looking at ${candidate.companyName}'s public business listing and had a practical question about your intake/follow-up workflow.`,
      candidate.website ? `I saw the website listed as ${website}; I wanted to understand what happens after a new inquiry comes in.` : 'I found your public business listing and wanted to ask how new inquiries are handled today.',
      `For ${industry.toLowerCase()} teams, the hidden bottleneck is often not marketing — it is the handoff after the lead arrives.`
    ],
    boundaries: [
      'Lead with public business context, not personal details.',
      'Keep the conversation on intake, follow-up, handoffs, and tool alignment.',
      'Capture exact reservations, feedback, and friction for Kadwell content and funnel updates.'
    ],
    sources: decisionMaker
      ? [{ label: 'Verified point of contact', url: decisionMaker.sourceUrl, note: `${decisionMaker.name} — ${decisionMaker.title}` }]
      : [{ label: 'OpenStreetMap candidate record', url: candidate.sourceUrl, note: sourceIdForCandidate(candidate) }]
  };
}

type BuildLeadProfileOptions = {
  refreshedAt?: string;
  websiteEnrichment?: AwcWebsiteEnrichment;
};

function buildValidatedWebsiteSource(enrichment: AwcWebsiteEnrichment): EvidenceSource | undefined {
  const websiteSource = enrichment.sources.find((source) => source.type === 'website');
  if (!websiteSource) return undefined;

  return {
    label: 'Validated website fetch',
    url: websiteSource.url,
    note: `Captured ${websiteSource.capturedAt}; fields: ${websiteSource.fields.length ? websiteSource.fields.join(', ') : 'no tracked fields detected'}`
  };
}

function validatedWebsiteSystemSignals(enrichment?: AwcWebsiteEnrichment): string[] {
  if (!enrichment) return [];

  return [
    enrichment.intakeChannels.length ? `Validated intake channels: ${enrichment.intakeChannels.join(', ')}.` : 'Validated website fetch did not expose phone, email, form, or booking intake channels.',
    enrichment.techStack.length ? `Validated tools/scripts: ${enrichment.techStack.join(', ')}.` : 'Validated website fetch did not expose recognized analytics, CMS, booking, form, or chat tooling.',
    ...enrichment.workflowSignals.map((signal) => `Validated website signal: ${signal}`)
  ];
}

function validatedWebsiteConversionIssues(enrichment?: AwcWebsiteEnrichment): string[] {
  if (!enrichment) return [];

  if (enrichment.forms.length > 0) {
    return [`Validated website has ${enrichment.forms.length} form(s); inspect destination, routing, notification owner, and CRM capture.`];
  }

  return ['Validated website fetch found no native form; inspect whether calls, email, booking links, or third-party widgets handle intake.'];
}

function validatedWebsiteQuickWins(enrichment?: AwcWebsiteEnrichment): string[] {
  if (!enrichment) return [];

  const wins: string[] = [];
  if (enrichment.ctas.length > 0) wins.push(`Use validated CTAs as outreach context: ${enrichment.ctas.slice(0, 4).join(', ')}.`);
  if (enrichment.contacts.emails.length > 0 || enrichment.contacts.phones.length > 0) wins.push('Compare validated website contact channels against the seed record before calling.');
  if (enrichment.forms.length > 0) wins.push('Map form submission ownership, notification timing, CRM capture, and missed follow-up risk.');
  return wins;
}

function buildValidationQueue(input: {
  candidate: CandidateBusiness;
  websiteEnrichment?: AwcWebsiteEnrichment;
  validatedWebsiteSource?: EvidenceSource;
  hiringSignals: CandidateBusiness['jobPostSignals'];
}): ValidationQueueItem[] {
  const { candidate, websiteEnrichment, validatedWebsiteSource } = input;
  const hiringSignals = input.hiringSignals ?? [];
  const websiteSource = websiteEnrichment?.sources.find((source) => source.type === 'website');
  const validatedContactCount = (websiteEnrichment?.contacts.emails.length ?? 0) + (websiteEnrichment?.contacts.phones.length ?? 0);
  const reviewEvidence = websiteEnrichment?.reviewEvidence ?? [];
  const jobEvidence = websiteEnrichment?.jobEvidence ?? [];
  const decisionMakerEvidence = websiteEnrichment?.decisionMakerEvidence ?? [];
  const jobEvidenceCount = hiringSignals.length + jobEvidence.length;

  return [
    {
      category: 'Website',
      status: websiteEnrichment ? 'validated' : 'not checked',
      evidenceCount: validatedWebsiteSource ? 1 : 0,
      sourceUrl: websiteEnrichment?.website.url ?? (normalizeCandidateWebsite(candidate.website) || undefined),
      checkedAt: websiteSource?.capturedAt,
      note: websiteEnrichment ? 'Live website fetch is compiled into the source ledger.' : 'Website/contact path has not been fetched and compiled yet.',
      nextStep: websiteEnrichment ? 'Inspect the validated CTA/form path manually before referencing workflow behavior.' : 'Run live website enrichment or manually inspect the website/contact path.'
    },
    {
      category: 'Reviews',
      status: reviewEvidence.length ? 'validated' : 'not checked',
      evidenceCount: reviewEvidence.length,
      sourceUrl: reviewEvidence[0]?.url,
      checkedAt: websiteSource?.capturedAt,
      nextStep: reviewEvidence.length ? 'Open review sources and capture exact customer language before referencing pain.' : 'Capture quoted review language about response time, scheduling, communication, or follow-up before referencing customer pain.',
      note: reviewEvidence.length ? `${reviewEvidence.length} public review/testimonial source${reviewEvidence.length === 1 ? '' : 's'} linked from the website.` : 'No public review source has been validated or quoted in this profile yet.'
    },
    {
      category: 'Jobs',
      status: jobEvidenceCount ? 'validated' : 'not checked',
      evidenceCount: jobEvidenceCount,
      sourceUrl: hiringSignals[0]?.sourceUrl ?? jobEvidence[0]?.url,
      checkedAt: hiringSignals[0]?.postedAt ?? websiteSource?.capturedAt,
      nextStep: jobEvidenceCount ? 'Confirm the opening or careers page is still current before using it as outreach context.' : 'Check Job Bank, Indeed, LinkedIn Jobs, and company careers for automation/operations hiring signals.',
      note: jobEvidenceCount ? `${jobEvidenceCount} sourced hiring/careers signal${jobEvidenceCount === 1 ? '' : 's'} captured.` : 'No current job-post evidence captured yet.'
    },
    {
      category: 'Contact',
      status: validatedContactCount > 0 ? 'validated' : 'not checked',
      evidenceCount: validatedContactCount,
      sourceUrl: websiteEnrichment?.website.url,
      checkedAt: websiteSource?.capturedAt,
      nextStep: validatedContactCount > 0 ? 'Confirm the best phone/email route during outreach and record the result.' : 'Validate phone/email from the website, listing, or direct call before outreach.',
      note: validatedContactCount > 0 ? 'Website fetch captured public contact channel(s).' : 'Seed contact fields may exist, but no live contact validation has been compiled.'
    },
    {
      category: 'Decision maker',
      status: decisionMakerEvidence.length ? 'validated' : 'not checked',
      evidenceCount: decisionMakerEvidence.length,
      sourceUrl: decisionMakerEvidence[0]?.sourceUrl,
      checkedAt: websiteSource?.capturedAt,
      nextStep: decisionMakerEvidence.length ? 'Verify role/currentness before personalized outreach.' : 'Verify owner/operator or operations lead from a public company page, LinkedIn, registry source, or call discovery.',
      note: decisionMakerEvidence.length ? `${decisionMakerEvidence.length} public person/title candidate${decisionMakerEvidence.length === 1 ? '' : 's'} captured from website text.` : 'The current point of contact is a role placeholder, not a verified person.'
    }
  ];
}

export function buildLeadProfileFromCandidate(candidate: CandidateBusiness, options: BuildLeadProfileOptions = {}): Lead {
  const website = normalizeCandidateWebsite(candidate.website);
  const industry = categoryLabel(candidate.category);
  const location = candidate.location || 'Edmonton region, AB';
  const hasDirectContact = Boolean(candidate.phone || candidate.email || website);
  const refreshedNote = options.refreshedAt ? `Profile refreshed ${options.refreshedAt}` : undefined;
  const hiringSignals = candidate.jobPostSignals ?? [];
  const hiringScore = scoreHiringSignals(hiringSignals);
  const hasHiringSignal = hiringSignals.length > 0;
  const websiteEnrichment = options.websiteEnrichment?.candidateId === candidate.id ? options.websiteEnrichment : undefined;
  const contact = buildContactProfile({ candidate, industry, website, websiteEnrichment });
  const mapsUrl = buildGoogleMapsUrl(candidate);
  const validatedWebsiteSource = websiteEnrichment ? buildValidatedWebsiteSource(websiteEnrichment) : undefined;
  const lastSourceValidatedAt = websiteEnrichment?.sources[0]?.capturedAt;
  const reviewEvidenceSources = (websiteEnrichment?.reviewEvidence ?? []).map((source) => ({
    label: 'Validated review source',
    url: source.url,
    note: source.note ?? source.label
  }));
  const jobEvidenceSources = (websiteEnrichment?.jobEvidence ?? []).map((source) => ({
    label: 'Validated careers/jobs source',
    url: source.url,
    note: source.note ?? source.label
  }));
  const decisionMakerEvidenceSources = (websiteEnrichment?.decisionMakerEvidence ?? []).map((source) => ({
    label: 'Validated decision-maker source',
    url: source.sourceUrl,
    note: `${source.name} — ${source.title}${source.note ? ` · ${source.note}` : ''}`
  }));
  const profileSources = [
    { label: 'OpenStreetMap candidate record', url: candidate.sourceUrl, note: [sourceIdForCandidate(candidate), refreshedNote].filter(Boolean).join(' · ') },
    ...(website ? [{ label: 'Company website', url: website, note: ['Captured from public listing; not live-validated by this profile refresh.', refreshedNote].filter(Boolean).join(' · ') }] : []),
    ...(validatedWebsiteSource ? [validatedWebsiteSource] : []),
    ...reviewEvidenceSources,
    ...jobEvidenceSources,
    ...decisionMakerEvidenceSources,
    ...hiringSignals.map((signal) => ({ label: `${signal.source} hiring signal`, url: signal.sourceUrl, note: `${signal.title}${signal.postedAt ? ` · Posted ${signal.postedAt}` : ''}` })),
    ...buildJobSearchUrls(candidate.companyName, location)
  ];

  return {
    id: candidate.id,
    companyName: candidate.companyName,
    website,
    industry,
    niches: inferNiches(candidate),
    location,
    address: candidate.address,
    mapsUrl,
    phone: candidate.phone,
    status: 'New',
    summary: `${candidate.companyName} is a real public candidate from ${candidate.source} in ${location}. The OSINT profile turns the public listing into AWC-specific outreach prep focused on intake, follow-up, handoffs, and tool alignment.`,
    strengths: [
      candidate.website ? 'Has a public website to inspect for intake, CTA, form, and follow-up flow.' : 'Has a public business listing but no website captured in the seed data.',
      candidate.phone ? 'Public phone number is available for outbound calling.' : 'Phone number was not captured in the public seed record.',
      candidate.email ? 'Public email is available for live follow-up.' : 'Public email is not captured in the seed record; use phone or website-first outreach.',
      ...(hasHiringSignal ? ['Public job-post language suggests active budget or headcount for AI, automation, CRM, reporting, or operations help.'] : [])
    ],
    weaknesses: [
      'Website/contact-page workflow still needs to be mapped before the call.',
      'Review pain, form quality, CRM/tool stack, and owner/operator details should be captured during outreach.',
      'Current profile is business-focused and does not use private personal data.'
    ],
    reviewSignals: [
      'Look for review mentions of response time, missed calls, scheduling, quoting, communication, reminders, or follow-up.',
      'Check whether public reviews mention staff being busy, booking delays, admin confusion, or unclear next steps.',
      'Capture exact customer language for Kadwell content/funnel counter-articles.',
      ...(hasHiringSignal ? ['Compare review/customer language against hiring-post pain language to validate whether the job role is masking a workflow/system problem.'] : [])
    ],
    sellingPoints: buildSellingPoints(candidate),
    discoveryQuestions: [
      ...buildDiscoveryQuestions(candidate),
      ...(hasHiringSignal ? ['I noticed you are hiring for automation and systems work — what are you hoping that role would fix first?'] : [])
    ],
    firstCallAngle: `Lead with a practical workflow question around intake, follow-up, and handoffs for a ${industry.toLowerCase()} business in ${location}.`,
    fitScore: Math.min(100, scoreFit(candidate) + hiringScore.fitBoost),
    painScore: Math.min(100, scorePain(candidate) + hiringScore.painBoost),
    reachabilityScore: Math.min(100, scoreReachability(candidate) + hiringScore.reachabilityBoost),
    valueScore: Math.min(100, scoreValue(candidate) + hiringScore.valueBoost),
    hiringSignalScore: hiringScore.total,
    osintRefreshedAt: options.refreshedAt,
    jobPostSignals: hiringSignals,
    contact,
    websiteAudit: {
      grade: website ? 'C' : 'D',
      conversionIssues: [
        website ? 'Website exists; map whether the primary CTA leads to a measurable intake path.' : 'No website captured in seed data; use phone-first outreach and add website if found.',
        ...validatedWebsiteConversionIssues(websiteEnrichment),
        'Map whether contact forms trigger structured follow-up, routing, reminders, or CRM capture.',
        'Map whether calls, forms, emails, and reviews are connected to one operational workflow.'
      ],
      systemSignals: [
        candidate.publicTags.opening_hours ? `Published hours suggest schedule-sensitive intake: ${candidate.publicTags.opening_hours}` : 'Operating hours not captured in seed record.',
        hasDirectContact ? 'Public contact channel exists; useful for outbound validation.' : 'No direct public contact channel captured yet.',
        ...validatedWebsiteSystemSignals(websiteEnrichment),
        `${industry} businesses commonly need repeatable intake, scheduling, quoting, reminder, and follow-up systems.`,
        ...(hasHiringSignal ? [`Job-post signal: automation and systems hiring intent detected. ${summarizeHiringSignals(hiringSignals)}`] : [])
      ],
      quickWins: [
        'Verify website CTA/contact form path and map what happens after submission.',
        ...validatedWebsiteQuickWins(websiteEnrichment),
        'Look for missed-call, quote-request, booking, reminder, review-request, and reactivation automation opportunities.',
        'Capture one concrete public friction point before calling so the outreach feels specific.'
      ],
      technicalNotes: [
        ...(candidate.address ? [`Street address: ${candidate.address}`] : []),
        ...(options.refreshedAt ? [`Profile refreshed ${options.refreshedAt}.`] : []),
        `Seed source: ${sourceIdForCandidate(candidate)}`
      ]
    },
    accountability: {
      dataPolicy: 'Real public data only; no synthetic, demo, or example lead data.',
      profileStatus: websiteEnrichment ? 'Website source validated from live fetch; non-website claims still require validation.' : 'Generated from seed record; not live-source revalidated yet.',
      scoreStatus: 'AWC rubric score from captured fields, not a verified pain claim.',
      validationStatus: websiteEnrichment ? 'Partially validated' : 'Seed only',
      lastProfileGeneratedAt: options.refreshedAt,
      lastSourceValidatedAt,
      sourceLedger: profileSources.filter((source) => !['Canada Job Bank', 'Indeed', 'LinkedIn Jobs search'].includes(source.label)),
      validationQueue: buildValidationQueue({ candidate, websiteEnrichment, validatedWebsiteSource, hiringSignals }),
      unknowns: [
        ...(websiteEnrichment ? [] : ['Live website CTA/form behavior has not been validated in this browser session.']),
        'Review language has not been captured or quoted yet.',
        'Decision-maker identity is unknown until verified from a public source or call discovery.',
        'Current tool stack, CRM, booking system, and automation maturity are unknown until direct website inspection or discovery.'
      ],
      requiredValidationSteps: [
        'Open and inspect the company website/contact path.',
        'Capture exact public review or customer-language evidence before referencing pain.',
        'Confirm contact details before outreach.',
        'Record any live-source findings with source URL, timestamp, and exact evidence text.'
      ]
    },
    sources: profileSources
  };
}

export function buildLeadProfilesFromCandidates(candidates: CandidateBusiness[]): Lead[] {
  return candidates.map((candidate) => buildLeadProfileFromCandidate(candidate));
}
