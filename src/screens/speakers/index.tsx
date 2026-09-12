import { Mic } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Badge } from '@/components/ui/badge';
import { colors, fontFamily, fontSize, spacing } from '@/theme';

export function SpeakersScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.iconWrap}>
        <Mic color={colors.primary[700]} size={40} />
      </View>
      <Badge>Distinguished Speakers</Badge>
      <Text style={styles.title}>Speakers Being Announced</Text>
      <Text style={styles.body}>
        We are curating an outstanding lineup of pharmacy educators and industry
        leaders for APTICON 2026. Check back closer to the event for the full
        speaker list.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface[50],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
    gap: spacing.md,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[700] + '1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontFamily: fontFamily.display, fontSize: fontSize.xl, color: colors.text.dark, textAlign: 'center' },
  body: { fontFamily: fontFamily.sans, fontSize: fontSize.base, color: colors.text.muted, textAlign: 'center', lineHeight: 22 },
});
