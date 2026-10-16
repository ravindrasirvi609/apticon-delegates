import { ApiError, apiRequest } from './api';

describe('apiRequest', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function mockFetch(status: number, body: unknown) {
    const fn = jest.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    });
    globalThis.fetch = fn as unknown as typeof fetch;
    return fn;
  }

  it('unwraps data from the success envelope and sends the bearer token', async () => {
    const fn = mockFetch(200, { success: true, message: 'Success', data: { hello: 'world' } });

    await expect(apiRequest('/x', { token: 'abc' })).resolves.toEqual({ hello: 'world' });
    expect(fn.mock.calls[0][1].headers.Authorization).toBe('Bearer abc');
  });

  it('serialises the body for POST', async () => {
    const fn = mockFetch(200, { success: true, message: 'Success', data: null });

    await apiRequest('/x', { method: 'POST', body: { a: 1 } });
    expect(fn.mock.calls[0][1].body).toBe('{"a":1}');
  });

  it('throws ApiError with the server message and status on failure', async () => {
    mockFetch(401, { success: false, message: 'Invalid details', errors: [] });

    await expect(apiRequest('/x')).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      message: 'Invalid details',
    });
  });

  it('throws ApiError with status 0 when the network fails', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    const error = await apiRequest('/x').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(0);
  });

  it('throws a generic ApiError when the body is not JSON', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error('not json');
      },
    }) as unknown as typeof fetch;

    await expect(apiRequest('/x')).rejects.toMatchObject({ status: 502 });
  });
});
