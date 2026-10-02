import { Mic } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from '@/components/ui/screen';
import { EmptyState } from '@/components/ui/empty-state';
import { spacing } from '@/theme';

export function SpeakersScreen() {
  return (
    <Screen style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <EmptyState
          icon={Mic}
          eyebrow="Distinguished Speakers"
          title="Speakers Being Announced"
          body="We are curating an outstanding lineup of pharmacy educators and industry leaders for APTICON 2026. Check back closer to the event for the full speaker list."
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: spacing['2xl'] },
});
