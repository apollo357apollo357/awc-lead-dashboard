import type { Lead } from '../types';
import { enrichLeadScores } from '../lib/leadScoring';

export const sampleLeads: Lead[] = [
  enrichLeadScores({
    id: 'prairie-peak-hvac',
    companyName: 'Prairie Peak HVAC',
    website: 'https://example.com/prairie-peak-hvac',
    industry: 'Commercial HVAC service',
    niches: ['HVAC', 'Commercial service', 'Field service', 'Maintenance contracts'],
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
      email: 'ops@example.com',
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
  }),
  enrichLeadScores({
    id: 'northline-dental-group',
    companyName: 'Northline Dental Group',
    website: 'https://example.com/northline-dental',
    industry: 'Dental clinic',
    niches: ['Dental', 'Healthcare', 'Appointment-based service', 'Patient intake'],
    location: 'Calgary, AB',
    phone: 'Public business phone to be verified',
    status: 'Researching',
    summary: 'Fictional multi-provider clinic lead showing appointment flow, patient intake, insurance/document collection, reminders, and review follow-up opportunities.',
    strengths: ['High appointment volume', 'Recurring patient communication needs', 'Clear operational value from reduced no-shows and smoother intake'],
    weaknesses: ['Patient forms, reminders, and follow-up may be split across tools', 'Front desk team likely handles repetitive status questions', 'Website may not clearly route emergency, new patient, and hygiene requests'],
    reviewSignals: ['Look for wait-time, reminder, insurance, and booking-friction mentions', 'Flag positive staff/process mentions to preserve in automation'],
    sellingPoints: ['Automate appointment reminders and pre-visit intake', 'Route new patient requests into a consistent qualification workflow', 'Create post-visit review and reactivation sequences'],
    discoveryQuestions: ['Where do new-patient requests go today?', 'What causes the most front-desk callbacks?', 'How are incomplete forms or missed appointments handled?'],
    firstCallAngle: 'Lead with patient intake and reminder friction, then ask where the front desk loses the most time.',
    fitScore: 80,
    painScore: 76,
    reachabilityScore: 68,
    valueScore: 78,
    contact: {
      name: 'Clinic Manager / Owner Dentist',
      title: 'Likely decision maker',
      email: 'manager@example.com',
      summary: 'Keep outreach focused on public clinic operations, patient experience, and scheduling workflow.',
      conversationOpeners: ['Ask how new patient intake is handled today.', 'Reference public booking flow if visible.', 'Frame automation around staff time and patient experience.'],
      boundaries: ['Do not infer patient data.', 'Do not collect medical/private health information.', 'Use only public business-facing facts.'],
      sources: [{ label: 'Company website', url: 'https://example.com/northline-dental' }]
    },
    websiteAudit: {
      grade: 'B',
      conversionIssues: ['New-patient CTA and emergency CTA may need separation', 'Pre-visit forms not visibly connected to booking'],
      systemSignals: ['Appointment-based business with reminder/no-show risk', 'Likely repetitive intake and insurance/document workflows'],
      quickWins: ['Segment request types', 'Add automated intake reminders', 'Trigger post-visit review requests'],
      technicalNotes: ['Verify booking platform, form handling, and mobile performance during real enrichment']
    },
    sources: [{ label: 'Website', url: 'https://example.com/northline-dental' }]
  })
];
