import type { CallLog } from '../types';

const DUPLICATE_TESTING_COMMENT = 'Duplicate call intelligence. Testing status';

export function removeDuplicateTestingCallLog(logs: CallLog[]): CallLog[] {
  return logs.filter((log) => !(log.outcome === 'Connected' && log.comment.trim() === DUPLICATE_TESTING_COMMENT));
}
