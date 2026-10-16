import { act, create } from 'react-test-renderer';
import { SessionProvider, useSession } from './use-session';
import { loadSession, saveSession, clearSession } from '@/services/session-storage';

jest.mock('@/services/session-storage', () => ({
  loadSession: jest.fn(),
  saveSession: jest.fn(),
  clearSession: jest.fn(),
}));
jest.mock('@/services/delegate-auth', () => ({ fetchDelegateMe: jest.fn() }));

const loginResult = {
  token: 'tok',
  delegate: { id: '1', name: 'Dr. Asha', registrationCode: 'AM1001', institution: 'XYZ' },
};

async function mountProvider() {
  let ctx!: ReturnType<typeof useSession>;
  function Probe() {
    ctx = useSession();
    return null;
  }
  await act(async () => {
    create(
      <SessionProvider>
        <Probe />
      </SessionProvider>
    );
  });
  return () => ctx;
}

describe('SessionProvider.signIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (loadSession as jest.Mock).mockResolvedValue(null);
    (saveSession as jest.Mock).mockResolvedValue(undefined);
    (clearSession as jest.Mock).mockResolvedValue(undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('sets the session and persists it', async () => {
    const getCtx = await mountProvider();
    expect(getCtx().session).toBeNull();

    await act(async () => {
      await getCtx().signIn(loginResult);
    });

    expect(getCtx().session).toEqual(loginResult);
    expect(saveSession).toHaveBeenCalledWith(loginResult);
  });

  it('still logs the delegate in when persisting the session fails', async () => {
    (saveSession as jest.Mock).mockRejectedValue(new Error('secure store unavailable'));
    const getCtx = await mountProvider();

    await act(async () => {
      await getCtx().signIn(loginResult);
    });

    expect(getCtx().session).toEqual(loginResult);
  });
});
