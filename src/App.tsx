import { useMemo, useState } from 'react';
import { Building2, ExternalLink, Gauge, MapPin, Phone, ShieldCheck, Sparkles, Target, UserRound, Wrench } from 'lucide-react';
import { sampleLeads } from './data/sampleLeads';
import type { Lead } from './types';
import { calculatePriorityScore, gradeLead, summarizeLeadForCall } from './lib/leadScoring';
import './styles.css';

const scoreLabel = (lead: Lead) => `${gradeLead(lead)} / ${calculatePriorityScore(lead)}`;

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

function LeadDetail({ lead }: { lead: Lead }) {
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
  const [selectedId, setSelectedId] = useState(sampleLeads[0].id);
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return sampleLeads.filter((lead) => [lead.companyName, lead.industry, lead.location, lead.status].join(' ').toLowerCase().includes(q));
  }, [query]);
  const selected = sampleLeads.find((lead) => lead.id === selectedId) ?? filtered[0] ?? sampleLeads[0];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Wrench />
          <div>
            <strong>AWC Leads</strong>
            <span>Ethical OSINT dashboard</span>
          </div>
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter leads…" />
        <div className="lead-list">
          {filtered.map((lead) => (
            <button key={lead.id} className={lead.id === selected.id ? 'active' : ''} onClick={() => setSelectedId(lead.id)}>
              <strong>{lead.companyName}</strong>
              <span>{lead.industry}</span>
              <small>{scoreLabel(lead)} · {lead.status}</small>
            </button>
          ))}
        </div>
        <section className="ethics">
          <h2><ShieldCheck size={16} /> Guardrails</h2>
          <p>Use public business sources only. No passwords, breaches, personal-life stalking, or private data. Every claim needs a source.</p>
        </section>
      </aside>
      <LeadDetail lead={selected} />
    </div>
  );
}
