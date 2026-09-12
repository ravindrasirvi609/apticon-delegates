import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SCHEDULE_DAY1, SCHEDULE_DAY2, SESSION_COLORS, type SessionType } from '@/data/schedule';
import { Badge } from '@/components/ui/badge';
import { TypeChip } from '@/components/ui/type-chip';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { DayToggle } from './day-toggle';
import { SessionCard } from './session-card';

const DAYS = [
  { key: 'day1', label: 'Day 1 — 24 Oct', sessions: SCHEDULE_DAY1 },
  { key: 'day2', label: 'Day 2 — 25 Oct', sessions: SCHEDULE_DAY2 },
];

export function ScheduleScreen() {
  const [activeDay, setActiveDay] = useState('day1');
  const day = DAYS.find((d) => d.key === activeDay) ?? DAYS[0];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Badge>Program</Badge>
        <Text style={styles.title}>Conference Schedule</Text>
      </View>
      <DayToggle options={DAYS} active={activeDay} onChange={setActiveDay} />
      <FlatList
        data={day.sessions}
        keyExtractor={(item, index) => `${activeDay}-${index}`}
        renderItem={({ item }) => <SessionCard session={item} />}
        ListFooterComponent={<Legend />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

function Legend() {
  const types = Object.keys(SESSION_COLORS) as SessionType[];
  return (
    <View style={styles.legend}>
      <Text style={styles.legendTitle}>Session Types</Text>
      <View style={styles.legendRow}>
        {types.map((type) => (
          <TypeChip key={type} label={type} bg={SESSION_COLORS[type].bg} textColor={SESSION_COLORS[type].text} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface[50] },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing['2xl'], gap: spacing.sm },
  title: { fontFamily: fontFamily.display, fontSize: fontSize.xl, color: colors.text.dark },
  listContent: { paddingBottom: spacing['3xl'] },
  legend: { padding: spacing.lg, gap: spacing.md },
  legendTitle: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.sm, color: colors.text.muted },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
