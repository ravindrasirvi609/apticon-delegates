import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { Delegate } from './delegate-auth';

const TOKEN_KEY = 'apticon_delegate_token';
const DELEGATE_KEY = 'apticon_delegate_profile';

export interface StoredSession {
  token: string;
  delegate: Delegate;
}

// expo-secure-store has no web implementation (its web module is an empty object, so every call
// throws). On native the Keychain/Keystore is used; on web (dev/preview only) fall back to
// localStorage.
const isWeb = Platform.OS === 'web';

async function getItem(key: string): Promise<string | null> {
  if (isWeb) return globalThis.localStorage?.getItem(key) ?? null;
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    globalThis.localStorage?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function deleteItem(key: string): Promise<void> {
  if (isWeb) {
    globalThis.localStorage?.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

/** Never throws: a storage failure just means the delegate is treated as logged out. */
export async function loadSession(): Promise<StoredSession | null> {
  try {
    const [token, rawDelegate] = await Promise.all([getItem(TOKEN_KEY), getItem(DELEGATE_KEY)]);
    if (!token || !rawDelegate) return null;
    const delegate = JSON.parse(rawDelegate) as Delegate;
    if (typeof delegate?.id !== 'string' || typeof delegate?.name !== 'string') return null;
    return { token, delegate };
  } catch {
    return null;
  }
}

/** Throws if storage is unavailable; callers decide whether that matters (login must not fail on it). */
export async function saveSession(session: StoredSession): Promise<void> {
  await Promise.all([
    setItem(TOKEN_KEY, session.token),
    setItem(DELEGATE_KEY, JSON.stringify(session.delegate)),
  ]);
}

export async function clearSession(): Promise<void> {
  try {
    await Promise.all([deleteItem(TOKEN_KEY), deleteItem(DELEGATE_KEY)]);
  } catch {
    // Nothing useful to do; the in-memory session is already cleared.
  }
}
