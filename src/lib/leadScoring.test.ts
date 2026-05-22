import { describe, expect, it } from 'vitest';
import type { Lead } from '../types';
import { calculatePriorityScore, countWeeklyConversations, createVoicemailScript, gradeLead, summarizeLeadForCall } from './leadScoring';

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
    email: 'jordan@example.com',
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
  accountability: {
    dataPolicy: 'Real public data only; no synthetic, demo, or example lead data.',
    profileStatus: 'Generated from seed record; not live-source revalidated yet.',
    scoreStatus: 'AWC rubric score from captured fields, not a verified pain claim.',
    validationStatus: 'Seed only',
    sourceLedger: [{ label: 'Website', url: 'https://example.com' }],
    validationQueue: [
      { category: 'Website', status: 'not checked', evidenceCount: 0, nextStep: 'Open and inspect the company website/contact path.', sourceUrl: 'https://example.com' },
      { category: 'Reviews', status: 'not checked', evidenceCount: 0, nextStep: 'Capture quoted review language.' },
      { category: 'Jobs', status: 'not checked', evidenceCount: 0, nextStep: 'Check public job boards.' },
      { category: 'Contact', status: 'not checked', evidenceCount: 0, nextStep: 'Validate contact details.' },
      { category: 'Decision maker', status: 'not checked', evidenceCount: 0, nextStep: 'Verify the decision maker.' }
    ],
    unknowns: ['Live website CTA/form behavior has not been validated in this browser session.'],
    requiredValidationSteps: ['Open and inspect the company website/contact path.']
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

  it('counts only real conversations toward the weekly outbound goal', () => {
    const logs = [
      { id: '1', leadId: 'test', createdAt: '2026-06-10T10:00:00.000Z', outcome: 'Left voicemail' as const, comment: 'No answer' },
      { id: '2', leadId: 'test', createdAt: '2026-06-11T10:00:00.000Z', outcome: 'Connected' as const, comment: 'Spoke with owner' },
      { id: '3', leadId: 'test', createdAt: '2026-06-12T10:00:00.000Z', outcome: 'Follow-up needed' as const, comment: 'Real conversation, asked for email' },
      { id: '4', leadId: 'test', createdAt: '2026-06-01T10:00:00.000Z', outcome: 'Connected' as const, comment: 'Previous week' }
    ];

    expect(countWeeklyConversations(logs, new Date('2026-06-10T00:00:00.000Z'), new Date('2026-06-17T00:00:00.000Z'))).toBe(2);
  });

  it('creates a tailored voicemail script with the lead angle and email follow-up hook', () => {
    const script = createVoicemailScript(baseLead);

    expect(script).toContain('Jordan Owner');
    expect(script).toContain('Test Services');
    expect(script).toContain('Jordan@example.com'.toLowerCase());
    expect(script).toContain('How do new inquiries get routed today?');
    expect(script).toContain('Apollo with Automated Workflow Consulting');
  });
});
