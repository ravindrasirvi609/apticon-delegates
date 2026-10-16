const session = {
  token: 'tok',
  delegate: { id: '1', name: 'Dr. Asha', registrationCode: 'AM1001', institution: 'XYZ' },
};

function loadModule(os: 'ios' | 'web') {
  jest.resetModules();
  const secureStore = {
    getItemAsync: jest.fn().mockResolvedValue(null),
    setItemAsync: jest.fn().mockResolvedValue(undefined),
    deleteItemAsync: jest.fn().mockResolvedValue(undefined),
  };
  jest.doMock('react-native', () => ({ Platform: { OS: os } }));
  jest.doMock('expo-secure-store', () => secureStore);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const storage = require('./session-storage') as typeof import('./session-storage');
  return { storage, secureStore };
}

describe('session-storage', () => {
  const originalLocalStorage = (globalThis as { localStorage?: Storage }).localStorage;

  afterEach(() => {
    (globalThis as { localStorage?: Storage }).localStorage = originalLocalStorage;
  });

  it('uses SecureStore on native', async () => {
    const { storage, secureStore } = loadModule('ios');
    await storage.saveSession(session);
    expect(secureStore.setItemAsync).toHaveBeenCalledWith('apticon_delegate_token', 'tok');
    expect(secureStore.setItemAsync).toHaveBeenCalledTimes(2);
  });

  it('uses localStorage on web instead of the (empty) SecureStore web module', async () => {
    const data = new Map<string, string>();
    (globalThis as { localStorage?: unknown }).localStorage = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
      removeItem: (k: string) => void data.delete(k),
    };
    const { storage, secureStore } = loadModule('web');

    await storage.saveSession(session);
    expect(secureStore.setItemAsync).not.toHaveBeenCalled();
    expect(await storage.loadSession()).toEqual(session);

    await storage.clearSession();
    expect(await storage.loadSession()).toBeNull();
  });

  it('loadSession returns null instead of throwing when storage fails', async () => {
    const { storage, secureStore } = loadModule('ios');
    secureStore.getItemAsync.mockRejectedValue(new Error('keychain locked'));
    await expect(storage.loadSession()).resolves.toBeNull();
  });
});
