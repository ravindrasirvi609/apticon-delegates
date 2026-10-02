import { StyleSheet, View, type ViewProps } from 'react-native';
import { colors, elevation, radius, spacing } from '@/theme';

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
    padding: spacing.lg,
    ...elevation.md,
  },
});
