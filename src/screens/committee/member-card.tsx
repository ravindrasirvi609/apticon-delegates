import { StyleSheet, Text, View } from 'react-native';
import type { RemoteCommitteeMember } from '@/types/remote-content';
import { GradientBanner } from '@/components/ui/gradient-banner';
import { Avatar } from '@/components/ui/avatar';
import { colors, elevation, fontFamily, fontSize, radius, spacing } from '@/theme';

const AVATAR_SIZE = 64;

export function MemberCard({ member, gradient }: { member: RemoteCommitteeMember; gradient: [string, string] }) {
  return (
    <View style={styles.card}>
      <GradientBanner colors={gradient} height={48} />
      <View style={styles.avatarWrap}>
        <Avatar image={member.image} tint={gradient[0]} size={AVATAR_SIZE} />
      </View>
      <View style={styles.body}>
        {member.role ? (
          <View style={styles.roleTag}>
            <Text style={styles.role}>{member.role}</Text>
          </View>
        ) : null}
        <Text style={styles.name}>{member.name}</Text>
        {member.designation ? <Text style={styles.meta}>{member.designation}</Text> : null}
        {member.institution ? (
          <Text style={styles.meta} numberOfLines={2}>{member.institution}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: spacing.md,
    ...elevation.sm,
  },
  avatarWrap: { marginTop: -AVATAR_SIZE / 2, marginBottom: spacing.sm },
  body: { alignItems: 'center', paddingHorizontal: spacing.sm, gap: 4 },
  roleTag: {
    backgroundColor: colors.accent[100],
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginBottom: 2,
  },
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
