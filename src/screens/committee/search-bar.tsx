import { useState } from 'react';
import { Search, X } from 'lucide-react-native';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';
import { ScalePressable } from '@/components/ui/pressable-scale';

export function SearchBar({ value, onChange }: { value: string; onChange: (text: string) => void }) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <Search color={colors.text.muted} size={16} />
      <TextInput
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search committee by name, state, or institution..."
        placeholderTextColor={colors.text.muted}
        style={styles.input}
        accessibilityLabel="Search committee members"
        accessibilityRole="search"
      />
      {value.length > 0 ? (
        <ScalePressable
          onPress={() => onChange('')}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <X color={colors.text.muted} size={16} />
        </ScalePressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.surface[200],
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    height: 46,
  },
  containerFocused: { borderColor: colors.primary[700] },
  input: { flex: 1, fontFamily: fontFamily.sans, fontSize: fontSize.base, color: colors.text.dark },
  clearButton: { padding: spacing.xs },
});
