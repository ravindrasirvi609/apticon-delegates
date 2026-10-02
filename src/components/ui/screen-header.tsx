import { StyleSheet, Text, View } from 'react-native';
import { spacing, textStyles } from '@/theme';
import { Badge } from './badge';

/**
 * Shared header block for Schedule / Committee / Venue / Speakers — Home
 * keeps its own bespoke hero (same deliberate exception as before).
 */
export function ScreenHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.container}>
      {eyebrow ? <Badge style={styles.badge}>{eyebrow}</Badge> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    gap: spacing.sm,
  },
  badge: { alignSelf: 'flex-start' },
  title: { ...textStyles.h1 },
  subtitle: { ...textStyles.bodyMuted },
});
