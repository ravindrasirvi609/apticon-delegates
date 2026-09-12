import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export interface DayOption {
  key: string;
  label: string;
}

export function DayToggle({
  options,
  active,
  onChange,
}: {
  options: DayOption[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const isActive = opt.key === active;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[styles.pill, isActive && styles.pillActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  pill: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.surface[200],
    alignItems: 'center',
  },
  pillActive: { backgroundColor: colors.primary[700], borderColor: colors.primary[700] },
  label: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.sm, color: colors.text.muted },
  labelActive: { color: colors.white },
});
