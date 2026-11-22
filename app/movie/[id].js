
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  getMovieDetails,
  getMovieReviews,
  IMAGE_BASE_URL,
} from '../../services/tmdb';

import { auth } from '../../services/firebase';
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} from '../../services/watchlist';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    try {
      setLoading(true);

      const details = await getMovieDetails(id);
      const reviewData = await getMovieReviews(id);

      setMovie(details);
      setReviews(reviewData || []);

      const user = auth.currentUser;

      if (user && details) {
        const savedMovies = await getWatchlist(user.uid);
        setIsSaved(
          savedMovies.some(item => String(item.id) === String(details.id))
        );
      }
    } catch (error) {
      console.log('Movie Details Error:', error);
      Alert.alert(
        'Connection Error',
        'Unable to load movie details. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlist = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Login Required', 'Please log in first.');
      return;
    }

    if (!movie || saving) return;

    try {
      setSaving(true);

      if (isSaved) {
        await removeFromWatchlist(user.uid, movie.id);
        setIsSaved(false);
        Alert.alert('Removed', 'Movie removed from your watchlist.');
      } else {
        await addToWatchlist(user.uid, movie);
        setIsSaved(true);
        Alert.alert('Success', 'Movie added to your watchlist!');
      }
    } catch (error) {
      console.log('Watchlist Error:', error);
      Alert.alert(
        'Watchlist Error',
        'Could not update your watchlist. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          Unable to load movie details.
        </Text>
        <Pressable onPress={loadDetails} style={styles.watchlistButton}>
          <Text style={styles.watchlistButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Image
        source={{
          uri: movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : undefined,
        }}
        style={styles.poster}
      />

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>

        <Text style={styles.rating}>
          ⭐ {movie.vote_average?.toFixed(1)}/10
        </Text>

        <Pressable
          style={[
            styles.watchlistButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleWatchlist}
          disabled={saving}
        >
          <Text style={styles.watchlistButtonText}>
            {saving
              ? 'Please wait...'
              : isSaved
              ? '✓ Remove from Watchlist'
              : '+ Add to Watchlist'}
          </Text>
        </Pressable>

        <Text style={styles.info}>
          Release Date: {movie.release_date || 'Not available'}
        </Text>

        <Text style={styles.info}>
          Genres: {movie.genres?.map(g => g.name).join(', ') || 'Not available'}
        </Text>

        <Text style={styles.heading}>Overview</Text>

        <Text style={styles.description}>
          {movie.overview || 'No overview available.'}
        </Text>

        <Text style={styles.heading}>
          User Reviews ({reviews.length})
        </Text>

        {reviews.length === 0 ? (
          <Text style={styles.description}>
            No user reviews are available for this movie yet.
          </Text>
        ) : (
          reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <Text style={styles.author}>
                {review.author}
              </Text>

              <Text style={styles.reviewText}>
                {review.content}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  center: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    padding: 18,
    paddingTop: 45,
  },
  backText: {
    color: '#A855F7',
    fontSize: 17,
  },
  poster: {
    width: '100%',
    height: 430,
    resizeMode: 'contain',
    backgroundColor: '#202020',
  },
  content: {
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: 'bold',
  },
  rating: {
    color: '#FACC15',
    fontSize: 17,
    marginTop: 10,
  },
  info: {
    color: '#AAAAAA',
    marginTop: 10,
  },
  heading: {
    color: '#A855F7',
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 12,
  },
  description: {
    color: '#DDDDDD',
    fontSize: 15,
    lineHeight: 23,
  },
  reviewCard: {
    backgroundColor: '#202020',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  author: {
    color: '#A855F7',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewText: {
    color: '#DDDDDD',
    lineHeight: 21,
  },
  text: {
    color: '#FFFFFF',
  },
  watchlistButton: {
    backgroundColor: '#9333EA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
  watchlistButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
