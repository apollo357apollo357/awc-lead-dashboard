import { describe, expect, it } from 'vitest';
import type { CallLog } from '../types';
import { removeDuplicateTestingCallLog } from './callLogs';

const matchingLog: CallLog = {
  id: 'test-log',
  leadId: 'osm-seed-garage-door-repair-edmonton',
  createdAt: '2026-05-23T18:21:24.000Z',
  outcome: 'Connected',
  comment: 'Duplicate call intelligence. Testing status'
};

describe('removeDuplicateTestingCallLog', () => {
  it('removes the accidental duplicate connected testing note only', () => {
    const kept: CallLog = {
      id: 'real-log',
      leadId: 'osm-seed-garage-door-repair-edmonton',
      createdAt: '2026-05-23T19:00:00.000Z',
      outcome: 'Connected',
      comment: 'Real conversation note'
    };

    expect(removeDuplicateTestingCallLog([matchingLog, kept])).toEqual([kept]);
  });

  it('keeps similar real notes that are not the exact testing comment', () => {
    const similar: CallLog = {
      ...matchingLog,
      id: 'similar-log',
      comment: 'Duplicate call intelligence discussed with owner'
    };

    expect(removeDuplicateTestingCallLog([similar])).toEqual([similar]);
  });
});
