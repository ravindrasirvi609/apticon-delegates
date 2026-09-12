import { StyleSheet, Text, View } from 'react-native';

export default function SpeakersRoute() {
  return (
    <View style={styles.container}>
      <Text>Speakers</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
