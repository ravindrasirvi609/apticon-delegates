import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import type { OralPresentation, PosterPresentation } from '@/data/presentations';
import { SESSION_COLORS } from '@/data/schedule';
import { TypeChip } from '@/components/ui/type-chip';
import { subjectLabel } from '@/utils/presentation-filter';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

type Props =
  | { kind: 'oral'; item: OralPresentation }
  | { kind: 'poster'; item: PosterPresentation };

// Oral and poster cards share one layout; the accent colour is what tells them apart at a glance.
const ACCENT = { oral: colors.primary[700], poster: colors.accent[500] } as const;

function MetaLine({ icon: Icon, text }: { icon: typeof Clock; text: string }) {
  return (
    <View style={styles.metaLine}>
      <Icon color={colors.text.faint} size={13} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

function PresentationCardView(props: Props) {
  const { item } = props;
  const accent = ACCENT[props.kind];
  const online = SESSION_COLORS.scientific;

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${item.code}. ${item.title}. ${item.author}, ${item.affiliation}`}
    >
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
      <View style={styles.body}>
        <View style={styles.chips}>
          <TypeChip label={item.code} bg={accent} textColor={colors.white} />
          {props.kind === 'poster' ? (
            <TypeChip label={item.day} bg={colors.primary[100]} textColor={colors.primary[700]} />
          ) : null}
          {props.kind === 'oral' && props.item.isOnline ? (
            <TypeChip label="Online" bg={online.bg} textColor={online.text} />
          ) : null}
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={[styles.author, { color: accent }]}>{item.author}</Text>
        {item.affiliation ? <Text style={styles.affiliation}>{item.affiliation}</Text> : null}
        {item.subject ? <Text style={styles.subject}>{subjectLabel(item.subject)}</Text> : null}

        <View style={styles.meta}>
          {props.kind === 'oral' ? (
            <>
              <MetaLine icon={Clock} text={`${props.item.slot} · ${item.time}`} />
              <MetaLine icon={MapPin} text={props.item.hall} />
            </>
          ) : (
            <MetaLine icon={Clock} text={item.time} />
          )}
          <MetaLine icon={Calendar} text={item.date} />
        </View>
      </View>
    </View>
  );
}

// 600+ cards live in one FlatList; memo keeps typing in the search box from re-rendering every row.
export const PresentationCard = memo(PresentationCardView);

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
  body: { flex: 1, gap: spacing.xs + 2, padding: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs + 2 },
  title: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark },
  author: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.sm },
  affiliation: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted },
  subject: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.xs, color: colors.text.faint },
  meta: {
    gap: 4,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surface[100],
  },
  metaLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  metaText: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.xs, color: colors.text.muted },
});
