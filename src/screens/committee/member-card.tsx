import { Image, StyleSheet, Text, View } from 'react-native';
import { User } from 'lucide-react-native';
import type { CommitteeMember } from '@/data/committee';
import { GradientBanner } from '@/components/ui/gradient-banner';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function MemberCard({ member, gradient }: { member: CommitteeMember; gradient: [string, string] }) {
  return (
    <View style={styles.card}>
      <GradientBanner colors={gradient} height={48} />
      <View style={styles.avatarWrap}>
        {member.image ? (
          <Image source={member.image} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: gradient[0] }]}>
            <User color={colors.white} size={22} />
          </View>
        )}
      </View>
      <View style={styles.body}>
        {member.role ? <Text style={styles.role}>{member.role}</Text> : null}
        <Text style={styles.name}>{member.name}</Text>
        {member.designation ? <Text style={styles.meta}>{member.designation}</Text> : null}
        {member.institution ? (
          <Text style={styles.meta} numberOfLines={2}>{member.institution}</Text>
        ) : null}
      </View>
    </View>
  );
}

const AVATAR_SIZE = 64;

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  avatarWrap: { marginTop: -AVATAR_SIZE / 2, marginBottom: spacing.sm },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  body: { alignItems: 'center', paddingHorizontal: spacing.sm, gap: 2 },
  role: {
    fontFamily: fontFamily.sansBold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.accent[500],
  },
  name: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.sm, color: colors.text.dark, textAlign: 'center' },
  meta: { fontFamily: fontFamily.sans, fontSize: fontSize.xs, color: colors.text.muted, textAlign: 'center' },
});
