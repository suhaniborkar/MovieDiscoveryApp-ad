
import { View, Text, StyleSheet } from 'react-native';

export default function WatchlistScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Watchlist</Text>
      <Text style={styles.subtitle}>Your saved movies will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#A855F7',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#FFFFFF',
    marginTop: 12,
  },
});
