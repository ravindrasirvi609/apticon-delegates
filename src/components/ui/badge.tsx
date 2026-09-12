import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function Badge({ children, style }: { children: string; style?: ViewStyle }) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.label}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.accent[200],
  },
  label: {
    fontFamily: fontFamily.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.primary[900],
  },
});
