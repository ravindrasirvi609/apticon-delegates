const CODE_PATTERN = /^[A-Z0-9-]{3,40}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The badge QR encodes the plain registrationCode (e.g. "AM1001"). Returns the
 * trimmed, upper-cased code, or null if the text can't be a registration code
 * (so a random QR — a URL, a Wi-Fi code — is rejected before it reaches the API).
 */
export function normalizeRegistrationCode(raw: string): string | null {
  const code = raw.trim().toUpperCase();
  return CODE_PATTERN.test(code) ? code : null;
}

export function normalizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  return email.length <= 200 && EMAIL_PATTERN.test(email) ? email : null;
}
