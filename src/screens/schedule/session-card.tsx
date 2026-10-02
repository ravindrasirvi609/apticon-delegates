import { StyleSheet, Text, View } from 'react-native';
import type { ScheduleSession } from '@/data/schedule';
import { SESSION_COLORS } from '@/data/schedule';
import { TypeChip } from '@/components/ui/type-chip';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function SessionCard({ session }: { session: ScheduleSession }) {
  const palette = SESSION_COLORS[session.type];
  return (
    <View style={styles.row}>
      <View style={[styles.accentBar, { backgroundColor: palette.bg }]} />
      <View style={styles.card}>
        <Text style={styles.time}>{session.time}</Text>
        <View style={styles.body}>
          <TypeChip label={session.type} bg={palette.bg} textColor={palette.text} />
          <Text style={styles.title}>{session.title}</Text>
          {session.description ? <Text style={styles.description}>{session.description}</Text> : null}
          <Text style={styles.hall}>{session.hall}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  accentBar: { width: 4 },
  card: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  time: { width: 88, fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.xs, color: colors.text.muted },
  body: { flex: 1, gap: spacing.xs },
  title: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark },
  description: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted },
  hall: { fontFamily: fontFamily.sans, fontSize: fontSize.xs, color: colors.text.muted },
});
