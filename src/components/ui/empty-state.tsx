import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { spacing, textStyles } from '@/theme';
import { Badge } from './badge';
import { IconTile } from './icon-tile';

export function EmptyState({
  icon,
  eyebrow,
  title,
  body,
}: {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.container}>
      <IconTile icon={icon} size="lg" tone="tint" />
      {eyebrow ? <Badge style={styles.badge}>{eyebrow}</Badge> : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.md },
  badge: { marginTop: spacing.xs },
  title: { ...textStyles.h2, textAlign: 'center' },
  body: { ...textStyles.bodyMuted, textAlign: 'center' },
});
