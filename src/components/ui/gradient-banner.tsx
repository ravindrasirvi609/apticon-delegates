import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, type ViewStyle } from 'react-native';

export function GradientBanner({
  colors: gradientColors,
  height = 80,
  style,
}: {
  colors: [string, string];
  height?: number;
  style?: ViewStyle;
}) {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.banner, { height }, style]}
    />
  );
}

const styles = StyleSheet.create({
  banner: { width: '100%' },
});
