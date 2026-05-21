import type { CallLog, Lead } from '../types';

const clampScore = (score: number) => Math.max(0, Math.min(100, Math.round(score)));
const conversationOutcomes: CallLog['outcome'][] = ['Connected', 'Follow-up needed'];

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
  const emailContext = lead.contact.email ? `\nEmail during call: ${lead.contact.email}` : '';

  return `${lead.companyName} (${lead.industry}, ${lead.location})\nContact: ${lead.contact.name}, ${lead.contact.title}${emailContext}\nPriority: ${gradeLead(lead)} / ${calculatePriorityScore(lead)}\nAngle: ${lead.firstCallAngle}${reviewContext}\nTop discovery questions:\n${topQuestions}`;
}

export function countWeeklyConversations(logs: CallLog[], start: Date, end: Date): number {
  return logs.filter((log) => {
    const createdAt = new Date(log.createdAt);
    return createdAt >= start && createdAt < end && conversationOutcomes.includes(log.outcome);
  }).length;
}

export function createVoicemailScript(lead: Lead): string {
  const question = lead.discoveryQuestions[0] ?? 'how your team handles repeat workflow bottlenecks today';
  const emailLine = lead.contact.email
    ? `I also have ${lead.contact.email.toLowerCase()} here, so I can send the quick notes I mentioned.`
    : 'If you prefer, I can send the quick notes by email once I have the best address.';

  return `Hi ${lead.contact.name}, this is Apollo with Automated Workflow Consulting. I was looking at ${lead.companyName} and noticed a possible systems opportunity around ${lead.firstCallAngle.toLowerCase()}\n\nI had one quick question: ${question}\n\n${emailLine}\n\nIf this is worth a quick conversation, call me back and I can keep it practical — where leads, follow-ups, and handoffs are creating friction, and what could be automated without adding another tool.`;
}

export function enrichLeadScores(lead: Lead): Lead {
  return {
    ...lead,
    priorityScore: calculatePriorityScore(lead)
  };
}
