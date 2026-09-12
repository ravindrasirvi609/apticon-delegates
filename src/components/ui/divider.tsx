import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, spacing } from '@/theme';

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.line, style]} />;
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: colors.surface[200],
    marginVertical: spacing.lg,
  },
});
