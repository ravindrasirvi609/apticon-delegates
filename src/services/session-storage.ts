import * as SecureStore from 'expo-secure-store';
import type { Delegate } from './delegate-auth';

const TOKEN_KEY = 'apticon_delegate_token';
const DELEGATE_KEY = 'apticon_delegate_profile';

export interface StoredSession {
  token: string;
  delegate: Delegate;
}

/** Never throws: a keychain failure just means the delegate is treated as logged out. */
export async function loadSession(): Promise<StoredSession | null> {
  try {
    const [token, rawDelegate] = await Promise.all([
      SecureStore.getItemAsync(TOKEN_KEY),
      SecureStore.getItemAsync(DELEGATE_KEY),
    ]);
    if (!token || !rawDelegate) return null;
    const delegate = JSON.parse(rawDelegate) as Delegate;
    if (typeof delegate?.id !== 'string' || typeof delegate?.name !== 'string') return null;
    return { token, delegate };
  } catch {
    return null;
  }
}

export async function saveSession(session: StoredSession): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, session.token),
    SecureStore.setItemAsync(DELEGATE_KEY, JSON.stringify(session.delegate)),
  ]);
}

export async function clearSession(): Promise<void> {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(DELEGATE_KEY),
    ]);
  } catch {
    // Nothing useful to do; the in-memory session is already cleared.
  }
}
