import { useState } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { User } from 'lucide-react-native';
import { colors } from '@/theme';
import type { RemoteImage } from '@/types/remote-content';

/**
 * Image-with-fallback avatar, extracted from MemberCard so the same
 * "show image, fall back to a User icon on a brand-colored circle if
 * there's no image or it fails to load" logic is reusable/testable on its
 * own.
 */
export function Avatar({
  image,
  tint,
  size = 64,
}: {
  image?: RemoteImage;
  tint: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const source: ImageSourcePropType | undefined =
    typeof image === 'string' ? { uri: image } : image;

  const dimensionStyle = { width: size, height: size, borderRadius: size / 2 };

  if (!source || failed) {
    return (
      <View style={[styles.avatar, dimensionStyle, styles.fallback, { backgroundColor: tint }]}>
        <User color={colors.white} size={Math.round(size * 0.34)} />
      </View>
    );
  }

  return (
    <Image source={source} style={[styles.avatar, dimensionStyle]} onError={() => setFailed(true)} />
  );
}

const styles = StyleSheet.create({
  avatar: { borderWidth: 3, borderColor: colors.white },
  fallback: { alignItems: 'center', justifyContent: 'center' },
});
