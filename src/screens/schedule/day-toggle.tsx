import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, fontSize, motion, radius, spacing } from '@/theme';
import { ScalePressable } from '@/components/ui/pressable-scale';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export interface DayOption {
  key: string;
  label: string;
}

export function DayToggle({
  options,
  active,
  onChange,
}: {
  options: DayOption[];
  active: string;
  onChange: (key: string) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const activeIndex = Math.max(0, options.findIndex((opt) => opt.key === active));
  const indicator = useRef(new Animated.Value(activeIndex)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      indicator.setValue(activeIndex);
      return;
    }
    Animated.timing(indicator, {
      toValue: activeIndex,
      duration: motion.base,
      useNativeDriver: false,
    }).start();
  }, [activeIndex, indicator, reducedMotion]);

  const pillWidth = trackWidth / options.length;

  return (
    <View
      style={styles.row}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width - spacing.lg * 2)}
    >
      {trackWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              width: pillWidth,
              transform: [
                {
                  translateX: indicator.interpolate({
                    inputRange: [0, Math.max(1, options.length - 1)],
                    outputRange: [0, pillWidth * Math.max(1, options.length - 1)],
                  }),
                },
              ],
            },
          ]}
        />
      ) : null}
      {options.map((opt) => {
        const isActive = opt.key === active;
        return (
          <ScalePressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={styles.pill}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={opt.label}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{opt.label}</Text>
          </ScalePressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.lg,
    bottom: spacing.md,
    backgroundColor: colors.primary[700],
    borderRadius: radius.full,
  },
  pill: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.surface[200],
    alignItems: 'center',
  },
  label: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.sm, color: colors.text.muted },
  labelActive: { color: colors.white },
});
