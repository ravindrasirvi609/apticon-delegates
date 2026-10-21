import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { SPEAKER_ROLE_LABELS, type Speaker, type SpeakerRole } from '@/data/speakers';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScalePressable } from '@/components/ui/pressable-scale';
import { TypeChip } from '@/components/ui/type-chip';
import { colors, fontFamily, fontSize, spacing } from '@/theme';

const AVATAR_SIZE = 56;

// Same hues as the matching session types on the schedule (keynote / workshop / panel / scientific).
const ROLE_COLORS: Record<SpeakerRole, string> = {
  lecture: '#1E293B',
  workshop: '#7E22CE',
  moderator: '#C2410C',
  panelist: '#C2410C',
  chair: '#047857',
  cochair: '#047857',
};

export function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const router = useRouter();
  const tint = ROLE_COLORS[speaker.appearances[0].role];

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Avatar image={speaker.image} tint={tint} size={AVATAR_SIZE} />
        <View style={styles.identity}>
          <Text style={styles.name}>{speaker.name}</Text>
          {speaker.designation ? <Text style={styles.meta}>{speaker.designation}</Text> : null}
          {speaker.institution ? <Text style={styles.meta}>{speaker.institution}</Text> : null}
        </View>
      </View>

      <View style={styles.appearances}>
        {speaker.appearances.map((a, index) => {
          const row = (
            <View style={styles.appearance}>
              <TypeChip label={SPEAKER_ROLE_LABELS[a.role]} bg={ROLE_COLORS[a.role]} textColor={colors.white} />
              <Text style={styles.session}>{a.session}</Text>
              {a.sessionId ? <ChevronRight color={colors.text.faint} size={16} /> : null}
            </View>
          );
          const sessionId = a.sessionId;
          if (!sessionId) return <View key={index}>{row}</View>;
          return (
            <ScalePressable
              key={index}
              accessibilityRole="button"
              accessibilityLabel={`${SPEAKER_ROLE_LABELS[a.role]}, ${a.session}. Open session`}
              onPress={() => router.push({ pathname: '/session/[id]', params: { id: sessionId } })}
            >
              {row}
            </ScalePressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: spacing.lg, marginBottom: spacing.md, gap: spacing.md, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  identity: { flex: 1, gap: 2 },
  name: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark },
  meta: { fontFamily: fontFamily.sans, fontSize: fontSize.xs, color: colors.text.muted },
  appearances: { gap: spacing.sm },
  appearance: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  session: { flex: 1, fontFamily: fontFamily.sansMedium, fontSize: fontSize.sm, color: colors.text.dark },
});
