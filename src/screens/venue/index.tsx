import { Linking, StyleSheet, Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { VENUE, TRANSPORT, HOTELS, CUISINE, RAIPUR_PLACES } from '@/data/venue';
import { useRemoteData } from '@/hooks/use-remote-data';
import { isValidVenueData } from '@/utils/remote-validators';
import type { VenueData } from '@/types/remote-content';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
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
  const { venue, transport, hotels, cuisine, raipurPlaces } = useRemoteData('venue.json', VENUE_FALLBACK, isValidVenueData);

  return (
    <Screen scroll contentStyle={styles.content}>
      <StatusBar style="dark" />
      <ScreenHeader eyebrow="Venue & Travel" title={venue.name} subtitle={venue.address} />

      <Card style={styles.venueCard}>
        {venue.features.map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <View style={styles.featureDot} />
            <Text style={styles.feature}>{feature}</Text>
          </View>
        ))}
        <Button icon={MapPin} onPress={() => openInMaps(venue.lat, venue.lng)}>
          Open in Google Maps
        </Button>
      </Card>

      <Text style={styles.sectionTitle}>Nearby Hotels</Text>
      <Card>
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

      <Divider />

      <Text style={styles.sectionTitle}>How to Reach Raipur</Text>
      <View style={styles.list}>
        {transport.map((option) => (
          <TransportCard key={option.label} option={option} />
        ))}
      </View>

      <Divider />

      <Text style={styles.sectionTitle}>Explore Raipur & Chhattisgarh</Text>
      <View style={styles.list}>
        {raipurPlaces.map((place) => (
          <PlaceCard key={place.name} place={place} />
        ))}
      </View>

      <Divider />

      <Text style={styles.sectionTitle}>Taste of Chhattisgarh</Text>
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
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing['3xl'], gap: spacing.md },
  venueCard: { gap: spacing.sm, marginTop: spacing.lg },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent[500] },
  feature: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted, flex: 1 },
  sectionTitle: { fontFamily: fontFamily.sansBold, fontSize: fontSize.base, color: colors.text.dark, marginTop: spacing.sm },
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
