import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

/**
 * Shared screen frame: applies the safe-area top inset + base background,
 * replacing the manual `useSafeAreaInsets()` + padding boilerplate that
 * used to be repeated in every screen's index.tsx.
 */
export function Screen({
  children,
  scroll = false,
  contentStyle,
  style,
}: {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();

  if (scroll) {
    return (
      <ScrollView
        style={[styles.screen, style]}
        contentContainerStyle={[{ paddingTop: insets.top }, contentStyle]}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }, style, contentStyle]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface[50] },
});

export const screenPaddingBottom = spacing['3xl'];
