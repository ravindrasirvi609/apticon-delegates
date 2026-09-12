import { StyleSheet, Text, View } from 'react-native';
import { useCountdown } from '@/hooks/use-countdown';
import { colors, fontFamily, fontSize, spacing } from '@/theme';

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.unit}>
      <Text style={styles.value}>{String(value).padStart(2, '0')}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function CountdownRow({ target }: { target: Date }) {
  const { days, hours, minutes, isPast } = useCountdown(target);

  if (isPast) {
    return <Text style={styles.live}>APTICON 2026 is here!</Text>;
  }

  return (
    <View style={styles.row}>
      <Unit value={days} label="Days" />
      <Unit value={hours} label="Hours" />
      <Unit value={minutes} label="Mins" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.lg, justifyContent: 'center' },
  unit: { alignItems: 'center', minWidth: 56 },
  value: { fontFamily: fontFamily.displayBlack, fontSize: fontSize['2xl'], color: colors.white },
  label: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.xs, color: colors.accent[200], textTransform: 'uppercase' },
  live: { fontFamily: fontFamily.display, fontSize: fontSize.lg, color: colors.white, textAlign: 'center' },
});
