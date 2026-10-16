import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { MessageCircleQuestion, Send } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSession } from '@/hooks/use-session';
import { ApiError } from '@/services/api';
import {
  askQuestion,
  fetchMyQuestions,
  type MyQuestion,
  type QuestionStatus,
  type SessionWindow,
} from '@/services/delegate-qa';
import { colors, fontFamily, fontSize, radius, spacing, textStyles } from '@/theme';
import { LoginPrompt } from './login-prompt';

const MAX_QUESTION = 500;
const MIN_QUESTION = 3;

// How a question's status reads to the delegate who asked it. Public display is not built yet,
// so "pending" simply means it has been received.
const STATUS_LABEL: Record<QuestionStatus, string> = {
  pending: 'Submitted',
  approved: 'Approved',
  answered: 'Answered',
  hidden: 'Submitted',
};

export function QuestionsPanel({ sessionId }: { sessionId: string }) {
  const { session } = useSession();
  if (!session) {
    return (
      <LoginPrompt
        icon={MessageCircleQuestion}
        title="Log in to ask a question"
        body="Sign in with your registration QR and email to send a question for this session."
      />
    );
  }
  return <QuestionsForm sessionId={sessionId} token={session.token} />;
}

function QuestionsForm({ sessionId, token }: { sessionId: string; token: string }) {
  const { handleApiError } = useSession();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [window, setWindow] = useState<SessionWindow | null>(null);
  const [questions, setQuestions] = useState<MyQuestion[]>([]);
  const [maxQuestions, setMaxQuestions] = useState(5);
  const [text, setText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchMyQuestions(token, sessionId);
      setWindow(data.window);
      setQuestions(data.questions);
      setMaxQuestions(data.maxQuestions);
    } catch (err) {
      if (handleApiError(err)) return;
      setLoadError(err instanceof ApiError ? err.message : 'Could not load your questions.');
    } finally {
      setLoading(false);
    }
  }, [token, sessionId, handleApiError]);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async () => {
    const trimmed = text.trim();
    if (trimmed.length < MIN_QUESTION) {
      setMessage({ kind: 'error', text: 'Please write your question first.' });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const data = await askQuestion(token, sessionId, trimmed, isAnonymous);
      setQuestions((prev) => [data.question, ...prev]);
      setWindow(data.window);
      setText('');
      setMessage({ kind: 'success', text: 'Your question has been submitted.' });
    } catch (err) {
      if (handleApiError(err)) return;
      // The typed question is kept so a network hiccup never loses it.
      setMessage({
        kind: 'error',
        text: err instanceof ApiError ? err.message : 'Could not send your question. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} color={colors.primary[700]} />;
  }

  if (loadError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{loadError}</Text>
        <Button variant="secondary" onPress={() => void load()}>
          Try again
        </Button>
      </View>
    );
  }

  const open = window?.open ?? false;
  const remaining = Math.max(0, maxQuestions - questions.length);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.heading}>Ask a question</Text>
        {!open ? (
          <Text style={styles.notice}>
            {window?.reason === 'not_started'
              ? 'Questions open once this session starts.'
              : 'Questions for this session are closed.'}
          </Text>
        ) : (
          <Text style={styles.notice}>
            {remaining > 0
              ? `You can send ${remaining} more ${remaining === 1 ? 'question' : 'questions'} for this session.`
              : 'You have used all your questions for this session.'}
          </Text>
        )}

        <TextInput
          style={[styles.input, !open && styles.inputDisabled]}
          value={text}
          onChangeText={setText}
          editable={open && remaining > 0 && !submitting}
          placeholder="Type your question for the speaker"
          placeholderTextColor={colors.text.faint}
          multiline
          maxLength={MAX_QUESTION}
          textAlignVertical="top"
          accessibilityLabel="Your question"
        />
        <Text style={styles.counter}>
          {text.length}/{MAX_QUESTION}
        </Text>

        <View style={styles.anonRow}>
          <View style={styles.anonText}>
            <Text style={styles.anonTitle}>Ask anonymously</Text>
            <Text style={styles.anonHint}>Your name won’t be shown with the question.</Text>
          </View>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            disabled={!open || submitting}
            trackColor={{ true: colors.primary[600], false: colors.surface[300] }}
            accessibilityLabel="Ask anonymously"
          />
        </View>

        {message ? (
          <Text
            style={message.kind === 'error' ? styles.error : styles.success}
            accessibilityRole={message.kind === 'error' ? 'alert' : undefined}
          >
            {message.text}
          </Text>
        ) : null}

        {open && remaining > 0 ? (
          <Button icon={Send} disabled={submitting} onPress={() => void submit()}>
            {submitting ? 'Sending…' : 'Send question'}
          </Button>
        ) : null}
      </Card>

      {questions.length > 0 ? (
        <View style={styles.list}>
          <Text style={styles.heading}>Your questions</Text>
          {questions.map((q) => (
            <Card key={q.id} style={styles.question}>
              <Text style={styles.questionText}>{q.text}</Text>
              <View style={styles.questionMeta}>
                <Text style={styles.status}>{STATUS_LABEL[q.status]}</Text>
                {q.isAnonymous ? <Text style={styles.anonHint}>Anonymous</Text> : null}
              </View>
            </Card>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xl },
  loader: { paddingVertical: spacing['2xl'] },
  center: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl },
  card: { gap: spacing.md },
  heading: { ...textStyles.h2 },
  notice: { ...textStyles.bodyMuted },
  input: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: colors.surface[300],
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface[50],
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base,
    color: colors.text.dark,
  },
  inputDisabled: { opacity: 0.6 },
  counter: { ...textStyles.caption, alignSelf: 'flex-end' },
  anonRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  anonText: { flex: 1 },
  anonTitle: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.base, color: colors.text.dark },
  anonHint: { ...textStyles.caption },
  error: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.sm, color: '#B91C1C' },
  success: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.sm, color: '#047857' },
  list: { gap: spacing.md },
  question: { gap: spacing.sm },
  questionText: { ...textStyles.body },
  questionMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  status: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.xs, color: colors.primary[700] },
});
