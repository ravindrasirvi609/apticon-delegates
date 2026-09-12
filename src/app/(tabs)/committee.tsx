import { StyleSheet, Text, View } from 'react-native';

export default function CommitteeRoute() {
  return (
    <View style={styles.container}>
      <Text>Committee</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
