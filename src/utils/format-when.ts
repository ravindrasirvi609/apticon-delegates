/**
 * Formats an ISO instant as e.g. "Sat, 24 Oct, 3:00 pm" in Indian Standard Time (the conference
 * runs in Raipur, whatever timezone the phone is set to). Returns null if the date is invalid or
 * the runtime lacks Intl timezone support, so callers just leave the time out.
 */
export function formatWhenIST(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  try {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return null;
  }
}
