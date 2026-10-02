import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { RemoteRaipurPlace } from '@/types/remote-content';
import { colors, elevation, fontFamily, fontSize, radius, spacing } from '@/theme';

export function PlaceCard({ place }: { place: RemoteRaipurPlace }) {
  const imageSource = typeof place.image === 'string' ? { uri: place.image } : place.image;
  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        <LinearGradient colors={['transparent', colors.overlay]} style={styles.caption}>
          <Text style={styles.name}>{place.icon} {place.name}</Text>
        </LinearGradient>
      </View>
      <Text style={styles.description}>{place.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...elevation.sm,
  },
  imageWrap: { width: '100%', height: 160 },
  image: { width: '100%', height: '100%' },
  caption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.sm,
  },
  name: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.white },
  description: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted, lineHeight: 20, padding: spacing.md },
});
