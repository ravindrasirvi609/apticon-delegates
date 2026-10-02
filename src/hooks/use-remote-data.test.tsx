import { act, create } from 'react-test-renderer';
import { useRemoteData } from './use-remote-data';
import { fetchRemoteJson } from '@/services/remote-data';

jest.mock('@/services/remote-data', () => ({
  fetchRemoteJson: jest.fn(),
}));

const mockedFetchRemoteJson = fetchRemoteJson as jest.MockedFunction<typeof fetchRemoteJson>;

type Shape = { a: number };
const isShape = (data: unknown): data is Shape =>
  typeof data === 'object' && data !== null && typeof (data as Shape).a === 'number';

function Harness({ onRender }: { onRender: (value: Shape) => void }) {
  const value = useRemoteData<Shape>('x.json', { a: 1 }, isShape);
  onRender(value);
  return null;
}

describe('useRemoteData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the fallback immediately, then swaps in a valid remote value', async () => {
    let resolveFetch!: (value: unknown) => void;
    mockedFetchRemoteJson.mockReturnValue(new Promise((resolve) => (resolveFetch = resolve)));

    const renders: Shape[] = [];
    let renderer: ReturnType<typeof create>;
    await act(async () => {
      renderer = create(<Harness onRender={(v) => renders.push(v)} />);
    });

    expect(renders[0]).toEqual({ a: 1 });

    await act(async () => {
      resolveFetch({ a: 2 });
    });

    expect(renders[renders.length - 1]).toEqual({ a: 2 });
    act(() => {
      renderer!.unmount();
    });
  });

  it('keeps the fallback when the fetch resolves null', async () => {
    mockedFetchRemoteJson.mockResolvedValue(null);
    const renders: Shape[] = [];
    let renderer: ReturnType<typeof create>;
    await act(async () => {
      renderer = create(<Harness onRender={(v) => renders.push(v)} />);
    });

    expect(renders[renders.length - 1]).toEqual({ a: 1 });
    act(() => {
      renderer!.unmount();
    });
  });

  it('keeps the fallback when the fetch resolves a value that fails validation', async () => {
    mockedFetchRemoteJson.mockResolvedValue({ a: 'not-a-number' });
    const renders: Shape[] = [];
    let renderer: ReturnType<typeof create>;
    await act(async () => {
      renderer = create(<Harness onRender={(v) => renders.push(v)} />);
    });

    expect(renders[renders.length - 1]).toEqual({ a: 1 });
    act(() => {
      renderer!.unmount();
    });
  });

  it('does not warn or crash when unmounted before the fetch resolves', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    let resolveFetch!: (value: unknown) => void;
    mockedFetchRemoteJson.mockReturnValue(new Promise((resolve) => (resolveFetch = resolve)));

    let renderer: ReturnType<typeof create>;
    await act(async () => {
      renderer = create(<Harness onRender={() => {}} />);
    });
    act(() => {
      renderer!.unmount();
    });

    await act(async () => {
      resolveFetch({ a: 2 });
    });

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
