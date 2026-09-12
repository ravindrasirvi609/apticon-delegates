import { getCountdownParts } from './countdown';

describe('getCountdownParts', () => {
  it('splits a future difference into days/hours/minutes/seconds', () => {
    const now = new Date('2026-10-22T00:00:00+05:30');
    const target = new Date('2026-10-24T09:00:00+05:30');
    const result = getCountdownParts(target, now);
    expect(result).toEqual({ days: 2, hours: 9, minutes: 0, seconds: 0, isPast: false });
  });

  it('flags a past target as isPast with zeroed parts', () => {
    const now = new Date('2026-11-01T00:00:00+05:30');
    const target = new Date('2026-10-24T09:00:00+05:30');
    const result = getCountdownParts(target, now);
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
  });
});
