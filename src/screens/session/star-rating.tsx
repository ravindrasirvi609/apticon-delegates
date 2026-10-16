import { StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { ScalePressable } from '@/components/ui/pressable-scale';
import { colors, spacing } from '@/theme';

const STARS = [1, 2, 3, 4, 5];

export function StarRating({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Session rating">
      {STARS.map((star) => {
        const selected = star <= value;
        return (
          <ScalePressable
            key={star}
            disabled={disabled}
            onPress={() => onChange(star)}
            hitSlop={6}
            accessibilityRole="radio"
            accessibilityLabel={`${star} ${star === 1 ? 'star' : 'stars'}`}
            accessibilityState={{ selected, disabled }}
          >
            <Star
              size={36}
              color={selected ? colors.accent[500] : colors.surface[300]}
              fill={selected ? colors.accent[400] : 'transparent'}
            />
          </ScalePressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
});
