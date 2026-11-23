
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
} from 'react-native';

import { useRouter } from 'expo-router';

import {
  getTrendingMovies,
  getPopularMovies,
  IMAGE_BASE_URL,
} from '../../services/tmdb';

export default function HomeScreen() {
  const router = useRouter();

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);

      const [trendingData, popularData] = await Promise.all([
        getTrendingMovies(),
        getPopularMovies(),
      ]);

      setTrending(trendingData || []);
      setPopular(popularData || []);
    } catch (error) {
      console.log('Error loading movies:', error);
      setTrending([]);
      setPopular([]);
    } finally {
      setLoading(false);
    }
  };

  const openMovie = (movieId) => {
    router.push(`/movie/${movieId}`);
  };

  const renderMovie = ({ item }) => (
    <Pressable
      style={styles.movieCard}
      onPress={() => openMovie(item.id)}
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

  const renderSection = (title, movies) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.movieList}
      />
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.appName}>THE POPCORN PROJECT</Text>

        <Text style={styles.tagline}>
          Discover your next favourite movie.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#8B1500"
          style={styles.loader}
        />
      ) : (
        <>
          {trending.length > 0 &&
            renderSection('🔥 Trending This Week', trending)}

          {popular.length > 0 &&
            renderSection('🎬 Popular Movies', popular)}
        </>
      )}

      {!loading && trending.length === 0 && popular.length === 0 && (
        <Text style={styles.errorText}>
          Unable to load movies. Please check your internet connection
          and TMDB API key.
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Movie information provided by TMDB.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  appName: {
    color: '#8B1500',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  tagline: {
    color: '#BBBBBB',
    fontSize: 14,
    marginTop: 9,
  },

  section: {
    marginBottom: 32,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 17,
  },

  movieList: {
    paddingRight: 15,
  },

  movieCard: {
    width: 155,
    marginLeft: 15,
  },

  poster: {
    width: 155,
    height: 230,
    borderRadius: 12,
    backgroundColor: '#252525',
  },

  movieTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    minHeight: 38,
  },

  rating: {
    color: '#FACC15',
    fontSize: 14,
    marginTop: 5,
  },

  year: {
    color: '#999999',
    fontSize: 13,
    marginTop: 4,
  },

  loader: {
    marginTop: 100,
  },

  errorText: {
    color: '#FF7777',
    textAlign: 'center',
    margin: 25,
  },

  footer: {
    padding: 22,
    alignItems: 'center',
  },

  footerText: {
    color: '#777777',
    fontSize: 11,
  },
});
