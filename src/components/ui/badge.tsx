import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function Badge({
  children,
  tone = 'accent',
  style,
}: {
  children: string;
  tone?: 'accent' | 'primary';
  style?: ViewStyle;
}) {
  const toneStyle = tone === 'primary' ? styles.primaryBadge : styles.accentBadge;
  const labelStyle = tone === 'primary' ? styles.primaryLabel : styles.accentLabel;
  return (
    <View style={[styles.badge, toneStyle, style]}>
      <Text style={[styles.label, labelStyle]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  accentBadge: { backgroundColor: colors.accent[200] },
  primaryBadge: { backgroundColor: colors.primary[100] },
  label: {
    fontFamily: fontFamily.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  accentLabel: { color: colors.primary[900] },
  primaryLabel: { color: colors.primary[700] },
});
