
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import { searchMovies, IMAGE_BASE_URL } from '../../services/tmdb';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    setLoading(true);
    const results = await searchMovies(query.trim());
    setMovies(results);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search Movies</Text>

      <TextInput
        style={styles.input}
        placeholder="Search for a movie..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#A855F7" />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.results}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Search for your favourite movies!
            </Text>
          }
          
        renderItem={({ item }) => (
           <Pressable
           style={styles.movieCard}
         onPress={() => router.push(`/movie/${item.id}`)}
         >
         <Image
         source={{
         uri: item.poster_path
          ? `${IMAGE_BASE_URL}${item.poster_path}`
          : 'https://placehold.co/300x450/222222/FFFFFF?text=No+Poster',
         }}
          style={styles.poster}
         />

         <Text style={styles.movieTitle} numberOfLines={2}>
         {item.title}
          </Text>

         <Text style={styles.rating}>
         ⭐ {item.vote_average?.toFixed(1) || 'N/A'}
         </Text>
         </Pressable>
    )}

        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    paddingTop: 55,
    paddingHorizontal: 16,
  },
  heading: {
    color: '#A855F7',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#252525',
    color: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#A855F7',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  results: {
    paddingBottom: 25,
  },
  movieCard: {
    flex: 1,
    margin: 7,
    maxWidth: '48%',
  },
  poster: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    backgroundColor: '#252525',
  },
  movieTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 8,
  },
  rating: {
    color: '#FACC15',
    marginTop: 4,
  },
  empty: {
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 50,
  },
});
