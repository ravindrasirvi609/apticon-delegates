import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

/**
 * Zero-dependency press feedback: scales down slightly + dims on press via
 * Pressable's `pressed` render-prop. Used by every interactive element in
 * the app (nav cards, toggles, accordion headers, buttons) so touch
 * feedback is consistent everywhere.
 */
export function ScalePressable({
  style,
  children,
  ...props
}: PressableProps & { style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      {...props}
      style={(state) => [
        { opacity: state.pressed ? 0.85 : 1, transform: [{ scale: state.pressed ? 0.97 : 1 }] },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      {children}
    </Pressable>
  );
}
