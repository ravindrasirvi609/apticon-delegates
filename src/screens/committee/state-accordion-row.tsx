import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { LayoutAnimation, Platform, StyleSheet, Text, UIManager, View } from 'react-native';
import type { RemoteStateBranch } from '@/types/remote-content';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';
import { ScalePressable } from '@/components/ui/pressable-scale';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { MemberCard } from './member-card';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export function StateAccordionRow({ branch, forceOpen }: { branch: RemoteStateBranch; forceOpen: boolean }) {
  const [manuallyOpen, setManuallyOpen] = useState(false);
  const isOpen = forceOpen || manuallyOpen;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!forceOpen) setManuallyOpen(false);
  }, [forceOpen]);

  function toggle() {
    if (!reducedMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setManuallyOpen((v) => !v);
  }

  return (
    <View style={styles.container}>
      <ScalePressable
        style={styles.header}
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={`${branch.state}, ${branch.members.length} members`}
      >
        {isOpen ? <ChevronDown color={colors.text.muted} size={16} /> : <ChevronRight color={colors.text.muted} size={16} />}
        <Text style={styles.stateName}>{branch.state}</Text>
        <View style={styles.countPill}>
          <Text style={styles.count}>{branch.members.length}</Text>
        </View>
      </ScalePressable>
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
  countPill: {
    backgroundColor: colors.surface[100],
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    minWidth: 28,
    alignItems: 'center',
  },
  count: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.xs, color: colors.text.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingVertical: spacing.md, paddingTop: spacing.xl },
});
