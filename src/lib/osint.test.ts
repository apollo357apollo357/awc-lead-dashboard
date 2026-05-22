import { describe, expect, it } from 'vitest';
import type { CandidateBusiness } from '../types';
import { buildLeadProfileFromCandidate, normalizeCandidateWebsite, sourceIdForCandidate } from './osint';
import type { AwcWebsiteEnrichment } from './enrichment';

const candidate: CandidateBusiness = {
  id: 'osm-node-1',
  source: 'OpenStreetMap',
  sourceUrl: 'https://www.openstreetmap.org/node/1',
  companyName: 'Ryfan Industrial Electric',
  category: 'electrician',
  location: 'Spruce Grove, AB',
  address: '485 South Avenue',
  website: 'https://www.ryfan.ca',
  phone: '+1 780 571 8000',
  email: '',
  lat: 53.5395002,
  lon: -113.8873709,
  publicTags: {
    craft: 'electrician',
    opening_hours: 'Mo-Fr 07:30-16:00'
  }
};

describe('real candidate OSINT profile builder', () => {
  it('uses a stable source id so every scraped business is its own profile', () => {
    expect(sourceIdForCandidate(candidate)).toBe('OpenStreetMap:osm-node-1');
  });

  it('normalizes websites without inventing missing URLs', () => {
    expect(normalizeCandidateWebsite('villagemuffler.ca')).toBe('https://villagemuffler.ca');
    expect(normalizeCandidateWebsite('')).toBe('');
  });

  it('builds a lead profile from real candidate data without fake personal contact names', () => {
    const lead = buildLeadProfileFromCandidate(candidate);

    expect(lead.id).toBe('osm-node-1');
    expect(lead.companyName).toBe('Ryfan Industrial Electric');
    expect(lead.website).toBe('https://www.ryfan.ca');
    expect(lead.contact.name).toBe('Business owner / operations lead');
    expect(lead.contact.title).toContain('Decision maker');
    expect(lead.sources).toContainEqual(expect.objectContaining({ label: 'OpenStreetMap candidate record' }));
    expect(lead.discoveryQuestions.length).toBeGreaterThanOrEqual(3);
    expect(lead.websiteAudit.technicalNotes.join(' ')).toContain('Workflow profile generated');
  });

  it('records profile refresh metadata when provided without implying live source revalidation', () => {
    const lead = buildLeadProfileFromCandidate(candidate, { refreshedAt: '2026-05-21T12:00:00.000Z' });

    expect(lead.osintRefreshedAt).toBe('2026-05-21T12:00:00.000Z');
    expect(lead.websiteAudit.technicalNotes.join(' ')).toContain('Profile refreshed');
    expect(lead.websiteAudit.technicalNotes.join(' ')).not.toContain('Re-OSINT refreshed');
    expect(lead.sources).toContainEqual(expect.objectContaining({ note: expect.stringContaining('Profile refreshed 2026-05-21T12:00:00.000Z') }));
  });

  it('declares evidence limits, real-data policy, and required validation steps', () => {
    const lead = buildLeadProfileFromCandidate(candidate);

    expect(lead.accountability.dataPolicy).toBe('Real public data only; no synthetic, demo, or example lead data.');
    expect(lead.accountability.profileStatus).toBe('Generated from seed record; not live-source revalidated yet.');
    expect(lead.accountability.scoreStatus).toBe('AWC rubric score from captured fields, not a verified pain claim.');
    expect(lead.accountability.unknowns).toEqual(expect.arrayContaining([
      'Live website CTA/form behavior has not been validated in this browser session.',
      'Review language has not been captured or quoted yet.',
      'Decision-maker identity is unknown until verified from a public source or call discovery.'
    ]));
    expect(lead.accountability.requiredValidationSteps).toEqual(expect.arrayContaining([
      'Open and inspect the company website/contact path.',
      'Capture exact public review or customer-language evidence before referencing pain.',
      'Confirm contact details before outreach.'
    ]));
  });

  const websiteEnrichment: AwcWebsiteEnrichment = {
    candidateId: candidate.id,
    companyName: candidate.companyName,
    website: {
      url: 'https://www.ryfan.ca',
      title: 'Ryfan Industrial Electric',
      description: 'Industrial electrical services in Alberta.'
    },
    contacts: {
      emails: ['service@ryfan.ca'],
      phones: ['+178****8000']
    },
    intakeChannels: ['phone', 'email', 'contact form'],
    ctas: ['Request Service', 'Contact Us'],
    forms: [{ action: '/contact', method: 'post', fields: ['name', 'email', 'phone', 'message'] }],
    techStack: ['Google Tag Manager', 'WordPress'],
    workflowSignals: ['Phone and form intake both exist; map whether they land in one follow-up workflow.'],
    sources: [{
      type: 'website',
      url: 'https://www.ryfan.ca',
      capturedAt: '2026-05-22T15:30:00.000Z',
      fields: ['emails', 'phones', 'forms', 'ctas', 'techStack', 'workflowSignals']
    }],
    reviewEvidence: [{ label: 'Reviews', url: 'https://www.ryfan.ca/reviews', note: 'Review/testimonial page linked from website.' }],
    jobEvidence: [{ label: 'Careers', url: 'https://www.ryfan.ca/careers', note: 'Careers page linked from website.' }],
    decisionMakerEvidence: [{ name: 'Jane Smith', title: 'Operations Manager', sourceUrl: 'https://www.ryfan.ca/about', note: 'Public team page mention.' }]
  };

  it('applies live website enrichment as validated evidence without inventing missing claims', () => {
    const lead = buildLeadProfileFromCandidate(candidate, { websiteEnrichment });

    expect(lead.accountability.validationStatus).toBe('Partially validated');
    expect(lead.accountability.lastSourceValidatedAt).toBe('2026-05-22T15:30:00.000Z');
    expect(lead.accountability.profileStatus).toBe('Website source validated from live fetch; non-website claims still require validation.');
    expect(lead.accountability.sourceLedger).toContainEqual(expect.objectContaining({
      label: 'Validated website fetch',
      url: 'https://www.ryfan.ca',
      note: expect.stringContaining('Captured 2026-05-22T15:30:00.000Z')
    }));
    expect(lead.websiteAudit.systemSignals).toEqual(expect.arrayContaining([
      'Validated intake channels: phone, email, contact form.',
      'Validated tools/scripts: Google Tag Manager, WordPress.'
    ]));
    expect(lead.websiteAudit.conversionIssues).toContain('Validated website has 1 form(s); inspect destination, routing, notification owner, and CRM capture.');
    expect(lead.contact.email).toBe('service@ryfan.ca');
  });

  it('builds a source validation queue with statuses for website, reviews, jobs, contact, and decision maker', () => {
    const seedOnlyLead = buildLeadProfileFromCandidate(candidate);
    const validatedLead = buildLeadProfileFromCandidate(candidate, { websiteEnrichment });
    const hiringLead = buildLeadProfileFromCandidate({
      ...candidate,
      jobPostSignals: [{
        id: 'ryfan-automation-job',
        title: 'Automation and Systems Coordinator',
        source: 'Canada Job Bank',
        sourceUrl: 'https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=automation',
        postedAt: '2026-05-20',
        location: 'Spruce Grove, AB',
        keywords: ['automation'],
        tools: ['HubSpot'],
        painSignals: ['manual reporting'],
        awcAngle: 'Position AWC as a faster systems audit before a permanent hire.'
      }]
    });

    expect(seedOnlyLead.accountability.validationQueue.map((item) => item.category)).toEqual([
      'Website', 'Reviews', 'Jobs', 'Contact', 'Decision maker'
    ]);
    expect(seedOnlyLead.accountability.validationQueue.find((item) => item.category === 'Website')).toMatchObject({ status: 'not checked' });
    expect(seedOnlyLead.accountability.validationQueue.find((item) => item.category === 'Reviews')).toMatchObject({ status: 'not checked' });
    expect(validatedLead.accountability.validationQueue.find((item) => item.category === 'Website')).toMatchObject({ status: 'validated', evidenceCount: 1 });
    expect(validatedLead.accountability.validationQueue.find((item) => item.category === 'Contact')).toMatchObject({ status: 'validated' });
    expect(validatedLead.accountability.validationQueue.find((item) => item.category === 'Reviews')).toMatchObject({ status: 'validated', evidenceCount: 1 });
    expect(validatedLead.accountability.validationQueue.find((item) => item.category === 'Jobs')).toMatchObject({ status: 'validated', evidenceCount: 1 });
    expect(validatedLead.accountability.validationQueue.find((item) => item.category === 'Decision maker')).toMatchObject({ status: 'validated', evidenceCount: 1 });
    expect(validatedLead.accountability.sourceLedger).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: 'Validated review source', url: 'https://www.ryfan.ca/reviews' }),
      expect.objectContaining({ label: 'Validated careers/jobs source', url: 'https://www.ryfan.ca/careers' }),
      expect.objectContaining({ label: 'Validated decision-maker source', url: 'https://www.ryfan.ca/about' })
    ]));
    expect(hiringLead.accountability.validationQueue.find((item) => item.category === 'Jobs')).toMatchObject({ status: 'validated', evidenceCount: 1 });
  });

  it('adds hiring-post signals to the lead profile and score buckets', () => {
    const lead = buildLeadProfileFromCandidate({
      ...candidate,
      jobPostSignals: [{
        id: 'ryfan-automation-job',
        title: 'Automation and Systems Coordinator',
        source: 'Canada Job Bank',
        sourceUrl: 'https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=automation',
        postedAt: '2026-05-20',
        location: 'Spruce Grove, AB',
        keywords: ['automation', 'workflow', 'CRM', 'reporting'],
        tools: ['HubSpot', 'Zapier'],
        painSignals: ['manual reporting', 'CRM cleanup'],
        awcAngle: 'Position AWC as a faster systems audit before a permanent hire.'
      }]
    });

    expect(lead.jobPostSignals).toHaveLength(1);
    expect(lead.hiringSignalScore).toBeGreaterThanOrEqual(80);
    expect(lead.painScore).toBeGreaterThan(buildLeadProfileFromCandidate(candidate).painScore);
    expect(lead.valueScore).toBeGreaterThan(buildLeadProfileFromCandidate(candidate).valueScore);
    expect(lead.websiteAudit.systemSignals.join(' ')).toContain('automation and systems hiring intent');
    expect(lead.discoveryQuestions.join(' ')).toContain('hiring for automation');
  });

  it('scores visible reachability from public phone, email, and website fields', () => {
    const richLead = buildLeadProfileFromCandidate({ ...candidate, email: 'info@example.com' });
    const sparseLead = buildLeadProfileFromCandidate({ ...candidate, website: '', phone: '', email: '' });

    expect(richLead.reachabilityScore).toBeGreaterThan(sparseLead.reachabilityScore);
  });
});
