import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogIn, LogOut, UserRound } from 'lucide-react-native';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSession } from '@/hooks/use-session';
import { colors, spacing, textStyles } from '@/theme';

export function MeScreen() {
  const router = useRouter();
  const { session, signOut } = useSession();

  if (!session) {
    return (
      <Screen style={styles.guest}>
        <StatusBar style="dark" />
        <View style={styles.guestContent}>
          <EmptyState
            icon={UserRound}
            eyebrow="Delegate"
            title="Log in to take part"
            body="Sign in with your registration QR and email to ask questions and share feedback on sessions."
          />
          <Button icon={LogIn} onPress={() => router.push('/login')}>
            Log in
          </Button>
        </View>
      </Screen>
    );
  }

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
  guest: { alignItems: 'center', justifyContent: 'center' },
  guestContent: { paddingHorizontal: spacing['2xl'], gap: spacing.xl, alignItems: 'center' },
  body: { padding: spacing.lg, gap: spacing.lg },
  profile: { alignItems: 'center', gap: spacing.sm },
  name: { ...textStyles.h2, textAlign: 'center' },
  muted: { ...textStyles.bodyMuted, textAlign: 'center' },
});
