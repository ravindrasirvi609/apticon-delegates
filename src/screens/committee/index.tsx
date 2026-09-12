import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { PINNED_GROUPS, STATE_BRANCHES } from '@/data/committee';
import { memberMatches, filterStateBranches } from '@/utils/committee-search';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { SearchBar } from './search-bar';
import { MemberCard } from './member-card';
import { StateAccordionRow } from './state-accordion-row';

export function CommitteeScreen() {
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();

  const filteredGroups = useMemo(
    () =>
      PINNED_GROUPS.map((group) => ({
        ...group,
        members: group.members.filter((m) => memberMatches(m, trimmedQuery)),
      })).filter((group) => group.members.length > 0),
    [trimmedQuery]
  );

  const filteredBranches = useMemo(
    () => filterStateBranches(STATE_BRANCHES, trimmedQuery),
    [trimmedQuery]
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Organizing Committee</Text>
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
            <Text style={styles.groupTitle}>State APTI Branches</Text>
          </View>
        }
        renderItem={({ item }) => <StateAccordionRow branch={item} forceOpen={trimmedQuery.length > 0} />}
        ListEmptyComponent={
          trimmedQuery && filteredGroups.length === 0 ? (
            <Text style={styles.empty}>No committee members match "{trimmedQuery}".</Text>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface[50] },
  title: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.xl,
    color: colors.text.dark,
    marginHorizontal: spacing.lg,
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
  },
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
  empty: { textAlign: 'center', fontFamily: fontFamily.sans, fontSize: fontSize.base, color: colors.text.muted, marginTop: spacing.xl },
});
