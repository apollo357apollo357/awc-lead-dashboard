import type { Lead } from '../types';
import { enrichLeadScores } from '../lib/leadScoring';

export const sampleLeads: Lead[] = [
  enrichLeadScores({
    id: 'prairie-peak-hvac',
    companyName: 'Prairie Peak HVAC',
    website: 'https://example.com/prairie-peak-hvac',
    industry: 'Commercial HVAC service',
    location: 'Edmonton, AB',
    address: 'Public business address to be verified',
    phone: 'Public business phone to be verified',
    status: 'Qualified',
    summary: 'Fictional example of a regional service business with recurring dispatch, quote, maintenance, and follow-up workflows. The lead is designed to show how AWC should summarize public research without private-data creep.',
    strengths: [
      'Clear local service niche with repeat customer potential',
      'Operationally complex enough to benefit from intake, dispatch, quoting, and follow-up systems',
      'Review profile would be a useful source for communication and scheduling friction signals'
    ],
    weaknesses: [
      'Likely phone/email-heavy intake flow',
      'No visible structured lead qualification path in the sample',
      'Service businesses often lose margin when scheduling, quotes, invoices, and reminders live in separate tools'
    ],
    reviewSignals: [
      'Look for public review mentions of response time, missed appointments, quote delays, or billing confusion',
      'Positive reviews can also reveal strengths to preserve while automating'
    ],
    sellingPoints: [
      'Map inquiry → qualification → dispatch → quote → invoice → review request as one connected workflow',
      'Add structured intake so urgent jobs, maintenance, and quote requests route differently',
      'Create visibility for owner/operator without requiring them to be the traffic controller'
    ],
    discoveryQuestions: [
      'When a new request comes in, where does it go first and who decides what happens next?',
      'How do you know a quote, maintenance reminder, or invoice has not fallen through the cracks?',
      'Which part of the job cycle still depends on one person remembering the next step?'
    ],
    firstCallAngle: 'Reference public-facing intake complexity, then ask how requests move from first contact to scheduled work and follow-up.',
    fitScore: 88,
    painScore: 82,
    reachabilityScore: 72,
    valueScore: 86,
    contact: {
      name: 'Owner / Operations Manager',
      title: 'Likely decision maker',
      linkedinUrl: 'LinkedIn URL to be added from public source',
      summary: 'Use LinkedIn only for professional context: role, tenure, business themes, public posts, and shared local/business context. Do not include personal-life details.',
      conversationOpeners: [
        "Mention the company's visible service mix and ask how intake is routed today.",
        'If reviews mention communication delays, frame it as a systems opportunity rather than criticism.',
        'Ask what would become easier if the owner had one dashboard for open jobs, quotes, invoices, and follow-ups.'
      ],
      boundaries: [
        'Do not use private emails, breached data, home addresses, or family details.',
        'Only reference business-visible facts naturally in outreach.',
        'Keep LinkedIn summary limited to public professional context.'
      ],
      sources: [
        { label: 'Company website', url: 'https://example.com/prairie-peak-hvac', note: 'Replace with real source during research.' },
        { label: 'LinkedIn profile/company page', url: 'https://www.linkedin.com', note: 'Public professional context only.' }
      ]
    },
    websiteAudit: {
      grade: 'C',
      conversionIssues: [
        'No obvious segmented CTA for emergency, quote, maintenance, and commercial requests',
        'Generic contact flow may force staff to manually triage every inquiry'
      ],
      systemSignals: [
        'Phone-first service motion likely creates owner/operator interruption risk',
        'No visible automation around review requests, maintenance reminders, or quote follow-up'
      ],
      quickWins: [
        'Add a structured intake form with request type, urgency, location, and asset details',
        'Route form submissions into CRM/dispatch board with automatic confirmation',
        'Create post-job review and maintenance reminder automation'
      ],
      technicalNotes: [
        'Run page-speed/mobile checks during real enrichment',
        'Capture source links and screenshots for every audit claim'
      ]
    },
    sources: [
      { label: 'Website', url: 'https://example.com/prairie-peak-hvac' },
      { label: 'Google Business Profile / reviews', url: 'https://www.google.com/search?q=example+hvac+edmonton' }
    ]
  })
];
