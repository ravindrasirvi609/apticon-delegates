import { formatWhenIST } from './format-when';

describe('formatWhenIST', () => {
  it('shows the time in IST regardless of the device timezone', () => {
    // 09:30 UTC is 15:00 IST
    const text = formatWhenIST('2026-10-24T09:30:00.000Z');
    expect(text).toMatch(/24/);
    expect(text).toMatch(/Oct/);
    expect(text).toMatch(/3:00/);
    expect(text?.toLowerCase()).toMatch(/pm/);
  });

  it('returns null for an invalid date', () => {
    expect(formatWhenIST('not a date')).toBeNull();
  });
});
