import { StyleSheet, Text, View } from 'react-native';
import type { RemoteTransportOption } from '@/types/remote-content';
import { resolveIcon } from '@/utils/icon-map';
import { IconTile } from '@/components/ui/icon-tile';
import { colors, elevation, fontFamily, fontSize, radius, spacing } from '@/theme';

export function TransportCard({ option }: { option: RemoteTransportOption }) {
  const Icon = typeof option.icon === 'string' ? resolveIcon(option.icon) : option.icon;
  return (
    <View style={styles.card}>
      <IconTile icon={Icon} />
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
    padding: spacing.lg,
    gap: spacing.xs,
    marginBottom: spacing.md,
    ...elevation.sm,
  },
  label: { fontFamily: fontFamily.sansBold, fontSize: fontSize.xs, color: colors.accent[500], textTransform: 'uppercase', marginTop: spacing.sm },
  title: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark, marginBottom: spacing.xs },
  detail: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted },
});
