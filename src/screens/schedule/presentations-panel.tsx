import { useMemo, useState, type ReactNode } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { PRESENTATIONS, type OralPresentation, type PosterPresentation } from '@/data/presentations';
import { useRemoteData } from '@/hooks/use-remote-data';
import { isValidPresentationsData } from '@/utils/remote-validators';
import {
  ALL,
  filterOral,
  filterPoster,
  subjectLabel,
  uniqueInOrder,
} from '@/utils/presentation-filter';
import type { PresentationsData } from '@/types/remote-content';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/screens/committee/search-bar';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { FilterChips, type ChipOption } from './filter-chips';
import { PresentationCard } from './presentation-card';

export type PresentationKind = 'oral' | 'poster';

const FALLBACK: PresentationsData = PRESENTATIONS;
const ALL_OPTION: ChipOption = { key: ALL, label: 'All' };

/**
 * The Oral / Poster schedule. Fetches remote-data/presentations.json once while mounted — switching
 * between oral and poster keeps this component (and its data) mounted, so it doesn't re-download.
 */
export function PresentationsPanel({ kind }: { kind: PresentationKind }) {
  const data = useRemoteData('presentations.json', FALLBACK, isValidPresentationsData);
  return kind === 'oral' ? <OralList items={data.oral} /> : <PosterList items={data.poster} />;
}

// "24 Oct 2026" -> "24 Oct": chips are tight on space and the year never changes.
const shortDate = (date: string) => date.replace(/\s+\d{4}$/, '');

function subjectOptions(subjects: string[]): ChipOption[] {
  const sorted = uniqueInOrder(subjects).sort((a, b) => subjectLabel(a).localeCompare(subjectLabel(b)));
  return [ALL_OPTION, ...sorted.map((subject) => ({ key: subject, label: subjectLabel(subject) }))];
}

function OralList({ items }: { items: OralPresentation[] }) {
  const [query, setQuery] = useState('');
  const [slot, setSlot] = useState(ALL);
  const [hall, setHall] = useState(ALL);
  const [subject, setSubject] = useState(ALL);

  const slotOptions = useMemo<ChipOption[]>(
    () => [
      ALL_OPTION,
      ...uniqueInOrder(items.map((p) => p.slot)).map((s) => ({
        key: s,
        label: `${s} · ${shortDate(items.find((p) => p.slot === s)?.date ?? '')}`,
      })),
    ],
    [items],
  );
  const hallOptions = useMemo<ChipOption[]>(
    () => [
      ALL_OPTION,
      ...uniqueInOrder(items.map((p) => p.hall))
        .sort()
        .map((h) => ({ key: h, label: h.replace(/^Oral\s+/i, '') })),
    ],
    [items],
  );
  const subjects = useMemo(() => subjectOptions(items.map((p) => p.subject)), [items]);
  const visible = useMemo(
    () => filterOral(items, { query, slot, hall, subject }),
    [items, query, slot, hall, subject],
  );

  return (
    <ListShell
      data={visible}
      total={items.length}
      noun="oral presentations"
      query={query}
      onQuery={setQuery}
      searchPlaceholder="Search by code, presenter, title or institution..."
      renderItem={(item) => <PresentationCard kind="oral" item={item} />}
      filters={
        <>
          <FilterChips label="Slot" options={slotOptions} active={slot} onChange={setSlot} />
          <FilterChips label="Hall" options={hallOptions} active={hall} onChange={setHall} />
          <FilterChips label="Subject" options={subjects} active={subject} onChange={setSubject} />
        </>
      }
    />
  );
}

function PosterList({ items }: { items: PosterPresentation[] }) {
  const [query, setQuery] = useState('');
  const [day, setDay] = useState(ALL);
  const [subject, setSubject] = useState(ALL);

  const dayOptions = useMemo<ChipOption[]>(
    () => [
      ALL_OPTION,
      ...uniqueInOrder(items.map((p) => p.day)).map((d) => ({
        key: d,
        label: `${d} · ${shortDate(items.find((p) => p.day === d)?.date ?? '')}`,
      })),
    ],
    [items],
  );
  const subjects = useMemo(() => subjectOptions(items.map((p) => p.subject)), [items]);
  const visible = useMemo(() => filterPoster(items, { query, day, subject }), [items, query, day, subject]);

  return (
    <ListShell
      data={visible}
      total={items.length}
      noun="poster presentations"
      query={query}
      onQuery={setQuery}
      searchPlaceholder="Search by code, presenter, title or institution..."
      renderItem={(item) => <PresentationCard kind="poster" item={item} />}
      filters={
        <>
          <FilterChips label="Day" options={dayOptions} active={day} onChange={setDay} />
          <FilterChips label="Subject" options={subjects} active={subject} onChange={setSubject} />
        </>
      }
    />
  );
}

function ListShell<T extends { code: string }>({
  data,
  total,
  noun,
  query,
  onQuery,
  searchPlaceholder,
  renderItem,
  filters,
}: {
  data: T[];
  total: number;
  noun: string;
  query: string;
  onQuery: (text: string) => void;
  searchPlaceholder: string;
  renderItem: (item: T) => ReactNode;
  filters: ReactNode;
}) {
  return (
    <View style={styles.flex}>
      <SearchBar
        value={query}
        onChange={onQuery}
        placeholder={searchPlaceholder}
        accessibilityLabel={`Search ${noun}`}
      />
      <FlatList
        data={data}
        // Codes repeat in the source (different people sharing one poster number), so the index is part of the key.
        keyExtractor={(item, index) => `${item.code}-${index}`}
        renderItem={({ item }) => <>{renderItem(item)}</>}
        ListHeaderComponent={
          <View>
            {filters}
            <Text style={styles.count} accessibilityLiveRegion="polite">
              Showing {data.length} of {total} {noun}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <EmptyState
              icon={Search}
              title="No matches found"
              body={`No ${noun} match your search. Try a different name, code or filter.`}
            />
          </View>
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={9}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  listContent: { paddingBottom: spacing['3xl'] },
  count: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.xs,
    color: colors.text.muted,
  },
  empty: { marginTop: spacing.xl, paddingHorizontal: spacing.xl },
});
