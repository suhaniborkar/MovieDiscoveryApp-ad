
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
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setMovies([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const results = await searchMovies(query.trim());
      setMovies(results || []);
    } catch (error) {
      console.log('Search error:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const renderMovie = ({ item }) => (
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

      <Text style={styles.year}>
        {item.release_date
          ? item.release_date.substring(0, 4)
          : 'Release date unavailable'}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Find Your Movie</Text>

        <Text style={styles.subtitle}>
          Search thousands of movies and discover your next favourite.
        </Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Search for a movie..."
          placeholderTextColor="#888888"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSearch}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Searching...' : 'Search Movies'}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#8B1500"
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovie}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.results}
          columnWrapperStyle={styles.row}
          ListHeaderComponent={
            movies.length > 0 ? (
              <Text style={styles.resultHeading}>
                Search Results ({movies.length})
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              {searched
                ? 'No movies found. Try another search!'
                : '🍿 Search for your favourite movies!'}
            </Text>
          }
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
    paddingHorizontal: 18,
  },

  header: {
    marginBottom: 24,
  },

  heading: {
    color: '#8B1500',
    fontSize: 27,
    fontWeight: '900',
  },

  subtitle: {
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 21,
  },

  searchBox: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#383838',
    borderRadius: 12,
    marginBottom: 12,
  },

  input: {
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },

  button: {
    backgroundColor: '#8B1500',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  results: {
    paddingBottom: 30,
    flexGrow: 1,
  },

  row: {
    justifyContent: 'space-between',
  },

  resultHeading: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  movieCard: {
    width: '48%',
    marginBottom: 22,
  },

  poster: {
    width: '100%',
    height: 235,
    borderRadius: 12,
    backgroundColor: '#252525',
  },

  movieTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 9,
    minHeight: 36,
  },

  rating: {
    color: '#FACC15',
    marginTop: 5,
    fontSize: 13,
  },

  year: {
    color: '#999999',
    marginTop: 4,
    fontSize: 12,
  },

  loader: {
    marginTop: 50,
  },

  empty: {
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 55,
    fontSize: 15,
    lineHeight: 23,
  },
});
