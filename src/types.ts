export type EvidenceSource = {
  label: string;
  url: string;
  note?: string;
};

export type ContactProfile = {
  name: string;
  title: string;
  linkedinUrl?: string;
  email?: string;
  phone?: string;
  summary: string;
  conversationOpeners: string[];
  boundaries: string[];
  sources: EvidenceSource[];
};

export type WebsiteAudit = {
  grade: 'A' | 'B' | 'C' | 'D';
  conversionIssues: string[];
  systemSignals: string[];
  quickWins: string[];
  technicalNotes: string[];
};

export type CallLog = {
  id: string;
  leadId: string;
  createdAt: string;
  outcome: 'Called' | 'Left voicemail' | 'Connected' | 'Follow-up needed' | 'Not interested';
  comment: string;
  reservation?: string;
  feedback?: string;
  friction?: string;
  emailSent?: boolean;
};

export type JobPostSignal = {
  id: string;
  title: string;
  source: 'Canada Job Bank' | 'Indeed' | 'LinkedIn Jobs' | 'Company careers' | 'Manual source';
  sourceUrl: string;
  postedAt?: string;
  location: string;
  keywords: string[];
  tools: string[];
  painSignals: string[];
  awcAngle: string;
};

export type CandidateBusiness = {
  id: string;
  source: 'OpenStreetMap';
  sourceUrl: string;
  companyName: string;
  category: string;
  location: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  lat: number;
  lon: number;
  publicTags: Record<string, string>;
  jobPostSignals?: JobPostSignal[];
};

export type Lead = {
  id: string;
  companyName: string;
  website: string;
  industry: string;
  niches: string[];
  location: string;
  address?: string;
  phone?: string;
  status: 'New' | 'Researching' | 'Qualified' | 'Contacted' | 'Follow-up' | 'Not fit';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  reviewSignals: string[];
  sellingPoints: string[];
  discoveryQuestions: string[];
  firstCallAngle: string;
  fitScore: number;
  painScore: number;
  reachabilityScore: number;
  valueScore: number;
  priorityScore?: number;
  hiringSignalScore?: number;
  osintRefreshedAt?: string;
  jobPostSignals?: JobPostSignal[];
  contact: ContactProfile;
  websiteAudit: WebsiteAudit;
  sources: EvidenceSource[];
};
