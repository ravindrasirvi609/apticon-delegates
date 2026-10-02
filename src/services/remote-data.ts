const REMOTE_BASE_URL =
  'https://raw.githubusercontent.com/ravindrasirvi609/apticon-delegates/main/remote-data';

const DEFAULT_TIMEOUT_MS = 6000;

/**
 * Fetches and JSON-parses a file from remote-data/ in this repo.
 * Returns null on ANY failure: network error, timeout, non-2xx response, or
 * a parse error. Never throws — callers always get either the parsed value
 * or null, so they can fall back to bundled defaults.
 */
export async function fetchRemoteJson<T = unknown>(
  fileName: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${REMOTE_BASE_URL}/${fileName}`, {
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
