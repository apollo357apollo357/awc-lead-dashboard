import { describe, expect, it } from 'vitest';
import type { CandidateBusiness } from '../types';
import { buildLeadProfileFromCandidate, normalizeCandidateWebsite, sourceIdForCandidate } from './osint';

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

  it('records Re-OSINT refresh metadata when provided', () => {
    const lead = buildLeadProfileFromCandidate(candidate, { refreshedAt: '2026-05-21T12:00:00.000Z' });

    expect(lead.osintRefreshedAt).toBe('2026-05-21T12:00:00.000Z');
    expect(lead.websiteAudit.technicalNotes.join(' ')).toContain('Re-OSINT refreshed');
    expect(lead.sources).toContainEqual(expect.objectContaining({ note: expect.stringContaining('Refreshed 2026-05-21T12:00:00.000Z') }));
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
