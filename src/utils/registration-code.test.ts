import { normalizeEmail, normalizeRegistrationCode } from './registration-code';

describe('normalizeRegistrationCode', () => {
  it('trims and upper-cases a valid code', () => {
    expect(normalizeRegistrationCode('  am1001 \n')).toBe('AM1001');
  });

  it('accepts legacy hyphenated codes', () => {
    expect(normalizeRegistrationCode('APT-REG-2026-AB12CD')).toBe('APT-REG-2026-AB12CD');
  });

  it('rejects QR payloads that are not registration codes', () => {
    expect(normalizeRegistrationCode('https://example.com/x')).toBeNull();
    expect(normalizeRegistrationCode('WIFI:S:home;;')).toBeNull();
    expect(normalizeRegistrationCode('')).toBeNull();
    expect(normalizeRegistrationCode('AB')).toBeNull();
  });
});

describe('normalizeEmail', () => {
  it('trims and lower-cases a valid email', () => {
    expect(normalizeEmail('  Asha@Example.COM ')).toBe('asha@example.com');
  });

  it('rejects malformed emails', () => {
    expect(normalizeEmail('asha')).toBeNull();
    expect(normalizeEmail('asha@example')).toBeNull();
    expect(normalizeEmail('a b@example.com')).toBeNull();
  });
});
