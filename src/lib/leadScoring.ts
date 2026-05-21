import type { Lead } from '../types';

const clampScore = (score: number) => Math.max(0, Math.min(100, Math.round(score)));

export function calculatePriorityScore(lead: Pick<Lead, 'fitScore' | 'painScore' | 'reachabilityScore' | 'valueScore'>): number {
  const weighted =
    lead.fitScore * 0.3 +
    lead.painScore * 0.3 +
    lead.reachabilityScore * 0.15 +
    lead.valueScore * 0.25;

  return clampScore(weighted);
}

export function gradeLead(lead: Pick<Lead, 'fitScore' | 'painScore' | 'reachabilityScore' | 'valueScore'>): 'A' | 'B' | 'C' | 'D' {
  const score = calculatePriorityScore(lead);
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  return 'D';
}

export function summarizeLeadForCall(lead: Lead): string {
  const topQuestions = lead.discoveryQuestions.slice(0, 3).map((question) => `- ${question}`).join('\n');
  const reviewContext = lead.reviewSignals.length > 0
    ? `\nReview signals: ${lead.reviewSignals.slice(0, 2).join('; ')}.`
    : '';

  return `${lead.companyName} (${lead.industry}, ${lead.location})\nContact: ${lead.contact.name}, ${lead.contact.title}\nPriority: ${gradeLead(lead)} / ${calculatePriorityScore(lead)}\nAngle: ${lead.firstCallAngle}${reviewContext}\nTop discovery questions:\n${topQuestions}`;
}

export function enrichLeadScores(lead: Lead): Lead {
  return {
    ...lead,
    priorityScore: calculatePriorityScore(lead)
  };
}
