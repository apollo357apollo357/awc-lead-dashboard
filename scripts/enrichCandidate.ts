import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { candidateBusinesses } from '../src/data/candidateBusinesses';
import { buildAwcEnrichmentFromWebsite } from '../src/lib/enrichment';
import { normalizeCandidateWebsite } from '../src/lib/osint';

const DEFAULT_OUTPUT_DIR = '.local/osint-enrichment';
const USER_AGENT = 'AWC-Lead-Intelligence/0.1 (+https://getawc.com; public business research)';

type CliOptions = {
  id?: string;
  limit: number;
  outputDir: string;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { limit: 1, outputDir: DEFAULT_OUTPUT_DIR };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--id') options.id = argv[++index];
    else if (arg === '--limit') options.limit = Number(argv[++index]);
    else if (arg === '--out') options.outputDir = argv[++index];
    else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: npm run osint:enrich -- [--id candidate-id] [--limit 3] [--out .local/osint-enrichment]\n\nExamples:\n  npm run osint:enrich -- --id osm-seed-dent-force-paintless-dent-repair\n  npm run osint:enrich -- --limit 5`);
      process.exit(0);
    }
  }

  if (!Number.isFinite(options.limit) || options.limit < 1) options.limit = 1;
  return options;
}

async function fetchWebsiteHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml'
    },
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType && !contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
    throw new Error(`Unsupported content type: ${contentType}`);
  }

  return response.text();
}

function selectCandidates(options: CliOptions) {
  const withWebsites = candidateBusinesses.filter((candidate) => normalizeCandidateWebsite(candidate.website));
  if (options.id) {
    const candidate = candidateBusinesses.find((item) => item.id === options.id);
    if (!candidate) throw new Error(`Candidate not found: ${options.id}`);
    if (!normalizeCandidateWebsite(candidate.website)) throw new Error(`Candidate has no website: ${options.id}`);
    return [candidate];
  }
  return withWebsites.slice(0, options.limit);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const selected = selectCandidates(options);
  await mkdir(options.outputDir, { recursive: true });

  const results = [];
  const enrichments = [];
  for (const candidate of selected) {
    const url = normalizeCandidateWebsite(candidate.website);
    process.stderr.write(`Enriching ${candidate.companyName} <${url}>\n`);

    try {
      const html = await fetchWebsiteHtml(url);
      const enrichment = buildAwcEnrichmentFromWebsite({
        candidateId: candidate.id,
        companyName: candidate.companyName,
        url,
        html
      });
      const outputPath = path.join(options.outputDir, `${candidate.id}.json`);
      await writeFile(outputPath, `${JSON.stringify(enrichment, null, 2)}\n`);
      enrichments.push(enrichment);
      results.push({ id: candidate.id, companyName: candidate.companyName, status: 'ok', outputPath, signals: enrichment.workflowSignals.length });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push({ id: candidate.id, companyName: candidate.companyName, status: 'error', error: message });
    }
  }

  const indexPath = path.join(options.outputDir, 'index.json');
  await writeFile(indexPath, `${JSON.stringify(enrichments, null, 2)}\n`);

  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), indexPath, results }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
