import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCHEDULE_DAY1, SCHEDULE_DAY2, SESSION_COLORS, type SessionType } from '@/data/schedule';
import { useRemoteData } from '@/hooks/use-remote-data';
import { isValidScheduleData } from '@/utils/remote-validators';
import type { ScheduleData } from '@/types/remote-content';
import { Badge } from '@/components/ui/badge';
import { TypeChip } from '@/components/ui/type-chip';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { DayToggle } from './day-toggle';
import { SessionCard } from './session-card';

const SCHEDULE_FALLBACK: ScheduleData = { day1: SCHEDULE_DAY1, day2: SCHEDULE_DAY2 };

export function ScheduleScreen() {
  const [activeDay, setActiveDay] = useState('day1');
  const insets = useSafeAreaInsets();
  const schedule = useRemoteData('schedule.json', SCHEDULE_FALLBACK, isValidScheduleData);

  const DAYS = [
    { key: 'day1', label: 'Day 1 — 24 Oct', sessions: schedule.day1 },
    { key: 'day2', label: 'Day 2 — 25 Oct', sessions: schedule.day2 },
  ];
  const day = DAYS.find((d) => d.key === activeDay) ?? DAYS[0];

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: spacing['2xl'] + insets.top }]}>
        <Badge style={{ alignSelf: 'flex-start' }}>Program</Badge>
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
