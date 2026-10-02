import { Link, type Href } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors, elevation, fontFamily, fontSize, radius, spacing } from '@/theme';
import { ScalePressable } from '@/components/ui/pressable-scale';
import { IconTile } from '@/components/ui/icon-tile';

export function QuickNavCard({ href, icon: Icon, label }: { href: Href; icon: LucideIcon; label: string }) {
  return (
    <Link href={href} asChild>
      <ScalePressable style={styles.card} accessibilityRole="button" accessibilityLabel={label}>
        <IconTile icon={Icon} />
        <Text style={styles.label}>{label}</Text>
      </ScalePressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...elevation.sm,
  },
  label: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark },
});
