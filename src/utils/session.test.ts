import { SCHEDULE_DAY1, SCHEDULE_DAY2 } from '@/data/schedule';
import { findSession, isInteractiveSession } from './session';

const schedule = { day1: SCHEDULE_DAY1, day2: SCHEDULE_DAY2 };

describe('isInteractiveSession', () => {
  it('is false for breaks and logistics', () => {
    expect(isInteractiveSession({ type: 'break' })).toBe(false);
    expect(isInteractiveSession({ type: 'logistics' })).toBe(false);
  });

  it('is true for real sessions', () => {
    expect(isInteractiveSession({ type: 'scientific' })).toBe(true);
    expect(isInteractiveSession({ type: 'keynote' })).toBe(true);
    expect(isInteractiveSession({ type: 'cultural' })).toBe(true);
  });
});

describe('findSession', () => {
  it('finds a session and its day by id', () => {
    expect(findSession(schedule, 'd1-02')?.session.title).toBe('Inaugural Function');
    expect(findSession(schedule, 'd1-02')?.day).toBe(1);
    expect(findSession(schedule, 'd2-08')?.day).toBe(2);
  });

  it('returns null for an unknown id', () => {
    expect(findSession(schedule, 'd9-99')).toBeNull();
  });
});

describe('bundled schedule ids', () => {
  it('are unique', () => {
    const ids = [...SCHEDULE_DAY1, ...SCHEDULE_DAY2].map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
