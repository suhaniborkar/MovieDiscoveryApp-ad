
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { auth } from '../../services/firebase';
import {
  getWatchlist,
  removeFromWatchlist,
} from '../../services/watchlist';
import { IMAGE_BASE_URL } from '../../services/tmdb';
import { useRouter, useFocusEffect } from 'expo-router';

export default function WatchlistScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadWatchlist = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setMovies([]);
        return;
      }

      const savedMovies = await getWatchlist(user.uid);
      setMovies(savedMovies || []);
    } catch (error) {
      Alert.alert('Error', 'Could not load your watchlist.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWatchlist();
    }, [])
  );

  const handleRemove = async (movieId) => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      await removeFromWatchlist(user.uid, movieId);

      setMovies((currentMovies) =>
        currentMovies.filter(
          (movie) => String(movie.id) !== String(movieId)
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Could not remove this movie.');
    }
  };

  const renderMovie = ({ item }) => (
    <View style={styles.movieCard}>
      <Pressable
        onPress={() => router.push(`/movie/${item.id}`)}
        style={styles.movieInfo}
      >
        {item.poster_path ? (
          <Image
            source={{
              uri: `${IMAGE_BASE_URL}${item.poster_path}`,
            }}
            style={styles.poster}
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.placeholderText}>No Poster</Text>
          </View>
        )}

        <View style={styles.details}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.rating}>
            ⭐ {item.vote_average?.toFixed(1) || 'N/A'}
          </Text>

          <Text style={styles.date}>
            {item.release_date
              ? item.release_date.substring(0, 4)
              : 'Release date unavailable'}
          </Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.removeButton}
        onPress={() => handleRemove(item.id)}
      >
        <Text style={styles.removeText}>✕  Remove from Watchlist</Text>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8B1500" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Watchlist</Text>

        <Text style={styles.subtitle}>
          Your saved movies, all in one place 🍿
        </Text>

        <Text style={styles.movieCount}>
          {movies.length} {movies.length === 1 ? 'MOVIE' : 'MOVIES SAVED'}
        </Text>
      </View>

      {movies.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>🍿</Text>

          <Text style={styles.emptyText}>
            Your watchlist is empty.
          </Text>

          <Text style={styles.emptySubtext}>
            Find movies you love and save them here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMovie}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    paddingHorizontal: 18,
    paddingTop: 55,
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
  },

  movieCount: {
    color: '#BBBBBB',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginTop: 18,
  },

  list: {
    paddingBottom: 25,
  },

  movieCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
    padding: 13,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#303030',
  },

  movieInfo: {
    flexDirection: 'row',
  },

  poster: {
    width: 95,
    height: 135,
    borderRadius: 10,
    backgroundColor: '#252525',
  },

  posterPlaceholder: {
    width: 95,
    height: 135,
    borderRadius: 10,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    color: '#999999',
    fontSize: 11,
  },

  details: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },

  movieTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  rating: {
    color: '#FACC15',
    marginTop: 12,
    fontSize: 14,
  },

  date: {
    color: '#AAAAAA',
    marginTop: 9,
    fontSize: 12,
  },

  removeButton: {
    backgroundColor: '#35140F',
    borderWidth: 1,
    borderColor: '#8B1500',
    padding: 11,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 13,
  },

  removeText: {
    color: '#FF8A75',
    fontWeight: 'bold',
    fontSize: 13,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },

  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  emptySubtext: {
    color: '#AAAAAA',
    marginTop: 9,
    textAlign: 'center',
  },
});
