import { TextInput } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { QuestionsPanel } from './questions-panel';
import { FeedbackPanel } from './feedback-panel';
import { askQuestion, fetchMyFeedback, fetchMyQuestions, saveFeedback } from '@/services/delegate-qa';

// Stable references, like the real provider's memoised value (a new function each render would re-run load() forever).
jest.mock('@/hooks/use-session', () => {
  const value = { session: { token: 'tok', delegate: { id: '1' } }, handleApiError: () => false };
  return { useSession: () => value };
});
jest.mock('@/services/delegate-qa');

const openWindow = { open: true, opensAt: '2026-10-24T09:30:00.000Z', closesAt: '2026-10-25T18:29:59.000Z' };
const closedWindow = { open: false, reason: 'not_started' as const, opensAt: openWindow.opensAt, closesAt: openWindow.closesAt };

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

const byLabel = (tree: ReturnType<typeof create>, label: string): ReactTestInstance =>
  tree.root.find((n) => n.props.accessibilityLabel === label && typeof n.props.onPress === 'function');

describe('QuestionsPanel', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows a clear notice and no input while the window is closed', async () => {
    (fetchMyQuestions as jest.Mock).mockResolvedValue({ questions: [], window: closedWindow, maxQuestions: 5 });
    const tree = await render(<QuestionsPanel sessionId="d1-06" />);

    expect(tree.root.findAllByType(TextInput)).toHaveLength(0);
    expect(allText(tree)).toContain('Questions are not open yet');
  });

  it('lets the delegate type and send a question when the window is open', async () => {
    (fetchMyQuestions as jest.Mock).mockResolvedValue({ questions: [], window: openWindow, maxQuestions: 5 });
    (askQuestion as jest.Mock).mockResolvedValue({
      question: { id: 'q1', text: 'What next?', isAnonymous: false, status: 'pending', createdAt: '2026-10-24T10:00:00Z' },
      window: openWindow,
    });
    const tree = await render(<QuestionsPanel sessionId="d1-06" />);

    const input = tree.root.findByType(TextInput);
    expect(input.props.editable).toBe(true);
    await act(async () => input.props.onChangeText('What next?'));
    expect(tree.root.findByType(TextInput).props.value).toBe('What next?');

    await act(async () => byLabel(tree, 'Send question').props.onPress());
    expect(askQuestion).toHaveBeenCalledWith('tok', 'd1-06', 'What next?', false);
    expect(allText(tree)).toContain('Your question has been submitted');
  });
});

describe('FeedbackPanel', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows a notice instead of stars while the window is closed', async () => {
    (fetchMyFeedback as jest.Mock).mockResolvedValue({ feedback: null, window: closedWindow });
    const tree = await render(<FeedbackPanel sessionId="d1-06" />);

    expect(tree.root.findAllByType(TextInput)).toHaveLength(0);
    expect(allText(tree)).toContain('Feedback are not open yet');
    expect(tree.root.findAll((n) => n.props.accessibilityLabel === '4 stars')).toHaveLength(0);
  });

  it('lets the delegate tap a star and submit when the window is open', async () => {
    (fetchMyFeedback as jest.Mock).mockResolvedValue({ feedback: null, window: openWindow });
    (saveFeedback as jest.Mock).mockResolvedValue({
      feedback: { rating: 4, comment: '', updatedAt: '2026-10-24T10:00:00Z' },
      window: openWindow,
    });
    const tree = await render(<FeedbackPanel sessionId="d1-06" />);

    await act(async () => byLabel(tree, '4 stars').props.onPress());
    expect(byLabel(tree, '4 stars').props.accessibilityState.selected).toBe(true);
    expect(byLabel(tree, '5 stars').props.accessibilityState.selected).toBe(false);

    await act(async () => byLabel(tree, 'Submit feedback').props.onPress());
    expect(saveFeedback).toHaveBeenCalledWith('tok', 'd1-06', 4, '');
  });
});
