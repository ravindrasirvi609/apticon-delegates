import { useState } from 'react';
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { Handshake } from 'lucide-react-native';
import { CO_ASSOCIATES, POWERED_BY } from '@/data/sponsors';
import { useRemoteData } from '@/hooks/use-remote-data';
import { isValidSponsorsData } from '@/utils/remote-validators';
import type { RemoteSponsor, SponsorsData } from '@/types/remote-content';
import { Badge } from '@/components/ui/badge';
import { colors, elevation, fontFamily, fontSize, radius, spacing, textStyles } from '@/theme';

const SPONSORS_FALLBACK: SponsorsData = { coAssociates: CO_ASSOCIATES, poweredBy: POWERED_BY };

export function SponsorsSection() {
  const { coAssociates, poweredBy } = useRemoteData('sponsors.json', SPONSORS_FALLBACK, isValidSponsorsData);

  if (coAssociates.length === 0 && poweredBy.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Badge>Partners</Badge>
        <Text style={styles.title}>Our Co-Associates</Text>
        <Text style={styles.subtitle}>Institutions partnering with APTICON 2026.</Text>
      </View>

      {coAssociates.length > 0 ? (
        <View style={styles.grid}>
          {coAssociates.map((sponsor) => (
            <LogoTile key={sponsor.name} sponsor={sponsor} />
          ))}
        </View>
      ) : null}

      {poweredBy.length > 0 ? (
        <View style={styles.poweredBy}>
          <Text style={styles.poweredByLabel}>Powered by</Text>
          <View style={styles.grid}>
            {poweredBy.map((sponsor) => (
              <LogoTile key={sponsor.name} sponsor={sponsor} wide />
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function LogoTile({ sponsor, wide = false }: { sponsor: RemoteSponsor; wide?: boolean }) {
  const [failed, setFailed] = useState(false);
  const source: ImageSourcePropType | undefined =
    typeof sponsor.logo === 'string' ? { uri: sponsor.logo } : sponsor.logo;

  return (
    <View
      style={[styles.tile, wide ? styles.tileWide : styles.tileThird]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={sponsor.name}
    >
      {source && !failed ? (
        <Image source={source} style={styles.logo} resizeMode="contain" onError={() => setFailed(true)} />
      ) : (
        // Logo missing or failed to load (e.g. offline remote URL): show the name instead.
        <View style={styles.fallback}>
          <Handshake color={colors.text.faint} size={16} />
          <Text style={styles.fallbackText} numberOfLines={3}>
            {sponsor.name}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing['2xl'], paddingHorizontal: spacing.lg, gap: spacing.lg },
  header: { alignItems: 'center', gap: spacing.sm },
  title: { ...textStyles.h1, textAlign: 'center' },
  subtitle: { ...textStyles.bodyMuted, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
  poweredBy: { alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  poweredByLabel: { ...textStyles.eyebrow, color: colors.text.muted },
  tile: {
    height: 76,
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surface[200],
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.sm,
  },
  // 3 per row on a phone-width screen: (100% - 2 gaps) / 3.
  tileThird: { width: '31.5%' },
  tileWide: { width: '48%', height: 92 },
  logo: { width: '100%', height: '100%' },
  fallback: { alignItems: 'center', gap: 2 },
  fallbackText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.xs,
    color: colors.text.muted,
    textAlign: 'center',
  },
});
