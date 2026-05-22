import type { CandidateBusiness, Lead } from '../types';
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

type BuildLeadProfileOptions = {
  refreshedAt?: string;
};

export function buildLeadProfileFromCandidate(candidate: CandidateBusiness, options: BuildLeadProfileOptions = {}): Lead {
  const website = normalizeCandidateWebsite(candidate.website);
  const industry = categoryLabel(candidate.category);
  const location = candidate.location || 'Edmonton region, AB';
  const hasDirectContact = Boolean(candidate.phone || candidate.email || website);
  const refreshedNote = options.refreshedAt ? `Refreshed ${options.refreshedAt}` : undefined;
  const hiringSignals = candidate.jobPostSignals ?? [];
  const hiringScore = scoreHiringSignals(hiringSignals);
  const hasHiringSignal = hiringSignals.length > 0;

  return {
    id: candidate.id,
    companyName: candidate.companyName,
    website,
    industry,
    niches: inferNiches(candidate),
    location,
    address: candidate.address,
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
    contact: {
      name: 'Business owner / operations lead',
      title: `Decision maker for ${candidate.companyName}`,
      email: candidate.email,
      phone: candidate.phone,
      summary: 'Start with the owner/operator or operations lead unless a public website, LinkedIn page, registry page, or call discovery identifies a more specific contact.',
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
      sources: [{ label: 'OpenStreetMap candidate record', url: candidate.sourceUrl, note: sourceIdForCandidate(candidate) }]
    },
    websiteAudit: {
      grade: website ? 'C' : 'D',
      conversionIssues: [
        website ? 'Website exists; map whether the primary CTA leads to a measurable intake path.' : 'No website captured in seed data; use phone-first outreach and add website if found.',
        'Map whether contact forms trigger structured follow-up, routing, reminders, or CRM capture.',
        'Map whether calls, forms, emails, and reviews are connected to one operational workflow.'
      ],
      systemSignals: [
        candidate.publicTags.opening_hours ? `Published hours suggest schedule-sensitive intake: ${candidate.publicTags.opening_hours}` : 'Operating hours not captured in seed record.',
        hasDirectContact ? 'Public contact channel exists; useful for outbound validation.' : 'No direct public contact channel captured yet.',
        `${industry} businesses commonly need repeatable intake, scheduling, quoting, reminder, and follow-up systems.`,
        ...(hasHiringSignal ? [`Job-post signal: automation and systems hiring intent detected. ${summarizeHiringSignals(hiringSignals)}`] : [])
      ],
      quickWins: [
        'Verify website CTA/contact form path and map what happens after submission.',
        'Look for missed-call, quote-request, booking, reminder, review-request, and reactivation automation opportunities.',
        'Capture one concrete public friction point before calling so the outreach feels specific.'
      ],
      technicalNotes: [
        'Workflow profile generated from public listing data and AWC outreach scoring.',
        ...(options.refreshedAt ? [`Re-OSINT refreshed ${options.refreshedAt}; profile regenerated against the current AWC asks, buckets, and scoring architecture.`] : []),
        `Seed source: ${sourceIdForCandidate(candidate)}`,
        `Coordinates: ${candidate.lat}, ${candidate.lon}`
      ]
    },
    sources: [
      { label: 'OpenStreetMap candidate record', url: candidate.sourceUrl, note: [sourceIdForCandidate(candidate), refreshedNote].filter(Boolean).join(' · ') },
      ...(website ? [{ label: 'Company website', url: website, note: ['Captured from public listing.', refreshedNote].filter(Boolean).join(' · ') }] : []),
      ...hiringSignals.map((signal) => ({ label: `${signal.source} hiring signal`, url: signal.sourceUrl, note: `${signal.title}${signal.postedAt ? ` · Posted ${signal.postedAt}` : ''}` })),
      ...buildJobSearchUrls(candidate.companyName, location)
    ]
  };
}

export function buildLeadProfilesFromCandidates(candidates: CandidateBusiness[]): Lead[] {
  return candidates.map((candidate) => buildLeadProfileFromCandidate(candidate));
}
