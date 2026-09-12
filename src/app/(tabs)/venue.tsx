import { StyleSheet, Text, View } from 'react-native';

export default function VenueRoute() {
  return (
    <View style={styles.container}>
      <Text>Venue</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
