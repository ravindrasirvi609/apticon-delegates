import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ApiError } from '@/services/api';
import { fetchDelegateMe, type Delegate, type DelegateLoginResult } from '@/services/delegate-auth';
import { clearSession, loadSession, saveSession, type StoredSession } from '@/services/session-storage';

interface SessionContextValue {
  session: StoredSession | null;
  /** True until the stored session (if any) has been read from the keychain. */
  isLoading: boolean;
  signIn: (result: DelegateLoginResult) => Promise<void>;
  signOut: () => Promise<void>;
  /**
   * Call with any error from an authenticated request. Returns true (and logs the delegate out)
   * if the server rejected the token or the registration (401/403) — the caller should then just
   * stop; any other error is left for the caller to show.
   */
  handleApiError: (err: unknown) => boolean;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(async () => {
    setSession(null);
    await clearSession();
  }, []);

  const signIn = useCallback(async ({ token, delegate }: DelegateLoginResult) => {
    const next = { token, delegate };
    // Log in first, persist second: the server already accepted the login, so a keychain/storage
    // failure must not turn it into a failed login. Worst case the delegate has to sign in again
    // after restarting the app.
    setSession(next);
    try {
      await saveSession(next);
    } catch (err) {
      console.warn('[session] could not persist login', err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = await loadSession();
      if (cancelled) return;
      // Trust the stored session immediately so the app opens offline at the venue.
      setSession(stored);
      setIsLoading(false);
      if (!stored) return;

      // Then confirm it in the background. Only an explicit rejection (token expired, or the
      // registration is no longer approved) logs out — a network failure keeps the session.
      try {
        const delegate: Delegate = await fetchDelegateMe(stored.token);
        if (cancelled) return;
        const refreshed = { token: stored.token, delegate };
        setSession(refreshed);
        await saveSession(refreshed).catch(() => undefined);
      } catch (err) {
        if (!cancelled && err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          await signOut();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [signOut]);

  const handleApiError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        void signOut();
        return true;
      }
      return false;
    },
    [signOut]
  );

  const value = useMemo(
    () => ({ session, isLoading, signIn, signOut, handleApiError }),
    [session, isLoading, signIn, signOut, handleApiError]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside <SessionProvider>');
  return value;
}
