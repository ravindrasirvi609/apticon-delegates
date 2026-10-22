export const API_BASE_URL = 'https://apticon.in/api/mobile';

const DEFAULT_TIMEOUT_MS = 10000;

export class ApiError extends Error {
  /** HTTP status, or 0 when the request never got a response (offline / timeout). */
  status: number;
  errors: string[];

  constructor(message: string, status: number, errors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT';
  body?: unknown;
  token?: string | null;
  timeoutMs?: number;
}

/**
 * Calls the APTICON mobile API and unwraps its `{ success, message, data }`
 * envelope. Throws ApiError for HTTP errors, `success: false`, and network
 * failures — callers decide what to do with a 401 (usually sign out).
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  } finally {
    clearTimeout(timeoutId);
  }

  const json = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
    data?: T;
    errors?: string[];
  } | null;

  if (!response.ok || !json || json.success !== true) {
    throw new ApiError(
      json?.message ?? 'Something went wrong. Please try again.',
      response.status,
      json?.errors ?? []
    );
  }
  return json.data as T;
}
