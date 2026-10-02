import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VENUE, TRANSPORT, HOTELS, CUISINE, RAIPUR_PLACES } from '@/data/venue';
import { useRemoteData } from '@/hooks/use-remote-data';
import { isValidVenueData } from '@/utils/remote-validators';
import type { VenueData } from '@/types/remote-content';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';
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
  const insets = useSafeAreaInsets();
  const { venue, transport, hotels, cuisine, raipurPlaces } = useRemoteData('venue.json', VENUE_FALLBACK, isValidVenueData);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: spacing.lg + insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Badge style={{ alignSelf: 'flex-start' }}>Venue & Travel</Badge>
        <Text style={styles.title}>{venue.name}</Text>
        <Text style={styles.address}>{venue.address}</Text>
      </View>

      <Card style={styles.venueCard}>
        {venue.features.map((feature) => (
          <Text key={feature} style={styles.feature}>• {feature}</Text>
        ))}
        <Pressable style={styles.mapsButton} onPress={() => openInMaps(venue.lat, venue.lng)}>
          <MapPin color={colors.white} size={16} />
          <Text style={styles.mapsButtonLabel}>Open in Google Maps</Text>
        </Pressable>
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
              <Text style={styles.hotelDistance}>{hotel.distance}</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface[50] },
  content: { padding: spacing.lg, paddingBottom: spacing['3xl'], gap: spacing.md },
  header: { gap: spacing.sm, marginBottom: spacing.sm },
  title: { fontFamily: fontFamily.display, fontSize: fontSize.xl, color: colors.text.dark },
  address: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted },
  venueCard: { gap: spacing.xs },
  feature: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary[700],
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  mapsButtonLabel: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.sm, color: colors.white },
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
  hotelMeta: { alignItems: 'flex-end' },
  hotelDistance: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.xs, color: colors.primary[700] },
  hotelStars: { fontFamily: fontFamily.sans, fontSize: 10, color: colors.text.muted },
  list: { gap: 0 },
  cuisineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cuisineCard: {
    flexBasis: '31%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surface[200],
    padding: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  cuisineIcon: { fontSize: 24 },
  cuisineName: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.xs, color: colors.text.dark },
  cuisineDesc: { fontFamily: fontFamily.sans, fontSize: 10, color: colors.text.muted, textAlign: 'center' },
});
