import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { Send } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSession } from '@/hooks/use-session';
import { ApiError } from '@/services/api';
import { fetchMyFeedback, saveFeedback, type SessionWindow } from '@/services/delegate-qa';
import { colors, fontFamily, fontSize, radius, spacing, textStyles } from '@/theme';
import { StarRating } from './star-rating';

const MAX_COMMENT = 1000;

export function FeedbackPanel({ sessionId }: { sessionId: string }) {
  const { session } = useSession();
  // Session screens are only reachable while logged in; null only while a logout is in flight.
  if (!session) return null;
  return <FeedbackForm sessionId={sessionId} token={session.token} />;
}

function FeedbackForm({ sessionId, token }: { sessionId: string; token: string }) {
  const { handleApiError } = useSession();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [window, setWindow] = useState<SessionWindow | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hasSaved, setHasSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchMyFeedback(token, sessionId);
      setWindow(data.window);
      if (data.feedback) {
        setRating(data.feedback.rating);
        setComment(data.feedback.comment);
        setHasSaved(true);
      }
    } catch (err) {
      if (handleApiError(err)) return;
      setLoadError(err instanceof ApiError ? err.message : 'Could not load your feedback.');
    } finally {
      setLoading(false);
    }
  }, [token, sessionId, handleApiError]);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async () => {
    if (rating < 1) {
      setMessage({ kind: 'error', text: 'Please choose a star rating first.' });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const data = await saveFeedback(token, sessionId, rating, comment.trim());
      setWindow(data.window);
      setHasSaved(true);
      setMessage({ kind: 'success', text: 'Thank you! Your feedback has been saved.' });
    } catch (err) {
      if (handleApiError(err)) return;
      setMessage({
        kind: 'error',
        text: err instanceof ApiError ? err.message : 'Could not save your feedback. Please try again.',
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

  return (
    <Card style={styles.card}>
      <Text style={styles.heading}>How was this session?</Text>
      {!open ? (
        <Text style={styles.notice}>
          {window?.reason === 'not_started'
            ? 'Feedback opens once this session starts.'
            : 'Feedback for this session is closed.'}
        </Text>
      ) : null}

      <StarRating value={rating} onChange={setRating} disabled={!open || submitting} />

      <TextInput
        style={[styles.input, !open && styles.inputDisabled]}
        value={comment}
        onChangeText={setComment}
        editable={open && !submitting}
        placeholder="Comments (optional)"
        placeholderTextColor={colors.text.faint}
        multiline
        maxLength={MAX_COMMENT}
        textAlignVertical="top"
        accessibilityLabel="Feedback comments"
      />
      <Text style={styles.counter}>
        {comment.length}/{MAX_COMMENT}
      </Text>

      {message ? (
        <Text
          style={message.kind === 'error' ? styles.error : styles.success}
          accessibilityRole={message.kind === 'error' ? 'alert' : undefined}
        >
          {message.text}
        </Text>
      ) : null}

      {open ? (
        <Button icon={Send} disabled={submitting} onPress={() => void submit()}>
          {submitting ? 'Saving…' : hasSaved ? 'Update feedback' : 'Submit feedback'}
        </Button>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
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
  error: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.sm, color: '#B91C1C' },
  success: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.sm, color: '#047857' },
});
