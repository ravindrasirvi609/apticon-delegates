import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CalendarDays, MapPin, Mic, Users } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EVENT, STATS } from '@/data/event';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { CountdownRow } from './countdown-row';
import { QuickNavCard } from './quick-nav-card';

export function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <View style={[styles.hero, { paddingTop: spacing['3xl'] + insets.top }]}>
        <Image source={require('../../../assets/brand/apticon-logo.png')} style={styles.logo} resizeMode="contain" />
        <Badge>{EVENT.edition}</Badge>
        <Text style={styles.title}>{EVENT.name}</Text>
        <Text style={styles.theme}>{EVENT.theme}</Text>
        <Text style={styles.dates}>{EVENT.dateDisplay} · {EVENT.venueName}</Text>
        <CountdownRow target={EVENT.startDate} />
      </View>

      <View style={styles.statsRow}>
        {STATS.map((stat) => (
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
        <Text style={styles.hostBody}>{EVENT.host}, in partnership with {EVENT.partner}.</Text>
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
