import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LogOut } from 'lucide-react-native';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSession } from '@/hooks/use-session';
import { colors, spacing, textStyles } from '@/theme';

export function MeScreen() {
  const { session, signOut } = useSession();

  // Only reachable while logged in (the root layout guards it); this is just for the brief moment
  // while a logout is swapping the navigator back to the login screen.
  if (!session) return null;

  const { delegate } = session;
  return (
    <Screen>
      <StatusBar style="dark" />
      <ScreenHeader eyebrow="Delegate" title="My Profile" />
      <View style={styles.body}>
        <Card style={styles.profile}>
          <Avatar tint={colors.primary[700]} size={64} />
          <Text style={styles.name}>{delegate.name}</Text>
          {delegate.institution ? <Text style={styles.muted}>{delegate.institution}</Text> : null}
          <Badge>{delegate.registrationCode}</Badge>
        </Card>
        <Button variant="secondary" icon={LogOut} onPress={() => void signOut()}>
          Log out
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.lg },
  profile: { alignItems: 'center', gap: spacing.sm },
  name: { ...textStyles.h2, textAlign: 'center' },
  muted: { ...textStyles.bodyMuted, textAlign: 'center' },
});
