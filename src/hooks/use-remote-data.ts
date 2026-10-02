import { useEffect, useState } from 'react';
import { fetchRemoteJson } from '@/services/remote-data';

/**
 * Renders `fallback` immediately (no loading spinner, no layout jank).
 * Fetches `fileName` from remote-data/ in the background; swaps it in only
 * if the fetch succeeds AND `validate` accepts its shape. On any failure —
 * network error, timeout, malformed JSON, or a shape mismatch — keeps
 * `fallback` for the rest of this session.
 */
export function useRemoteData<T>(
  fileName: string,
  fallback: T,
  validate?: (data: unknown) => data is T
): T {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    let cancelled = false;
    fetchRemoteJson<unknown>(fileName).then((remote) => {
      if (cancelled || remote == null) return;
      if (validate && !validate(remote)) return;
      setData(remote as T);
    });
    return () => {
      cancelled = true;
    };
    // fileName/fallback/validate are stable per call site in this codebase.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileName]);

  return data;
}
