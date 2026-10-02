import { StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors, radius } from '@/theme';

/**
 * Colored rounded icon wrapper, shared by QuickNavCard, TransportCard, and
 * the Speakers empty state — previously each duplicated this as its own
 * `iconWrap` style.
 */
export function IconTile({
  icon: Icon,
  size = 'md',
  tone = 'primary',
}: {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'primary' | 'accent' | 'tint';
}) {
  const dimension = SIZES[size];
  const toneStyle = TONES[tone];
  return (
    <View
      style={[
        styles.tile,
        { width: dimension.box, height: dimension.box, borderRadius: dimension.radius },
        toneStyle.container,
      ]}
    >
      <Icon color={toneStyle.iconColor} size={dimension.icon} />
    </View>
  );
}

const SIZES = {
  sm: { box: 36, radius: radius.md, icon: 16 },
  md: { box: 44, radius: radius.md, icon: 20 },
  lg: { box: 80, radius: radius.xl, icon: 36 },
} as const;

const TONES = {
  primary: { container: { backgroundColor: colors.primary[700] }, iconColor: colors.white },
  accent: { container: { backgroundColor: colors.accent[500] }, iconColor: colors.white },
  tint: { container: { backgroundColor: colors.primary[100] }, iconColor: colors.primary[700] },
} as const;

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center' },
});
