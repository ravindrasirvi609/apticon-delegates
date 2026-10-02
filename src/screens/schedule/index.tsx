import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SCHEDULE_DAY1, SCHEDULE_DAY2, SESSION_COLORS, type SessionType } from '@/data/schedule';
import { useRemoteData } from '@/hooks/use-remote-data';
import { isValidScheduleData } from '@/utils/remote-validators';
import type { ScheduleData } from '@/types/remote-content';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Card } from '@/components/ui/card';
import { TypeChip } from '@/components/ui/type-chip';
import { fontFamily, spacing, textStyles } from '@/theme';
import { DayToggle } from './day-toggle';
import { SessionCard } from './session-card';

const SCHEDULE_FALLBACK: ScheduleData = { day1: SCHEDULE_DAY1, day2: SCHEDULE_DAY2 };

export function ScheduleScreen() {
  const [activeDay, setActiveDay] = useState('day1');
  const schedule = useRemoteData('schedule.json', SCHEDULE_FALLBACK, isValidScheduleData);

  const DAYS = [
    { key: 'day1', label: 'Day 1 — 24 Oct', sessions: schedule.day1 },
    { key: 'day2', label: 'Day 2 — 25 Oct', sessions: schedule.day2 },
  ];
  const day = DAYS.find((d) => d.key === activeDay) ?? DAYS[0];

  return (
    <Screen>
      <StatusBar style="dark" />
      <ScreenHeader eyebrow="Program" title="Conference Schedule" />
      <DayToggle options={DAYS} active={activeDay} onChange={setActiveDay} />
      <FlatList
        data={day.sessions}
        keyExtractor={(item, index) => `${activeDay}-${index}`}
        renderItem={({ item }) => <SessionCard session={item} />}
        ListHeaderComponent={<View style={styles.listSpacer} />}
        ListFooterComponent={<Legend />}
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
}

function Legend() {
  const types = Object.keys(SESSION_COLORS) as SessionType[];
  return (
    <Card style={styles.legend}>
      <Text style={styles.legendTitle}>Session Types</Text>
      <View style={styles.legendRow}>
        {types.map((type) => (
          <TypeChip key={type} label={type} bg={SESSION_COLORS[type].bg} textColor={SESSION_COLORS[type].text} />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  listSpacer: { height: spacing.sm },
  listContent: { paddingBottom: spacing['3xl'] },
  legend: { marginHorizontal: spacing.lg, marginTop: spacing.md, gap: spacing.md },
  legendTitle: { ...textStyles.label, fontFamily: fontFamily.sansSemiBold },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
