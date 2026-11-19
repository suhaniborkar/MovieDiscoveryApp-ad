
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import {
  getTrendingMovies,
  getPopularMovies,
  IMAGE_BASE_URL,
} from '../../services/tmdb';

export default function HomeScreen() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);

    const trendingData = await getTrendingMovies();
    const popularData = await getPopularMovies();

    setTrending(trendingData);
    setPopular(popularData);
    setLoading(false);
  };

  const renderMovie = ({ item }) => (
    <View style={styles.movieCard}>
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
    </View>
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
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>MOVIE DISCOVERY</Text>
        <Text style={styles.tagline}>
          Discover your next favourite movie.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#A855F7"
          style={styles.loader}
        />
      ) : (
        <>
          {renderSection('🔥 Trending This Week', trending)}
          {renderSection('🎬 Popular Movies', popular)}
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
    paddingBottom: 25,
  },
  appName: {
    color: '#A855F7',
    fontSize: 25,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tagline: {
    color: '#BBBBBB',
    fontSize: 14,
    marginTop: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  movieCard: {
    width: 145,
    marginLeft: 15,
  },
  poster: {
    width: 145,
    height: 215,
    borderRadius: 10,
    backgroundColor: '#252525',
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 9,
  },
  rating: {
    color: '#FACC15',
    fontSize: 13,
    marginTop: 5,
  },
  year: {
    color: '#999999',
    fontSize: 12,
    marginTop: 3,
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
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#777777',
    fontSize: 11,
  },
});
