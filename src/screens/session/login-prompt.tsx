import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LogIn, type LucideIcon } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { spacing } from '@/theme';

/** Shown in the Questions / Feedback tabs to guests. */
export function LoginPrompt({ icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <EmptyState icon={icon} title={title} body={body} />
      <Button icon={LogIn} onPress={() => router.push('/login')}>
        Log in
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.xl, paddingVertical: spacing['2xl'] },
});
