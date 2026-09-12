import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function QuickNavCard({ href, icon: Icon, label }: { href: Href; icon: LucideIcon; label: string }) {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.card}>
        <View style={styles.iconWrap}>
          <Icon color={colors.white} size={20} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
    padding: spacing.lg,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark },
});
