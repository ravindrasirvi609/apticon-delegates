import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CalendarX2, ChevronLeft, Clock, MapPin } from 'lucide-react-native';
import { SCHEDULE_DAY1, SCHEDULE_DAY2, SESSION_COLORS } from '@/data/schedule';
import { useRemoteData } from '@/hooks/use-remote-data';
import { isValidScheduleData } from '@/utils/remote-validators';
import { findSession, isInteractiveSession } from '@/utils/session';
import type { ScheduleData } from '@/types/remote-content';
import { Screen } from '@/components/ui/screen';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ScalePressable } from '@/components/ui/pressable-scale';
import { TypeChip } from '@/components/ui/type-chip';
import { colors, fontFamily, fontSize, radius, spacing, textStyles } from '@/theme';
import { FeedbackPanel } from './feedback-panel';
import { QuestionsPanel } from './questions-panel';

const SCHEDULE_FALLBACK: ScheduleData = { day1: SCHEDULE_DAY1, day2: SCHEDULE_DAY2 };
const DAY_LABEL = { 1: 'Day 1 — 24 Oct', 2: 'Day 2 — 25 Oct' } as const;

type TabKey = 'details' | 'questions' | 'feedback';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'questions', label: 'Questions' },
  { key: 'feedback', label: 'Feedback' },
];

export function SessionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const schedule = useRemoteData('schedule.json', SCHEDULE_FALLBACK, isValidScheduleData);
  const [tab, setTab] = useState<TabKey>('details');

  const found = id ? findSession(schedule, id) : null;

  if (!found) {
    return (
      <Screen style={styles.notFound}>
        <StatusBar style="dark" />
        <View style={styles.notFoundContent}>
          <EmptyState
            icon={CalendarX2}
            title="Session not found"
            body="This session isn't in the schedule any more. Go back to the schedule to pick another."
          />
          <Button onPress={() => router.back()}>Back to schedule</Button>
        </View>
      </Screen>
    );
  }

  const { session, day } = found;
  const palette = SESSION_COLORS[session.type];
  const interactive = isInteractiveSession(session);
  const activeTab: TabKey = interactive ? tab : 'details';

  return (
    <Screen>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <ScalePressable
            onPress={() => router.back()}
            style={styles.back}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ChevronLeft color={colors.primary[700]} size={20} />
            <Text style={styles.backLabel}>Schedule</Text>
          </ScalePressable>

          <View style={styles.header}>
            <TypeChip label={session.type} bg={palette.bg} textColor={palette.text} />
            <Text style={styles.title}>{session.title}</Text>
          </View>

          {interactive ? (
            <View style={styles.tabs} accessibilityRole="tablist">
              {TABS.map((t) => {
                const active = t.key === activeTab;
                return (
                  <ScalePressable
                    key={t.key}
                    onPress={() => setTab(t.key)}
                    style={[styles.tab, active && styles.tabActive]}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={t.label}
                  >
                    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{t.label}</Text>
                  </ScalePressable>
                );
              })}
            </View>
          ) : null}

          <View style={styles.body}>
            {activeTab === 'details' ? (
              <Card style={styles.details}>
                <View style={styles.detailRow}>
                  <Clock color={colors.primary[700]} size={18} />
                  <Text style={styles.detailText}>
                    {DAY_LABEL[day]} · {session.time}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin color={colors.primary[700]} size={18} />
                  <Text style={styles.detailText}>{session.hall}</Text>
                </View>
                {session.description ? <Text style={styles.description}>{session.description}</Text> : null}
              </Card>
            ) : null}
            {activeTab === 'questions' ? <QuestionsPanel sessionId={session.id} /> : null}
            {activeTab === 'feedback' ? <FeedbackPanel sessionId={session.id} /> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: spacing['3xl'] },
  notFound: { alignItems: 'center', justifyContent: 'center' },
  notFoundContent: { paddingHorizontal: spacing['2xl'], gap: spacing.xl, alignItems: 'center' },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  backLabel: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.sm, color: colors.primary[700] },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.sm },
  title: { ...textStyles.h1 },
  tabs: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.surface[200],
    backgroundColor: colors.white,
  },
  tabActive: { backgroundColor: colors.primary[700], borderColor: colors.primary[700] },
  tabLabel: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.sm, color: colors.text.muted },
  tabLabelActive: { color: colors.white },
  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  details: { gap: spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  detailText: { ...textStyles.body, flex: 1 },
  description: { ...textStyles.bodyMuted },
});
