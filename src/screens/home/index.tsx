import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CalendarDays, MapPin, Mic, Users } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EVENT, STATS } from '@/data/event';
import { useRemoteData } from '@/hooks/use-remote-data';
import { isValidEventData } from '@/utils/remote-validators';
import type { EventData } from '@/types/remote-content';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { CountdownRow } from './countdown-row';
import { QuickNavCard } from './quick-nav-card';

const EVENT_FALLBACK: EventData = { event: EVENT, stats: STATS };

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { event, stats } = useRemoteData('event.json', EVENT_FALLBACK, isValidEventData);
  const startDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <View style={[styles.hero, { paddingTop: spacing['3xl'] + insets.top }]}>
        <Image source={require('../../../assets/brand/apticon-logo.png')} style={styles.logo} resizeMode="contain" />
        <Badge>{event.edition}</Badge>
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.theme}>{event.theme}</Text>
        <Text style={styles.dates}>{event.dateDisplay} · {event.venueName}</Text>
        <CountdownRow target={startDate} />
      </View>

      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Divider />

      <Text style={styles.sectionTitle}>Explore APTICON 2026</Text>
      <View style={styles.grid}>
        <QuickNavCard href="/schedule" icon={CalendarDays} label="Schedule" />
        <QuickNavCard href="/committee" icon={Users} label="Committee" />
        <QuickNavCard href="/speakers" icon={Mic} label="Speakers" />
        <QuickNavCard href="/venue" icon={MapPin} label="Venue" />
      </View>

      <Card style={styles.hostCard}>
        <Text style={styles.hostTitle}>Hosted by</Text>
        <Text style={styles.hostBody}>{event.host}, in partnership with {event.partner}.</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface[50] },
  content: { paddingBottom: spacing['3xl'] },
  hero: {
    backgroundColor: colors.primary[900],
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: { width: 96, height: 96, marginBottom: spacing.sm },
  title: {
    fontFamily: fontFamily.displayBlack,
    fontSize: fontSize['3xl'],
    color: colors.white,
    textAlign: 'center',
  },
  theme: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base,
    color: colors.surface[100],
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  dates: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.sm,
    color: colors.accent[200],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  stat: { alignItems: 'center' },
  statValue: { fontFamily: fontFamily.display, fontSize: fontSize.xl, color: colors.primary[700] },
  statLabel: { fontFamily: fontFamily.sans, fontSize: fontSize.xs, color: colors.text.muted, textAlign: 'center', marginTop: 2 },
  sectionTitle: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.lg,
    color: colors.text.dark,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  hostCard: { marginHorizontal: spacing.lg, marginTop: spacing.xl },
  hostTitle: { fontFamily: fontFamily.sansBold, fontSize: fontSize.sm, color: colors.primary[700], marginBottom: spacing.xs },
  hostBody: { fontFamily: fontFamily.sans, fontSize: fontSize.base, color: colors.text.muted, lineHeight: 22 },
});
