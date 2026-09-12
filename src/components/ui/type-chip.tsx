import { StyleSheet, Text, View } from 'react-native';
import { fontFamily, fontSize, radius, spacing } from '@/theme';

export function TypeChip({ label, bg, textColor }: { label: string; bg: string; textColor: string }) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  label: {
    fontFamily: fontFamily.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
