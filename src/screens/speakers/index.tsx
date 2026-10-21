import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search } from 'lucide-react-native';
import { SPEAKERS } from '@/data/speakers';
import { useRemoteData } from '@/hooks/use-remote-data';
import { isValidSpeakersData } from '@/utils/remote-validators';
import { filterSpeakers, SPEAKER_FILTERS, type SpeakerFilterKey } from '@/utils/speaker-filter';
import type { SpeakersData } from '@/types/remote-content';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/screens/committee/search-bar';
import { DayToggle } from '@/screens/schedule/day-toggle';
import { spacing } from '@/theme';
import { SpeakerCard } from './speaker-card';

const SPEAKERS_FALLBACK: SpeakersData = { speakers: SPEAKERS };

export function SpeakersScreen() {
  const [filter, setFilter] = useState<SpeakerFilterKey>('all');
  const [query, setQuery] = useState('');
  const { speakers } = useRemoteData('speakers.json', SPEAKERS_FALLBACK, isValidSpeakersData);

  const visible = useMemo(() => filterSpeakers(speakers, filter, query), [speakers, filter, query]);

  return (
    <Screen>
      <StatusBar style="dark" />
      <ScreenHeader
        eyebrow="Distinguished Speakers"
        title="Speakers & Chairs"
        subtitle="Lecturers, panelists and session chairs of APTICON 2026."
      />
      <DayToggle
        options={SPEAKER_FILTERS.map(({ key, label }) => ({ key, label }))}
        active={filter}
        onChange={(key) => setFilter(key as SpeakerFilterKey)}
      />
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search by name, institution or session..."
        accessibilityLabel="Search speakers"
      />
      <FlatList
        data={visible}
        keyExtractor={(speaker) => speaker.name}
        renderItem={({ item }) => <SpeakerCard speaker={item} />}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <EmptyState
              icon={Search}
              title="No matches found"
              body="No speakers match your search. Try a different name, institution, or session."
            />
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: spacing['3xl'] },
  empty: { marginTop: spacing.xl, paddingHorizontal: spacing.xl },
});
