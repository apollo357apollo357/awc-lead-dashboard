import { describe, expect, it } from 'vitest';
import type { JobPostSignal } from '../types';
import { buildJobSearchUrls, scoreHiringSignals, summarizeHiringSignals } from './hiringSignals';

const strongSignal: JobPostSignal = {
  id: 'job-1',
  title: 'Operations Automation Specialist',
  source: 'Canada Job Bank',
  sourceUrl: 'https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=automation',
  postedAt: '2026-05-20',
  location: 'Edmonton, AB',
  keywords: ['automation', 'CRM', 'workflow', 'reporting', 'integrations'],
  tools: ['HubSpot', 'Zapier', 'Power BI'],
  painSignals: ['manual reporting', 'CRM cleanup', 'workflow automation backlog'],
  awcAngle: 'Offer a systems audit before they commit to a full-time automation hire.'
};

describe('job-post hiring signals', () => {
  it('scores hiring posts that mention AI, automation, CRM, workflow, integrations, and reporting', () => {
    const score = scoreHiringSignals([strongSignal]);

    expect(score.total).toBeGreaterThanOrEqual(80);
    expect(score.painBoost).toBe(15);
    expect(score.valueBoost).toBe(10);
    expect(score.fitBoost).toBe(5);
    expect(score.reachabilityBoost).toBe(5);
  });

  it('summarizes hiring signals into AWC sales language', () => {
    const summary = summarizeHiringSignals([strongSignal]);

    expect(summary).toContain('Operations Automation Specialist');
    expect(summary).toContain('HubSpot');
    expect(summary).toContain('manual reporting');
    expect(summary).toContain('systems audit');
  });

  it('builds source search URLs for public job boards without scraping private LinkedIn pages', () => {
    const urls = buildJobSearchUrls('Go Asphalt Ltd', 'Edmonton, AB');

    expect(urls.some((source) => source.label === 'Canada Job Bank')).toBe(true);
    expect(urls.some((source) => source.label === 'Indeed')).toBe(true);
    expect(urls.some((source) => source.label === 'LinkedIn Jobs search')).toBe(true);
    expect(urls.find((source) => source.label === 'LinkedIn Jobs search')?.note).toContain('manual/authorized review');
  });
});
