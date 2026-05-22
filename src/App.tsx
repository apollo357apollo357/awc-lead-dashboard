import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Building2, ExternalLink, Gauge, Mail, MapPin, MessageSquarePlus, Phone, RefreshCw, ShieldCheck, Sparkles, Target, UserRound, Voicemail, Wrench } from 'lucide-react';
import { candidateBusinesses } from './data/candidateBusinesses';
import websiteEnrichments from './data/websiteEnrichments/index.json';
import type { AwcWebsiteEnrichment } from './lib/enrichment';
import type { CallLog, CandidateBusiness, Lead } from './types';
import { buildLeadProfileFromCandidate } from './lib/osint';
import { calculatePriorityScore, countWeeklyConversations, createVoicemailScript, gradeLead, summarizeLeadForCall } from './lib/leadScoring';
import './styles.css';

const CALL_LOG_STORAGE_KEY = 'awc-lead-call-logs-v1';
const OSINT_STORAGE_KEY = 'awc-lead-osint-profile-ids-v1';
const OSINT_REFRESH_STORAGE_KEY = 'awc-lead-osint-refresh-map-v1';
const WEEKLY_CONVERSATION_GOAL = 5;
const scoreLabel = (lead: Lead) => `${gradeLead(lead)} / ${calculatePriorityScore(lead)}`;
type OsintRefreshMap = Record<string, string>;
const websiteEnrichmentMap = new Map(
  (websiteEnrichments as AwcWebsiteEnrichment[]).map((enrichment) => [enrichment.candidateId, enrichment])
);

const loadCallLogs = (): CallLog[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(CALL_LOG_STORAGE_KEY);
    return raw ? JSON.parse(raw) as CallLog[] : [];
  } catch {
    return [];
  }
};

const loadOsintProfileIds = (): string[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(OSINT_STORAGE_KEY);
    return raw ? JSON.parse(raw) as string[] : [];
  } catch {
    return [];
  }
};

const loadOsintRefreshMap = (): OsintRefreshMap => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(OSINT_REFRESH_STORAGE_KEY);
    return raw ? JSON.parse(raw) as OsintRefreshMap : {};
  } catch {
    return {};
  }
};

const formatRefreshTime = (value?: string) => {
  if (!value) return 'Not refreshed yet';
  return new Date(value).toLocaleString();
};

const startOfWeek = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

const endOfWeek = (date: Date) => {
  const end = startOfWeek(date);
  end.setDate(end.getDate() + 7);
  return end;
};

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

function SourceLinks({ lead }: { lead: Lead }) {
  const sources = [...lead.sources, ...lead.contact.sources];
  return (
    <section className="card">
      <h3>Evidence sources</h3>
      <div className="sources">
        {sources.map((source, index) => (
          <a key={`${source.label}-${source.url}-${index}`} href={source.url} target="_blank" rel="noreferrer">
            {source.label} <ExternalLink size={14} />
            {source.note ? <small>{source.note}</small> : null}
          </a>
        ))}
      </div>
    </section>
  );
}

function WeeklyMetrics({ logs }: { logs: CallLog[] }) {
  const now = new Date();
  const weeklyConversations = countWeeklyConversations(logs, startOfWeek(now), endOfWeek(now));
  const remaining = Math.max(0, WEEKLY_CONVERSATION_GOAL - weeklyConversations);

  return (
    <section className="metric-card">
      <span>Balagus outbound metric</span>
      <strong>{weeklyConversations}/{WEEKLY_CONVERSATION_GOAL}</strong>
      <p>{remaining === 0 ? 'Weekly conversation target hit.' : `${remaining} real conversation${remaining === 1 ? '' : 's'} left this week.`}</p>
      <small>Only Connected + Follow-up needed count. Voicemails do not.</small>
    </section>
  );
}

function ContactActions({ lead }: { lead: Lead }) {
  return (
    <section className="card contact-actions">
      <h3><Mail size={18} /> Email during call</h3>
      {lead.contact.email ? (
        <>
          <a href={`mailto:${lead.contact.email}?subject=${encodeURIComponent(`AWC follow-up for ${lead.companyName}`)}`}>{lead.contact.email}</a>
          <p>Use this to send notes or a follow-up resource while the conversation is live.</p>
        </>
      ) : <p>No public business email captured yet. Add it during enrichment before calling.</p>}
    </section>
  );
}

function VoicemailScript({ lead }: { lead: Lead }) {
  return (
    <section className="card callprep">
      <h3><Voicemail size={18} /> Tailored voicemail script</h3>
      <pre>{createVoicemailScript(lead)}</pre>
    </section>
  );
}

function HiringSignals({ lead }: { lead: Lead }) {
  const jobSearchSources = lead.sources.filter((source) => ['Canada Job Bank', 'Indeed', 'LinkedIn Jobs search'].includes(source.label));
  const signals = lead.jobPostSignals ?? [];

  return (
    <section className="card hiring-signals">
      <h3><Target size={18} /> Hiring signals / validation targets</h3>
      <p className="field-help">Use captured job posts only as sourced evidence. Search links below are targets for manual/authorized validation, not proof by themselves.</p>
      <div className="signal-score">
        <strong>{lead.hiringSignalScore ?? 0}/100</strong>
        <span>Captured hiring rubric score</span>
      </div>
      {signals.length === 0 ? (
        <p className="empty-state">No captured automation/AI job posts yet. Use the validation targets below to check current openings before calling.</p>
      ) : null}
      {signals.map((signal) => (
        <article key={signal.id} className="job-signal">
          <a href={signal.sourceUrl} target="_blank" rel="noreferrer"><strong>{signal.title}</strong> <ExternalLink size={14} /></a>
          <small>{signal.source}{signal.postedAt ? ` · ${signal.postedAt}` : ''} · {signal.location}</small>
          <p>{signal.awcAngle}</p>
          <p><b>Tools:</b> {signal.tools.length > 0 ? signal.tools.join(', ') : 'None captured yet'}</p>
          <p><b>Pain language:</b> {signal.painSignals.length > 0 ? signal.painSignals.join('; ') : 'None captured yet'}</p>
        </article>
      ))}
      <div className="sources compact">
        {jobSearchSources.map((source) => (
          <a key={`${source.label}-${source.url}`} href={source.url} target="_blank" rel="noreferrer">
            {source.label} <ExternalLink size={14} />
            {source.note ? <small>{source.note}</small> : null}
          </a>
        ))}
      </div>
    </section>
  );
}

function CallActivity({ lead, logs, onAddLog }: { lead: Lead; logs: CallLog[]; onAddLog: (log: CallLog) => void }) {
  const [outcome, setOutcome] = useState<CallLog['outcome']>('Called');
  const [comment, setComment] = useState('');
  const [reservation, setReservation] = useState('');
  const [feedback, setFeedback] = useState('');
  const [friction, setFriction] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const hasNote = [comment, reservation, feedback, friction].some((value) => value.trim());

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasNote) return;

    onAddLog({
      id: `${lead.id}-${Date.now()}`,
      leadId: lead.id,
      createdAt: new Date().toISOString(),
      outcome,
      comment: comment.trim(),
      reservation: reservation.trim(),
      feedback: feedback.trim(),
      friction: friction.trim(),
      emailSent
    });
    setOutcome('Called');
    setComment('');
    setReservation('');
    setFeedback('');
    setFriction('');
    setEmailSent(false);
  };

  return (
    <section className="card call-activity">
      <h3><MessageSquarePlus size={18} /> Call log / Kadwell content fuel</h3>
      <p className="field-help">Capture objections, reservations, feedback, and funnel friction so inbound can turn it into counter-articles, blog topics, and funnel updates.</p>
      <form onSubmit={handleSubmit} className="call-form">
        <select value={outcome} onChange={(event) => setOutcome(event.target.value as CallLog['outcome'])} aria-label="Call outcome">
          <option>Called</option>
          <option>Left voicemail</option>
          <option>Connected</option>
          <option>Follow-up needed</option>
          <option>Not interested</option>
        </select>
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Conversation notes / next step…" />
        <textarea value={reservation} onChange={(event) => setReservation(event.target.value)} placeholder="Reservations or objections: price, timing, trust, internal capacity…" />
        <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Feedback: what landed, what confused them, exact phrasing they used…" />
        <textarea value={friction} onChange={(event) => setFriction(event.target.value)} placeholder="Friction: website/funnel gaps, missing proof, unclear offer, bad CTA…" />
        <label className="checkbox-row"><input type="checkbox" checked={emailSent} onChange={(event) => setEmailSent(event.target.checked)} /> Emailed resource during/after call</label>
        <button type="submit">Add call intelligence</button>
      </form>
      <div className="call-log-list">
        {logs.length === 0 ? <p className="empty-state">No call intelligence yet.</p> : null}
        {logs.map((log) => (
          <article key={log.id} className="call-log-entry">
            <div>
              <strong>{log.outcome}{log.emailSent ? ' · emailed' : ''}</strong>
              <time>{new Date(log.createdAt).toLocaleString()}</time>
            </div>
            {log.comment ? <p>{log.comment}</p> : null}
            {log.reservation ? <p><b>Reservation:</b> {log.reservation}</p> : null}
            {log.feedback ? <p><b>Feedback:</b> {log.feedback}</p> : null}
            {log.friction ? <p><b>Friction:</b> {log.friction}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function CandidateProfile({ candidate, onRunOsint }: { candidate: CandidateBusiness; onRunOsint: (id: string) => void }) {
  return (
    <main className="lead-detail">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Real candidate seed profile</p>
          <h1>{candidate.companyName}</h1>
          <p className="summary">This is a real public business candidate from OpenStreetMap seed data. Generate a profile to create AWC call prep, but treat all inferred pain, contacts, reviews, and website behavior as unverified until recorded with evidence.</p>
          <div className="meta-row">
            <span><Building2 size={16} /> {candidate.category.replace(/_/g, ' ')}</span>
            <span><MapPin size={16} /> {candidate.location}</span>
            {candidate.phone ? <span><Phone size={16} /> {candidate.phone}</span> : null}
            {candidate.email ? <span><Mail size={16} /> {candidate.email}</span> : null}
          </div>
        </div>
        <button className="osint-button primary" onClick={() => onRunOsint(candidate.id)}>Generate profile from real seed</button>
      </section>

      <section className="grid two">
        <section className="card">
          <h3>Seed data captured</h3>
          <ul>
            <li><strong>Address:</strong> {candidate.address || 'Not captured'}</li>
            <li><strong>Website:</strong> {candidate.website || 'Not captured'}</li>
            <li><strong>Phone:</strong> {candidate.phone || 'Not captured'}</li>
            <li><strong>Email:</strong> {candidate.email || 'Not captured'}</li>
          </ul>
        </section>
        <section className="card">
          <h3>How search works</h3>
          <ul>
            <li>Search filters the real public candidate list by company, location, category, website, phone, and email.</li>
            <li>Every row has a stable profile ID, so notes and generated profiles stay attached to that business.</li>
            <li>Profile generation uses only captured fields and clearly labels what still needs live validation.</li>
          </ul>
        </section>
      </section>

      <section className="card callprep">
        <h3><ShieldCheck size={18} /> Source record</h3>
        <p>This profile starts from a real public business record. Generated call prep is not treated as verified evidence until source checks or call notes support it.</p>
        <a href={candidate.sourceUrl} target="_blank" rel="noreferrer">Open source record <ExternalLink size={14} /></a>
      </section>
    </main>
  );
}

function AccountabilityPanel({ lead }: { lead: Lead }) {
  return (
    <section className="card accountability">
      <h3><ShieldCheck size={18} /> Real-data accountability</h3>
      <div className="accountability-grid">
        <div>
          <span>Data policy</span>
          <strong>{lead.accountability.dataPolicy}</strong>
        </div>
        <div>
          <span>Profile status</span>
          <strong>{lead.accountability.profileStatus}</strong>
        </div>
        <div>
          <span>Score status</span>
          <strong>{lead.accountability.scoreStatus}</strong>
        </div>
        <div>
          <span>Validation status</span>
          <strong>{lead.accountability.validationStatus}</strong>
        </div>
      </div>
      <div className="grid two accountability-lists">
        <ListBlock title="Unknown until verified" items={lead.accountability.unknowns} />
        <ListBlock title="Required validation before confident outreach" items={lead.accountability.requiredValidationSteps} />
      </div>
      <p className="field-help">If evidence is not in the source ledger or call notes, treat it as unverified. Do not reference guessed pain, contacts, reviews, or tools as facts.</p>
    </section>
  );
}

function LeadDetail({ lead, logs, onAddLog, onRefreshOsint }: { lead: Lead; logs: CallLog[]; onAddLog: (log: CallLog) => void; onRefreshOsint: (id: string) => void }) {
  return (
    <main className="lead-detail">
      <section className="hero-card">
        <div>
          <p className="eyebrow">AWC lead intelligence</p>
          <h1>{lead.companyName}</h1>
          <p className="summary">{lead.summary}</p>
          <div className="meta-row">
            <span><Building2 size={16} /> {lead.industry}</span>
            <span><MapPin size={16} /> {lead.location}</span>
            {lead.phone ? <span><Phone size={16} /> {lead.phone}</span> : null}
            {lead.contact.email ? <span><Mail size={16} /> {lead.contact.email}</span> : null}
          </div>
          <div className="niche-tags">
            {lead.niches.map((niche) => <span key={niche}>{niche}</span>)}
          </div>
        </div>
        <div className="hero-actions">
          <div className="score-card">
            <span>Priority rubric</span>
            <strong>{scoreLabel(lead)}</strong>
            <small>Generated triage score, not verified pain: Fit {lead.fitScore} · Pain {lead.painScore} · Reach {lead.reachabilityScore} · Value {lead.valueScore} · Hiring {lead.hiringSignalScore ?? 0}</small>
          </div>
          <button className="osint-button refresh" onClick={() => onRefreshOsint(lead.id)}>
            <RefreshCw size={18} /> Refresh profile
            <small>Regenerate from stored real fields. Does not revalidate live sources.</small>
          </button>
          <small className="refresh-stamp">Last profile refresh: {formatRefreshTime(lead.osintRefreshedAt)}</small>
        </div>
      </section>

      <section className="grid two">
        <section className="card accent">
          <h3><Target size={18} /> First-call angle</h3>
          <p>{lead.firstCallAngle}</p>
        </section>
        <section className="card accent green">
          <h3><UserRound size={18} /> Point of contact</h3>
          <p><strong>{lead.contact.name}</strong> — {lead.contact.title}</p>
          <p>{lead.contact.summary}</p>
        </section>
      </section>

      <section className="grid two">
        <ContactActions lead={lead} />
        <VoicemailScript lead={lead} />
      </section>

      <HiringSignals lead={lead} />

      <AccountabilityPanel lead={lead} />

      <CallActivity lead={lead} logs={logs} onAddLog={onAddLog} />

      <section className="grid three">
        <ListBlock title="Strengths" items={lead.strengths} />
        <ListBlock title="Weaknesses / friction" items={lead.weaknesses} />
        <ListBlock title="Review signals to inspect" items={lead.reviewSignals} />
      </section>

      <section className="grid two">
        <ListBlock title="AWC selling points" items={lead.sellingPoints} />
        <ListBlock title="Discovery questions" items={lead.discoveryQuestions} />
      </section>

      <section className="card audit">
        <h3><Gauge size={18} /> Website validation checklist — current grade {lead.websiteAudit.grade}</h3>
        <p className="field-help">Grade is a provisional rubric output from captured fields. It becomes trustworthy only after the website/contact path is inspected and evidence is recorded.</p>
        <div className="grid four">
          <ListBlock title="Conversion issues" items={lead.websiteAudit.conversionIssues} />
          <ListBlock title="System signals" items={lead.websiteAudit.systemSignals} />
          <ListBlock title="Quick wins" items={lead.websiteAudit.quickWins} />
          <ListBlock title="Technical notes" items={lead.websiteAudit.technicalNotes} />
        </div>
      </section>

      <section className="grid two">
        <ListBlock title="LinkedIn conversation openers" items={lead.contact.conversationOpeners} />
        <ListBlock title="Outreach focus" items={lead.contact.boundaries} />
      </section>

      <section className="card callprep">
        <h3><Sparkles size={18} /> Call prep summary</h3>
        <pre>{summarizeLeadForCall(lead)}</pre>
      </section>

      <SourceLinks lead={lead} />
    </main>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('All categories');
  const [hiringOnly, setHiringOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(candidateBusinesses[0].id);
  const [callLogs, setCallLogs] = useState<CallLog[]>(loadCallLogs);
  const [osintProfileIds, setOsintProfileIds] = useState<string[]>(loadOsintProfileIds);
  const [osintRefreshMap, setOsintRefreshMap] = useState<OsintRefreshMap>(loadOsintRefreshMap);

  useEffect(() => {
    window.localStorage.setItem(CALL_LOG_STORAGE_KEY, JSON.stringify(callLogs));
  }, [callLogs]);

  useEffect(() => {
    window.localStorage.setItem(OSINT_STORAGE_KEY, JSON.stringify(osintProfileIds));
  }, [osintProfileIds]);

  useEffect(() => {
    window.localStorage.setItem(OSINT_REFRESH_STORAGE_KEY, JSON.stringify(osintRefreshMap));
  }, [osintRefreshMap]);

  const osintIdSet = useMemo(() => new Set(osintProfileIds), [osintProfileIds]);
  const leadProfiles = useMemo(() => new Map(candidateBusinesses.filter((candidate) => osintIdSet.has(candidate.id)).map((candidate) => [candidate.id, buildLeadProfileFromCandidate(candidate, { refreshedAt: osintRefreshMap[candidate.id], websiteEnrichment: websiteEnrichmentMap.get(candidate.id) })])), [osintIdSet, osintRefreshMap]);
  const categories = useMemo(() => ['All categories', ...Array.from(new Set(candidateBusinesses.map((candidate) => candidate.category.replace(/_/g, ' ')))).sort()], []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return candidateBusinesses.filter((candidate) => {
      const categoryLabel = candidate.category.replace(/_/g, ' ');
      const matchesCategory = selectedNiche === 'All categories' || categoryLabel === selectedNiche;
      const jobTerms = candidate.jobPostSignals?.flatMap((signal) => [signal.title, signal.source, signal.location, ...signal.keywords, ...signal.tools, ...signal.painSignals, signal.awcAngle]) ?? [];
      const matchesHiringSignal = !hiringOnly || Boolean(candidate.jobPostSignals?.length);
      const haystack = [candidate.companyName, candidate.category, categoryLabel, candidate.location, candidate.address ?? '', candidate.website ?? '', candidate.phone ?? '', candidate.email ?? '', ...jobTerms].join(' ').toLowerCase();
      return matchesCategory && matchesHiringSignal && (!q || haystack.includes(q));
    });
  }, [query, selectedNiche, hiringOnly]);

  const selectedCandidate = filtered.find((candidate) => candidate.id === selectedId) ?? filtered[0] ?? candidateBusinesses[0];
  const selected = leadProfiles.get(selectedCandidate.id);
  const selectedLogs = selected ? callLogs.filter((log) => log.leadId === selected.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : [];

  const runOsint = (id: string) => {
    setOsintProfileIds((current) => current.includes(id) ? current : [...current, id]);
    setSelectedId(id);
  };

  const refreshOsint = (id: string) => {
    setOsintProfileIds((current) => current.includes(id) ? current : [...current, id]);
    setOsintRefreshMap((current) => ({ ...current, [id]: new Date().toISOString() }));
    setSelectedId(id);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Wrench />
          <div>
            <strong>AWC Leads</strong>
            <span>Real candidates + accountable profiles</span>
          </div>
        </div>
        <WeeklyMetrics logs={callLogs} />
        <section className="metric-card">
          <span>Candidate backend</span>
          <strong>{candidateBusinesses.length}</strong>
          <p>{osintProfileIds.length} generated profile{osintProfileIds.length === 1 ? '' : 's'}.</p>
          <small>No synthetic/example leads. Seeded from real public business records; profile claims remain labeled until validated.</small>
        </section>
        <section className="metric-card">
          <span>Website validations</span>
          <strong>{websiteEnrichmentMap.size}</strong>
          <p>{websiteEnrichmentMap.size} website source validation{websiteEnrichmentMap.size === 1 ? '' : 's'} committed.</p>
          <small>Live website fetches are compiled into the app as dated source evidence; failed/unfetched sites remain seed-only.</small>
        </section>
        <label className="filter-label" htmlFor="lead-search">Search by company, category, location, website, phone, email</label>
        <input id="lead-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try roofing, dental, Spruce Grove…" />
        <label className="filter-label" htmlFor="niche-filter">Category</label>
        <select id="niche-filter" className="sidebar-select" value={selectedNiche} onChange={(event) => setSelectedNiche(event.target.value)}>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <label className="checkbox-row sidebar-checkbox"><input type="checkbox" checked={hiringOnly} onChange={(event) => setHiringOnly(event.target.checked)} /> Automation/AI hiring signals only</label>
        <div className="result-count">{filtered.length} candidate{filtered.length === 1 ? '' : 's'} matched</div>
        <div className="lead-list">
          {filtered.map((candidate) => {
            const lead = leadProfiles.get(candidate.id);
            const logCount = callLogs.filter((log) => log.leadId === candidate.id).length;
            return (
              <button key={candidate.id} className={candidate.id === selectedCandidate.id ? 'active' : ''} onClick={() => setSelectedId(candidate.id)}>
                <strong>{candidate.companyName}</strong>
                <span>{candidate.category.replace(/_/g, ' ')} · {candidate.location}</span>
                {lead ? <small>{scoreLabel(lead)} · generated profile · validation: {lead.accountability.validationStatus} · Hiring {lead.hiringSignalScore ?? 0} · {lead.niches.slice(0, 2).join(', ')}</small> : <small>{candidate.jobPostSignals?.length ? 'Hiring signal seed · ' : ''}Seed profile · generate profile from real fields</small>}
                {candidate.email ? <small>{candidate.email}</small> : null}
                {logCount > 0 ? <em>{logCount} call note{logCount === 1 ? '' : 's'}</em> : null}
              </button>
            );
          })}
        </div>
        <section className="ethics">
          <h2><ShieldCheck size={16} /> Guardrails</h2>
          <p>Goal: five real conversations/week. No synthetic/example leads. Each generated profile stays tied to one real business seed record and must label unknowns until source checks or call notes support them. Capture reservations, feedback, and friction for Kadwell's blogs, counter-articles, paid ads, and funnel updates.</p>
        </section>
      </aside>
      {selected ? (
        <LeadDetail lead={selected} logs={selectedLogs} onAddLog={(log) => setCallLogs((current) => [log, ...current])} onRefreshOsint={refreshOsint} />
      ) : (
        <CandidateProfile candidate={selectedCandidate} onRunOsint={runOsint} />
      )}
    </div>
  );
}
