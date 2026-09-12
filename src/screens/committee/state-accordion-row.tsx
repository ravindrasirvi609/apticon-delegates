import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StateBranch } from '@/data/committee';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { MemberCard } from './member-card';

export function StateAccordionRow({ branch, forceOpen }: { branch: StateBranch; forceOpen: boolean }) {
  const [manuallyOpen, setManuallyOpen] = useState(false);
  const isOpen = forceOpen || manuallyOpen;

  useEffect(() => {
    if (!forceOpen) setManuallyOpen(false);
  }, [forceOpen]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={() => setManuallyOpen((v) => !v)}>
        {isOpen ? <ChevronDown color={colors.text.muted} size={16} /> : <ChevronRight color={colors.text.muted} size={16} />}
        <Text style={styles.stateName}>{branch.state}</Text>
        <Text style={styles.count}>{branch.members.length}</Text>
      </Pressable>
      {isOpen ? (
        <View style={styles.grid}>
          {branch.members.map((member, index) => (
            <MemberCard key={`${branch.state}-${index}`} member={member} gradient={['#1E293B', '#0F172A']} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: spacing.lg, marginBottom: spacing.sm },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[200],
  },
  stateName: { flex: 1, fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark },
  count: { fontFamily: fontFamily.sans, fontSize: fontSize.xs, color: colors.text.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingVertical: spacing.md, paddingTop: spacing.xl },
});
