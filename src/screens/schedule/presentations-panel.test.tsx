import { TextInput } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { PRESENTATIONS } from '@/data/presentations';
import { fetchRemoteJson } from '@/services/remote-data';
import { ALL, filterOral } from '@/utils/presentation-filter';
import { PresentationsPanel } from './presentations-panel';

jest.mock('@/services/remote-data');

async function render(element: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  await act(async () => {
    tree = create(element);
  });
  return tree;
}

function allText(tree: ReturnType<typeof create>): string {
  const walk = (n: unknown): string[] => {
    const node = n as { children?: unknown[] } | string | null;
    if (node == null) return [];
    if (typeof node === 'string') return [node];
    return (node.children ?? []).flatMap(walk);
  };
  return walk(tree.toJSON()).join(' ').replace(/\s+/g, ' ');
}

const chip = (tree: ReturnType<typeof create>, label: string): ReactTestInstance =>
  tree.root.findAll((n) => n.props.accessibilityLabel === label && typeof n.props.onPress === 'function')[0];

async function press(tree: ReturnType<typeof create>, label: string) {
  await act(async () => {
    chip(tree, label).props.onPress();
  });
}

async function type(tree: ReturnType<typeof create>, text: string) {
  await act(async () => {
    tree.root.findByType(TextInput).props.onChangeText(text);
  });
}

const oralTotal = PRESENTATIONS.oral.length;
const posterTotal = PRESENTATIONS.poster.length;

describe('PresentationsPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // No network: the bundled copy of the schedule is what shows.
    (fetchRemoteJson as jest.Mock).mockResolvedValue(null);
  });

  it('shows the oral schedule from the bundled data, with its first cards', async () => {
    const tree = await render(<PresentationsPanel kind="oral" />);
    const text = allText(tree);

    expect(text).toContain(`Showing ${oralTotal} of ${oralTotal} oral presentations`);
    expect(text).toContain(PRESENTATIONS.oral[0].code);
    expect(text).toContain(PRESENTATIONS.oral[0].author);
    expect(text).toContain(PRESENTATIONS.oral[0].hall);
    expect(text).toContain(PRESENTATIONS.oral[0].time);
  });

  it('shows the poster schedule from the bundled data', async () => {
    const tree = await render(<PresentationsPanel kind="poster" />);
    const text = allText(tree);

    expect(text).toContain(`Showing ${posterTotal} of ${posterTotal} poster presentations`);
    expect(text).toContain(PRESENTATIONS.poster[0].code);
  });

  it('narrows the list as the delegate types in the search box', async () => {
    const tree = await render(<PresentationsPanel kind="oral" />);
    const expected = filterOral(PRESENTATIONS.oral, { query: 'rungta', slot: ALL, hall: ALL, subject: ALL }).length;
    expect(expected).toBeGreaterThan(0);

    await type(tree, 'rungta');
    expect(allText(tree)).toContain(`Showing ${expected} of ${oralTotal} oral presentations`);
  });

  it('filters oral by slot', async () => {
    const tree = await render(<PresentationsPanel kind="oral" />);
    const slot3 = PRESENTATIONS.oral.filter((p) => p.slot === 'Slot 3').length;

    await press(tree, 'Slot: Slot 3 · 25 Oct');
    expect(allText(tree)).toContain(`Showing ${slot3} of ${oralTotal} oral presentations`);
  });

  it('filters poster by day', async () => {
    const tree = await render(<PresentationsPanel kind="poster" />);
    const day2 = PRESENTATIONS.poster.filter((p) => p.day === 'Day 2').length;

    await press(tree, 'Day: Day 2 · 25 Oct');
    expect(allText(tree)).toContain(`Showing ${day2} of ${posterTotal} poster presentations`);
  });

  it('shows an empty state when nothing matches', async () => {
    const tree = await render(<PresentationsPanel kind="poster" />);

    await type(tree, 'zzzz-no-such-presenter');
    const text = allText(tree);
    expect(text).toContain('Showing 0 of');
    expect(text).toContain('No matches found');
  });

  it('swaps in a valid remote schedule', async () => {
    const remote = {
      oral: [{ ...PRESENTATIONS.oral[0], code: 'O-NEW-1', author: 'Remote Presenter' }],
      poster: [PRESENTATIONS.poster[0]],
    };
    (fetchRemoteJson as jest.Mock).mockResolvedValue(remote);
    const tree = await render(<PresentationsPanel kind="oral" />);

    expect(fetchRemoteJson).toHaveBeenCalledWith('presentations.json');
    expect(allText(tree)).toContain('Showing 1 of 1 oral presentations');
    expect(allText(tree)).toContain('Remote Presenter');
  });

  it('keeps the bundled schedule when the remote file is malformed', async () => {
    (fetchRemoteJson as jest.Mock).mockResolvedValue({ oral: [{ code: 'O-X' }], poster: [] });
    const tree = await render(<PresentationsPanel kind="oral" />);

    expect(allText(tree)).toContain(`Showing ${oralTotal} of ${oralTotal} oral presentations`);
  });

  it('does not re-download when switching between oral and poster', async () => {
    const tree = await render(<PresentationsPanel kind="oral" />);
    await act(async () => {
      tree.update(<PresentationsPanel kind="poster" />);
    });

    expect(allText(tree)).toContain('poster presentations');
    expect(fetchRemoteJson).toHaveBeenCalledTimes(1);
  });
});
