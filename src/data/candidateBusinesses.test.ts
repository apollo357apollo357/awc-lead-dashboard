import { describe, expect, it } from 'vitest';
import { candidateBusinesses } from './candidateBusinesses';

describe('candidate business batch', () => {
  it('gives Ryan a larger real-company batch to choose from', () => {
    expect(candidateBusinesses.length).toBeGreaterThanOrEqual(80);
  });

  it('keeps candidate rows grounded in public OSM records with usable contact/location data', () => {
    const ids = new Set(candidateBusinesses.map((candidate) => candidate.id));

    expect(ids.size).toBe(candidateBusinesses.length);
    expect(candidateBusinesses.every((candidate) => candidate.source === 'OpenStreetMap')).toBe(true);
    expect(candidateBusinesses.every((candidate) => candidate.sourceUrl.includes('openstreetmap.org'))).toBe(true);
    expect(candidateBusinesses.every((candidate) => Boolean(candidate.companyName && candidate.location && candidate.lat && candidate.lon))).toBe(true);
    expect(candidateBusinesses.filter((candidate) => Boolean(candidate.website || candidate.phone || candidate.email)).length).toBeGreaterThanOrEqual(70);
  });
});
