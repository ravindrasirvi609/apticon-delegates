import { StyleSheet, Text, View } from 'react-native';

export default function Placeholder() {
  return (
    <View style={styles.container}>
      <Text>APTICON 2026</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
