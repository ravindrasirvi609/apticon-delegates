import { Search } from 'lucide-react-native';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function SearchBar({ value, onChange }: { value: string; onChange: (text: string) => void }) {
  return (
    <View style={styles.container}>
      <Search color={colors.text.muted} size={16} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search committee by name, state, or institution..."
        placeholderTextColor={colors.text.muted}
        style={styles.input}
      />
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
    borderWidth: 1,
    borderColor: colors.surface[200],
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    height: 44,
  },
  input: { flex: 1, fontFamily: fontFamily.sans, fontSize: fontSize.base, color: colors.text.dark },
});
