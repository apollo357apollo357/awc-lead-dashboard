import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Building2, ExternalLink, Gauge, MapPin, MessageSquarePlus, Phone, ShieldCheck, Sparkles, Target, UserRound, Wrench } from 'lucide-react';
import { sampleLeads } from './data/sampleLeads';
import type { CallLog, Lead } from './types';
import { calculatePriorityScore, gradeLead, summarizeLeadForCall } from './lib/leadScoring';
import './styles.css';

const CALL_LOG_STORAGE_KEY = 'awc-lead-call-logs-v1';
const scoreLabel = (lead: Lead) => `${gradeLead(lead)} / ${calculatePriorityScore(lead)}`;

const loadCallLogs = (): CallLog[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(CALL_LOG_STORAGE_KEY);
    return raw ? JSON.parse(raw) as CallLog[] : [];
  } catch {
    return [];
  }
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
        {sources.map((source) => (
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!comment.trim()) return;

    onAddLog({
      id: `${lead.id}-${Date.now()}`,
      leadId: lead.id,
      createdAt: new Date().toISOString(),
      outcome,
      comment: comment.trim()
    });
    setOutcome('Called');
    setComment('');
  };

  return (
    <section className="card call-activity">
      <h3><MessageSquarePlus size={18} /> Call log / comments</h3>
      <form onSubmit={handleSubmit} className="call-form">
        <select value={outcome} onChange={(event) => setOutcome(event.target.value as CallLog['outcome'])} aria-label="Call outcome">
          <option>Called</option>
          <option>Left voicemail</option>
          <option>Connected</option>
          <option>Follow-up needed</option>
          <option>Not interested</option>
        </select>
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Log what happened, next step, objections, owner notes…" />
        <button type="submit">Add call note</button>
      </form>
      <div className="call-log-list">
        {logs.length === 0 ? <p className="empty-state">No call notes yet.</p> : null}
        {logs.map((log) => (
          <article key={log.id} className="call-log-entry">
            <div>
              <strong>{log.outcome}</strong>
              <time>{new Date(log.createdAt).toLocaleString()}</time>
            </div>
            <p>{log.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function LeadDetail({ lead, logs, onAddLog }: { lead: Lead; logs: CallLog[]; onAddLog: (log: CallLog) => void }) {
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
          </div>
          <div className="niche-tags">
            {lead.niches.map((niche) => <span key={niche}>{niche}</span>)}
          </div>
        </div>
        <div className="score-card">
          <span>Priority</span>
          <strong>{scoreLabel(lead)}</strong>
          <small>Fit {lead.fitScore} · Pain {lead.painScore} · Reach {lead.reachabilityScore} · Value {lead.valueScore}</small>
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
        <h3><Gauge size={18} /> Quick website audit — grade {lead.websiteAudit.grade}</h3>
        <div className="grid four">
          <ListBlock title="Conversion issues" items={lead.websiteAudit.conversionIssues} />
          <ListBlock title="System signals" items={lead.websiteAudit.systemSignals} />
          <ListBlock title="Quick wins" items={lead.websiteAudit.quickWins} />
          <ListBlock title="Technical notes" items={lead.websiteAudit.technicalNotes} />
        </div>
      </section>

      <section className="grid two">
        <ListBlock title="LinkedIn conversation openers" items={lead.contact.conversationOpeners} />
        <ListBlock title="OSINT boundaries" items={lead.contact.boundaries} />
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
  const [selectedNiche, setSelectedNiche] = useState('All niches');
  const [selectedId, setSelectedId] = useState(sampleLeads[0].id);
  const [callLogs, setCallLogs] = useState<CallLog[]>(loadCallLogs);

  useEffect(() => {
    window.localStorage.setItem(CALL_LOG_STORAGE_KEY, JSON.stringify(callLogs));
  }, [callLogs]);

  const niches = useMemo(() => ['All niches', ...Array.from(new Set(sampleLeads.flatMap((lead) => lead.niches))).sort()], []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return sampleLeads.filter((lead) => {
      const matchesNiche = selectedNiche === 'All niches' || lead.niches.includes(selectedNiche);
      const haystack = [lead.companyName, lead.industry, lead.location, lead.status, ...lead.niches].join(' ').toLowerCase();
      return matchesNiche && (!q || haystack.includes(q));
    });
  }, [query, selectedNiche]);

  const selected = filtered.find((lead) => lead.id === selectedId) ?? filtered[0] ?? sampleLeads[0];
  const selectedLogs = callLogs.filter((log) => log.leadId === selected.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Wrench />
          <div>
            <strong>AWC Leads</strong>
            <span>Private ethical OSINT dashboard</span>
          </div>
        </div>
        <label className="filter-label" htmlFor="lead-search">Search by company, niche, location, status</label>
        <input id="lead-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try HVAC, dental, field service…" />
        <label className="filter-label" htmlFor="niche-filter">Niche</label>
        <select id="niche-filter" className="sidebar-select" value={selectedNiche} onChange={(event) => setSelectedNiche(event.target.value)}>
          {niches.map((niche) => <option key={niche}>{niche}</option>)}
        </select>
        <div className="result-count">{filtered.length} lead{filtered.length === 1 ? '' : 's'} matched</div>
        <div className="lead-list">
          {filtered.map((lead) => {
            const logCount = callLogs.filter((log) => log.leadId === lead.id).length;
            return (
              <button key={lead.id} className={lead.id === selected.id ? 'active' : ''} onClick={() => setSelectedId(lead.id)}>
                <strong>{lead.companyName}</strong>
                <span>{lead.industry}</span>
                <small>{scoreLabel(lead)} · {lead.status} · {lead.niches.slice(0, 2).join(', ')}</small>
                {logCount > 0 ? <em>{logCount} call note{logCount === 1 ? '' : 's'}</em> : null}
              </button>
            );
          })}
        </div>
        <section className="ethics">
          <h2><ShieldCheck size={16} /> Guardrails</h2>
          <p>Private workspace. Use public business sources only. No passwords, breaches, personal-life stalking, or private data. Every claim needs a source.</p>
        </section>
      </aside>
      <LeadDetail lead={selected} logs={selectedLogs} onAddLog={(log) => setCallLogs((current) => [log, ...current])} />
    </div>
  );
}
