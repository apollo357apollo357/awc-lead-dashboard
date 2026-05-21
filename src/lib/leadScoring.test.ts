import { describe, expect, it } from 'vitest';
import type { Lead } from '../types';
import { calculatePriorityScore, gradeLead, summarizeLeadForCall } from './leadScoring';

const baseLead: Lead = {
  id: 'test',
  companyName: 'Test Services',
  website: 'https://example.com',
  industry: 'Home services',
  niches: ['Home services', 'Field service'],
  location: 'Edmonton, AB',
  status: 'New',
  summary: 'A growing service business with visible intake and scheduling complexity.',
  strengths: ['Strong local reviews'],
  weaknesses: ['No online booking'],
  reviewSignals: ['Customers mention scheduling delays'],
  sellingPoints: ['Automate intake to scheduling handoff'],
  discoveryQuestions: ['How do new inquiries get routed today?'],
  firstCallAngle: 'Lead with visible intake friction and review-backed scheduling pain.',
  fitScore: 80,
  painScore: 70,
  reachabilityScore: 60,
  valueScore: 90,
  contact: {
    name: 'Jordan Owner',
    title: 'Owner',
    summary: 'Business owner/operator focused on growth.',
    conversationOpeners: ['Mention their strong reviews.'],
    boundaries: ['Keep outreach business-focused.'],
    sources: [{ label: 'Company About', url: 'https://example.com/about' }]
  },
  websiteAudit: {
    grade: 'C',
    conversionIssues: ['No clear booking CTA'],
    systemSignals: ['Generic contact form only'],
    quickWins: ['Add qualified intake form'],
    technicalNotes: ['Needs manual verification']
  },
  sources: [{ label: 'Website', url: 'https://example.com' }]
};

describe('lead scoring', () => {
  it('calculates a weighted priority score from fit, pain, reachability, and value', () => {
    expect(calculatePriorityScore(baseLead)).toBe(77);
  });

  it('grades leads by priority score', () => {
    expect(gradeLead({ ...baseLead, fitScore: 95, painScore: 95, reachabilityScore: 90, valueScore: 95 })).toBe('A');
    expect(gradeLead({ ...baseLead, fitScore: 40, painScore: 40, reachabilityScore: 40, valueScore: 40 })).toBe('D');
  });

  it('creates a concise call prep summary with company, contact, angle, and top questions', () => {
    const summary = summarizeLeadForCall(baseLead);
    expect(summary).toContain('Test Services');
    expect(summary).toContain('Jordan Owner');
    expect(summary).toContain('Lead with visible intake friction');
    expect(summary).toContain('How do new inquiries get routed today?');
  });
});
