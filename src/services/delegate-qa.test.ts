import { askQuestion, fetchMyFeedback, fetchMyQuestions, saveFeedback } from './delegate-qa';

describe('delegate-qa service', () => {
  const originalFetch = globalThis.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, message: 'Success', data: {} }),
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  const call = () => ({ url: fetchMock.mock.calls[0][0] as string, init: fetchMock.mock.calls[0][1] });

  it('lists my questions for a session with the bearer token', async () => {
    await fetchMyQuestions('tok', 'd1-06');
    expect(call().url).toMatch(/\/delegate\/sessions\/d1-06\/questions$/);
    expect(call().init.method).toBe('GET');
    expect(call().init.headers.Authorization).toBe('Bearer tok');
  });

  it('posts a question with its anonymity flag', async () => {
    await askQuestion('tok', 'd1-06', 'Why?', true);
    expect(call().url).toMatch(/\/delegate\/sessions\/d1-06\/questions$/);
    expect(call().init.method).toBe('POST');
    expect(JSON.parse(call().init.body)).toEqual({ text: 'Why?', isAnonymous: true });
  });

  it('reads and PUTs feedback', async () => {
    await fetchMyFeedback('tok', 'd2-03');
    expect(call().url).toMatch(/\/delegate\/sessions\/d2-03\/feedback$/);

    fetchMock.mockClear();
    await saveFeedback('tok', 'd2-03', 4, 'Great');
    expect(call().init.method).toBe('PUT');
    expect(JSON.parse(call().init.body)).toEqual({ rating: 4, comment: 'Great' });
  });

  it('url-encodes the session id', async () => {
    await fetchMyQuestions('tok', 'a/b');
    expect(call().url).toContain('/sessions/a%2Fb/');
  });
});
