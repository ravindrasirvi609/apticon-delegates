import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search } from 'lucide-react-native';
import { PINNED_GROUPS, STATE_BRANCHES } from '@/data/committee';
import { memberMatches, filterStateBranches } from '@/utils/committee-search';
import { useRemoteData } from '@/hooks/use-remote-data';
import { isValidCommitteeData } from '@/utils/remote-validators';
import type { CommitteeData } from '@/types/remote-content';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { EmptyState } from '@/components/ui/empty-state';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { SearchBar } from './search-bar';
import { MemberCard } from './member-card';
import { StateAccordionRow } from './state-accordion-row';

const COMMITTEE_FALLBACK: CommitteeData = { pinnedGroups: PINNED_GROUPS, stateBranches: STATE_BRANCHES };

export function CommitteeScreen() {
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();
  const { pinnedGroups, stateBranches } = useRemoteData('committee.json', COMMITTEE_FALLBACK, isValidCommitteeData);

  const filteredGroups = useMemo(
    () =>
      pinnedGroups
        .map((group) => ({
          ...group,
          members: group.members.filter((m) => memberMatches(m, trimmedQuery)),
        }))
        .filter((group) => group.members.length > 0),
    [pinnedGroups, trimmedQuery]
  );

  const filteredBranches = useMemo(
    () => filterStateBranches(stateBranches, trimmedQuery),
    [stateBranches, trimmedQuery]
  );

  const hasAnyResults = filteredGroups.length > 0 || filteredBranches.length > 0;

  return (
    <Screen>
      <StatusBar style="dark" />
      <ScreenHeader eyebrow="Committee" title="Organizing Committee" />
      <View style={styles.searchSpacer} />
      <SearchBar value={query} onChange={setQuery} />
      <FlatList
        data={filteredBranches}
        keyExtractor={(branch) => branch.state}
        ListHeaderComponent={
          <View>
            {filteredGroups.map((group) => (
              <View key={group.key} style={styles.pinnedGroup}>
                <Text style={styles.groupTitle}>{group.title}</Text>
                <View style={styles.grid}>
                  {group.members.map((member, index) => (
                    <MemberCard key={`${group.key}-${index}`} member={member} gradient={group.gradient} />
                  ))}
                </View>
              </View>
            ))}
            {filteredBranches.length > 0 ? <Text style={styles.groupTitle}>State APTI Branches</Text> : null}
          </View>
        }
        renderItem={({ item }) => <StateAccordionRow branch={item} forceOpen={trimmedQuery.length >= 2} />}
        ListEmptyComponent={
          trimmedQuery && !hasAnyResults ? (
            <View style={styles.empty}>
              <EmptyState
                icon={Search}
                title="No matches found"
                body={`No committee members match "${trimmedQuery}". Try a different name, state, or institution.`}
              />
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchSpacer: { height: spacing.md },
  listContent: { paddingBottom: spacing['3xl'] },
  pinnedGroup: { marginBottom: spacing.xl },
  groupTitle: {
    fontFamily: fontFamily.sansBold,
    fontSize: fontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.text.muted,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  empty: { marginTop: spacing.xl, paddingHorizontal: spacing.xl },
});
