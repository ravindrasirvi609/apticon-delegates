import type { ScheduleSession, SessionType } from '@/data/schedule';
import type { ScheduleData } from '@/types/remote-content';

const NON_INTERACTIVE_TYPES = new Set<SessionType>(['break', 'logistics']);

/** Questions and feedback only make sense for real sessions, not tea breaks or registration. */
export function isInteractiveSession(session: Pick<ScheduleSession, 'type'>): boolean {
  return !NON_INTERACTIVE_TYPES.has(session.type);
}

export interface FoundSession {
  session: ScheduleSession;
  day: 1 | 2;
}

export function findSession(schedule: ScheduleData, id: string): FoundSession | null {
  const day1 = schedule.day1.find((s) => s.id === id);
  if (day1) return { session: day1, day: 1 };
  const day2 = schedule.day2.find((s) => s.id === id);
  if (day2) return { session: day2, day: 2 };
  return null;
}
