
import React, { useEffect, useState } from 'react';
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
import { useCallback } from 'react';

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
      setMovies(savedMovies);
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
      await removeFromWatchlist(auth.currentUser.uid, movieId);
      setMovies((currentMovies) =>
        currentMovies.filter((movie) => movie.id !== movieId)
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
          <View style={styles.posterPlaceholder} />
        )}

        <View style={styles.details}>
          <Text style={styles.movieTitle}>{item.title}</Text>
          <Text style={styles.rating}>
            ⭐ {item.vote_average?.toFixed(1) || 'N/A'}
          </Text>
          <Text style={styles.date}>
            {item.release_date || 'Release date unavailable'}
          </Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.removeButton}
        onPress={() => handleRemove(item.id)}
      >
        <Text style={styles.removeText}>Remove</Text>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Watchlist</Text>
      <Text style={styles.subtitle}>
        Your saved movies in one place
      </Text>

      {movies.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            Your watchlist is empty.
          </Text>
          <Text style={styles.emptySubtext}>
            Add movies you want to watch!
          </Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMovie}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    padding: 20,
  },
  center: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    color: '#BDBDCC',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 20,
  },
  movieCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },
  movieInfo: {
    flexDirection: 'row',
  },
  poster: {
    width: 90,
    height: 125,
    borderRadius: 8,
  },
  posterPlaceholder: {
    width: 90,
    height: 125,
    borderRadius: 8,
    backgroundColor: '#333344',
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
    marginTop: 10,
  },
  date: {
    color: '#BDBDCC',
    marginTop: 8,
    fontSize: 12,
  },
  removeButton: {
    backgroundColor: '#9333EA',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  removeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtext: {
    color: '#BDBDCC',
    marginTop: 8,
  },
});
