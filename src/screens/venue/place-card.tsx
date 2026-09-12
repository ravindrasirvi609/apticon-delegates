import { Image, StyleSheet, Text, View } from 'react-native';
import type { RaipurPlace } from '@/data/venue';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function PlaceCard({ place }: { place: RaipurPlace }) {
  return (
    <View style={styles.card}>
      <Image source={place.image} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <Text style={styles.name}>{place.icon} {place.name}</Text>
        <Text style={styles.description}>{place.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  image: { width: '100%', height: 160 },
  body: { padding: spacing.md, gap: spacing.xs },
  name: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark },
  description: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted, lineHeight: 20 },
});
