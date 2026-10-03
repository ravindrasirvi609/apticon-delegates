import { Linking, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Building2, Hotel, MapPin, Navigation, Utensils } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { VENUE, TRANSPORT, HOTELS, CUISINE, RAIPUR_PLACES } from '@/data/venue';
import { useRemoteData } from '@/hooks/use-remote-data';
import { isValidVenueData } from '@/utils/remote-validators';
import type { VenueData } from '@/types/remote-content';
import { Screen } from '@/components/ui/screen';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { colors, elevation, fontFamily, fontSize, radius, spacing } from '@/theme';
import { TransportCard } from './transport-card';
import { PlaceCard } from './place-card';

const VENUE_FALLBACK: VenueData = {
  venue: VENUE,
  transport: TRANSPORT,
  hotels: HOTELS,
  cuisine: CUISINE,
  raipurPlaces: RAIPUR_PLACES,
};

function openInMaps(lat: number, lng: number) {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  Linking.openURL(url);
}

export function VenueScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const { venue, transport, hotels, cuisine, raipurPlaces } = useRemoteData('venue.json', VENUE_FALLBACK, isValidVenueData);

  return (
    <Screen scroll contentStyle={styles.content}>
      <StatusBar style="dark" />
      <View style={styles.hero}>
        <View style={styles.heroIcon}><Building2 color={colors.white} size={24} /></View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroEyebrow}>EVENT VENUE</Text>
          <Text style={styles.heroTitle}>{venue.name}</Text>
          <Text style={styles.heroAddress}>{venue.address}</Text>
        </View>
        <Button icon={Navigation} onPress={() => openInMaps(venue.lat, venue.lng)}>Directions</Button>
      </View>

      <View style={styles.featureGrid}>
        {venue.features.map((feature) => (
          <View key={feature} style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.feature}>{feature}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeading}><Hotel color={colors.primary[700]} size={18} /><Text style={styles.sectionTitle}>Nearby hotels</Text></View>
      <Card style={styles.hotelCard}>
        {hotels.map((hotel) => (
          <View key={hotel.name} style={styles.hotelRow}>
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <Text style={styles.hotelArea}>{hotel.area}</Text>
            </View>
            <View style={styles.hotelMeta}>
              <View style={styles.distancePill}>
                <Text style={styles.hotelDistance}>{hotel.distance}</Text>
              </View>
              <Text style={styles.hotelStars}>{'★'.repeat(hotel.stars)}</Text>
            </View>
          </View>
        ))}
      </Card>

      <View style={styles.sectionHeading}><Navigation color={colors.primary[700]} size={18} /><Text style={styles.sectionTitle}>How to reach Raipur</Text></View>
      <View style={[styles.list, isWide && styles.gridWide]}>
        {transport.map((option) => (
          <TransportCard key={option.label} option={option} />
        ))}
      </View>

      <View style={styles.sectionHeading}><MapPin color={colors.primary[700]} size={18} /><Text style={styles.sectionTitle}>Explore Raipur & Chhattisgarh</Text></View>
      <View style={[styles.list, isWide && styles.gridWide]}>
        {raipurPlaces.map((place) => (
          <PlaceCard key={place.name} place={place} />
        ))}
      </View>

      <View style={styles.sectionHeading}><Utensils color={colors.primary[700]} size={18} /><Text style={styles.sectionTitle}>Taste of Chhattisgarh</Text></View>
      <View style={styles.cuisineGrid}>
        {cuisine.map((item) => (
          <View key={item.name} style={styles.cuisineCard}>
            <Text style={styles.cuisineIcon}>{item.icon}</Text>
            <Text style={styles.cuisineName}>{item.name}</Text>
            <Text style={styles.cuisineDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing['3xl'], gap: spacing.lg, maxWidth: 1180, width: '100%', alignSelf: 'center' },
  hero: { backgroundColor: colors.primary[950], borderRadius: radius.xl, padding: spacing.xl, gap: spacing.lg, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: spacing.lg },
  heroIcon: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.accent[500], alignItems: 'center', justifyContent: 'center' },
  heroCopy: { flex: 1, minWidth: 220, gap: spacing.xs },
  heroEyebrow: { fontFamily: fontFamily.sansBold, fontSize: fontSize.xs, letterSpacing: 1.2, color: colors.accent[300] },
  heroTitle: { fontFamily: fontFamily.display, fontSize: fontSize.xl, lineHeight: 29, color: colors.white },
  heroAddress: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.surface[300] },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingHorizontal: spacing.xs },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexGrow: 1, flexBasis: '30%', minWidth: 160 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  hotelCard: { paddingVertical: spacing.sm },
  featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent[500] },
  feature: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted, flex: 1 },
  sectionTitle: { fontFamily: fontFamily.sansBold, fontSize: fontSize.lg, color: colors.text.dark },
  hotelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[200],
  },
  hotelInfo: { flex: 1 },
  hotelName: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.sm, color: colors.text.dark },
  hotelArea: { fontFamily: fontFamily.sans, fontSize: fontSize.xs, color: colors.text.muted },
  hotelMeta: { alignItems: 'flex-end', gap: 2 },
  distancePill: {
    backgroundColor: colors.primary[100],
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
  },
  hotelDistance: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.xs, color: colors.primary[700] },
  hotelStars: { fontFamily: fontFamily.sans, fontSize: 10, color: colors.text.muted },
  list: { gap: 0 },
  gridWide: { flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.md },
  cuisineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cuisineCard: {
    flexBasis: '31%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 2,
    ...elevation.sm,
  },
  cuisineIcon: { fontSize: 24 },
  cuisineName: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.xs, color: colors.text.dark },
  cuisineDesc: { fontFamily: fontFamily.sans, fontSize: 10, color: colors.text.muted, textAlign: 'center' },
});
