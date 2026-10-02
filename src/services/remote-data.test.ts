import { fetchRemoteJson } from './remote-data';

describe('fetchRemoteJson', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.useRealTimers();
  });

  it('returns the parsed JSON on a successful response', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ foo: 'bar' }),
    }) as unknown as typeof fetch;

    await expect(fetchRemoteJson('schedule.json')).resolves.toEqual({ foo: 'bar' });
  });

  it('returns null on a non-2xx response', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    await expect(fetchRemoteJson('missing.json')).resolves.toBeNull();
  });

  it('returns null on a network error', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(fetchRemoteJson('schedule.json')).resolves.toBeNull();
  });

  it('returns null on malformed JSON', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => {
        throw new SyntaxError('bad json');
      },
    }) as unknown as typeof fetch;

    await expect(fetchRemoteJson('schedule.json')).resolves.toBeNull();
  });

  it('returns null when the request times out', async () => {
    jest.useFakeTimers();
    globalThis.fetch = jest.fn().mockImplementation(
      (_url: string, init?: { signal?: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        })
    ) as unknown as typeof fetch;

    const promise = fetchRemoteJson('schedule.json', 1000);
    jest.advanceTimersByTime(1000);

    await expect(promise).resolves.toBeNull();
  });
});
