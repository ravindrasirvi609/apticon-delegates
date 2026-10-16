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
    await saveSession(next);
    setSession(next);
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
        await saveSession(refreshed);
        setSession(refreshed);
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

  const value = useMemo(
    () => ({ session, isLoading, signIn, signOut }),
    [session, isLoading, signIn, signOut]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside <SessionProvider>');
  return value;
}
