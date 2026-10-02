import { colors } from './colors';

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, full: 999 } as const;

/** Shared shadow presets so every card/button uses one of three depths. */
export const elevation = {
  sm: {
    shadowColor: colors.secondary[900],
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  md: {
    shadowColor: colors.secondary[900],
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  lg: {
    shadowColor: colors.secondary[900],
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
} as const;

/** Durations (ms) for the few places in the app that animate. */
export const motion = { fast: 120, base: 200, slow: 320 } as const;
