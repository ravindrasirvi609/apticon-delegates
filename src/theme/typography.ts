import { colors } from './colors';

export const fontFamily = {
  display: 'PlayfairDisplay_700Bold',
  displayBlack: 'PlayfairDisplay_900Black',
  displaySemiBold: 'PlayfairDisplay_600SemiBold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
} as const;

export const fontSize = {
  xs: 12,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 36,
} as const;

/**
 * Composed presets for the new shared components (ScreenHeader, EmptyState,
 * etc). Existing per-screen StyleSheets may keep composing fontFamily/fontSize
 * directly where they need finer control — this isn't a forced migration.
 */
export const textStyles = {
  display: {
    fontFamily: fontFamily.displayBlack,
    fontSize: fontSize['3xl'],
    lineHeight: 42,
    color: colors.text.light,
  },
  h1: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.xl,
    lineHeight: 30,
    color: colors.text.dark,
  },
  h2: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.lg,
    lineHeight: 26,
    color: colors.text.dark,
  },
  eyebrow: {
    fontFamily: fontFamily.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: colors.accent[500],
  },
  body: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base,
    lineHeight: 22,
    color: colors.text.dark,
  },
  bodyMuted: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base,
    lineHeight: 22,
    color: colors.text.muted,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.sm,
    color: colors.text.muted,
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs,
    color: colors.text.faint,
  },
} as const;
