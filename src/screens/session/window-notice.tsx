import { StyleSheet, Text, View } from 'react-native';
import { Clock, Lock } from 'lucide-react-native';
import { Card } from '@/components/ui/card';
import type { SessionWindow } from '@/services/delegate-qa';
import { formatWhenIST } from '@/utils/format-when';
import { colors, fontFamily, fontSize, spacing, textStyles } from '@/theme';

/**
 * Shown instead of the Questions / Feedback form while the server says that window is closed.
 * (Used to render a disabled form that silently ignored taps, which looked like a bug.)
 */
export function WindowNotice({ window, what }: { window: SessionWindow; what: 'Questions' | 'Feedback' }) {
  const notStarted = window.reason !== 'closed';
  const opensAt = notStarted ? formatWhenIST(window.opensAt) : null;
  const Icon = notStarted ? Clock : Lock;

  return (
    <Card style={styles.card} accessibilityRole="summary">
      <View style={styles.icon}>
        <Icon color={colors.primary[700]} size={22} />
      </View>
      <Text style={styles.title}>{notStarted ? `${what} are not open yet` : `${what} are closed`}</Text>
      <Text style={styles.body}>
        {notStarted
          ? `You can send ${what.toLowerCase()} once this session starts${opensAt ? ` (${opensAt} IST)` : ''}.`
          : `${what} for this session are no longer being accepted.`}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: spacing.sm },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[100],
  },
  title: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.md, color: colors.text.dark, textAlign: 'center' },
  body: { ...textStyles.bodyMuted, textAlign: 'center' },
});
