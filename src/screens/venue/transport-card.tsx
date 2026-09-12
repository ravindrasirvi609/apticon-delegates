import { StyleSheet, Text, View } from 'react-native';
import type { TransportOption } from '@/data/venue';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function TransportCard({ option }: { option: TransportOption }) {
  const Icon = option.icon;
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Icon color={colors.white} size={20} />
      </View>
      <Text style={styles.label}>{option.label}</Text>
      <Text style={styles.title}>{option.title}</Text>
      {option.details.map((detail) => (
        <Text key={detail} style={styles.detail}>• {detail}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
    padding: spacing.lg,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: { fontFamily: fontFamily.sansBold, fontSize: fontSize.xs, color: colors.accent[500], textTransform: 'uppercase' },
  title: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark, marginBottom: spacing.xs },
  detail: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted },
});
