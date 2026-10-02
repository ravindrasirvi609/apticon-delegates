import { StyleSheet, Text, type GestureResponderEvent } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';
import { ScalePressable } from './pressable-scale';

export function Button({
  children,
  onPress,
  icon: Icon,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
}: {
  children: string;
  onPress: (event: GestureResponderEvent) => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const variantStyle = VARIANTS[variant];
  return (
    <ScalePressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? children}
      accessibilityState={{ disabled }}
      style={[styles.base, variantStyle.container, disabled && styles.disabled]}
    >
      {Icon ? <Icon color={variantStyle.labelColor} size={16} /> : null}
      <Text style={[styles.label, { color: variantStyle.labelColor }]}>{children}</Text>
    </ScalePressable>
  );
}

const VARIANTS = {
  primary: { container: { backgroundColor: colors.primary[700] }, labelColor: colors.white },
  secondary: {
    container: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.surface[300] },
    labelColor: colors.text.dark,
  },
  ghost: { container: { backgroundColor: 'transparent' }, labelColor: colors.primary[700] },
} as const;

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.full,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
  },
  disabled: { opacity: 0.5 },
  label: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.sm },
});
