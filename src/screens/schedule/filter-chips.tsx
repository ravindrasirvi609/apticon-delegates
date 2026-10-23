import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';
import { ScalePressable } from '@/components/ui/pressable-scale';

export interface ChipOption {
  key: string;
  label: string;
}

/** A labelled, horizontally scrolling single-select row of pills (used for slot / hall / subject / day). */
export function FilterChips({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: ChipOption[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.row}
      >
        {options.map((opt) => {
          const isActive = opt.key === active;
          return (
            <ScalePressable
              key={opt.key}
              onPress={() => onChange(opt.key)}
              style={[styles.chip, isActive && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${label}: ${opt.label}`}
            >
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>{opt.label}</Text>
            </ScalePressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.xs, marginBottom: spacing.sm },
  label: {
    paddingHorizontal: spacing.lg,
    fontFamily: fontFamily.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.text.faint,
  },
  row: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.surface[200],
    backgroundColor: colors.white,
  },
  chipActive: { backgroundColor: colors.primary[700], borderColor: colors.primary[700] },
  chipLabel: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.sm, color: colors.text.muted },
  chipLabelActive: { color: colors.white },
});
