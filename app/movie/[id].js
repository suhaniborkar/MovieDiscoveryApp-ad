
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
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
          savedMovies.some(
            item => String(item.id) === String(details.id)
          )
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

        Alert.alert(
          'Removed',
          'Movie removed from your watchlist.'
        );
      } else {
        await addToWatchlist(user.uid, movie);
        setIsSaved(true);

        Alert.alert(
          'Success',
          'Movie added to your watchlist!'
        );
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
        <ActivityIndicator size="large" color="#8B1500" />
        <Text style={styles.loadingText}>
          Loading movie details...
        </Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Oops! Something went wrong.
        </Text>

        <Text style={styles.text}>
          Unable to load movie details.
        </Text>

        <Pressable
          onPress={loadDetails}
          style={styles.watchlistButton}
        >
          <Text style={styles.watchlistButtonText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.posterContainer}>
        <Image
          source={{
            uri: movie.poster_path
              ? `${IMAGE_BASE_URL}${movie.poster_path}`
              : undefined,
          }}
          style={styles.poster}
        />

        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ← Back
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.topLabel}>
          THE POPCORN PROJECT
        </Text>

        <Text style={styles.title}>
          {movie.title}
        </Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>
            ★ {movie.vote_average?.toFixed(1) || 'N/A'}/10
          </Text>

          <Text style={styles.ratingLabel}>
            TMDB Rating
          </Text>
        </View>

        <Pressable
          style={[
            styles.watchlistButton,
            saving && styles.disabledButton,
            isSaved && styles.savedButton,
          ]}
          onPress={handleWatchlist}
          disabled={saving}
        >
          <Text style={styles.watchlistButtonText}>
            {saving
              ? 'Please wait...'
              : isSaved
              ? '✓  Remove from Watchlist'
              : '+  Add to Watchlist'}
          </Text>
        </Pressable>

        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>
              RELEASE DATE
            </Text>

            <Text style={styles.infoValue}>
              {movie.release_date || 'Not available'}
            </Text>
          </View>

          <View style={styles.infoSeparator} />

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>
              GENRES
            </Text>

            <Text style={styles.infoValue}>
              {movie.genres?.map(g => g.name).join(' • ') || 'Not available'}
            </Text>
          </View>

          {movie.runtime ? (
            <>
              <View style={styles.infoSeparator} />

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>
                  RUNTIME
                </Text>

                <Text style={styles.infoValue}>
                  {movie.runtime} minutes
                </Text>
              </View>
            </>
          ) : null}
        </View>

        <Text style={styles.heading}>
          Overview
        </Text>

        <Text style={styles.description}>
          {movie.overview || 'No overview available.'}
        </Text>

        <View style={styles.reviewHeadingRow}>
          <Text style={styles.heading}>
            User Reviews
          </Text>

          <View style={styles.reviewCount}>
            <Text style={styles.reviewCountText}>
              {reviews.length}
            </Text>
          </View>
        </View>

        {reviews.length === 0 ? (
          <View style={styles.emptyReviews}>
            <Text style={styles.emptyReviewText}>
              No user reviews are available for this movie yet.
            </Text>
          </View>
        ) : (
          reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <Text style={styles.author}>
                  {review.author || 'Anonymous'}
                </Text>
              </View>

              <Text style={styles.reviewText}>
                {review.content}
              </Text>
            </View>
          ))
        )}

        <Text style={styles.footer}>
          MADE FOR MOVIE LOVERS 🍿
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

  center: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  loadingText: {
    color: '#A3A3A3',
    marginTop: 15,
    fontSize: 14,
  },

  errorTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  text: {
    color: '#A3A3A3',
    textAlign: 'center',
  },

  posterContainer: {
    width: '100%',
    height: 440,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  backButton: {
    position: 'absolute',
    top: 48,
    left: 18,
    backgroundColor: 'rgba(16,16,16,0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },

  backText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  content: {
    padding: 21,
    paddingBottom: 45,
  },

  topLabel: {
    color: '#B83A27',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 10,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: 'bold',
    lineHeight: 36,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },

  rating: {
    color: '#FACC15',
    fontSize: 17,
    fontWeight: 'bold',
  },

  ratingLabel: {
    color: '#888888',
    fontSize: 12,
    marginLeft: 10,
  },

  watchlistButton: {
    backgroundColor: '#8B1500',
    padding: 17,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 22,
  },

  savedButton: {
    backgroundColor: '#303030',
    borderWidth: 1,
    borderColor: '#8B1500',
  },

  disabledButton: {
    opacity: 0.6,
  },

  watchlistButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    paddingHorizontal: 17,
    borderWidth: 1,
    borderColor: '#303030',
  },

  infoItem: {
    paddingVertical: 15,
  },

  infoLabel: {
    color: '#B83A27',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 7,
  },

  infoValue: {
    color: '#EEEEEE',
    fontSize: 14,
    lineHeight: 21,
  },

  infoSeparator: {
    height: 1,
    backgroundColor: '#333333',
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 29,
    marginBottom: 13,
  },

  description: {
    color: '#CCCCCC',
    fontSize: 15,
    lineHeight: 25,
  },

  reviewHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  reviewCount: {
    backgroundColor: '#35150F',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 24,
    marginLeft: 10,
  },

  reviewCountText: {
    color: '#E5A092',
    fontSize: 12,
    fontWeight: 'bold',
  },

  reviewCard: {
    backgroundColor: '#1E1E1E',
    padding: 17,
    borderRadius: 13,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#303030',
  },

  reviewTop: {
    marginBottom: 10,
  },

  author: {
    color: '#D66B58',
    fontSize: 15,
    fontWeight: 'bold',
  },

  reviewText: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 22,
  },

  emptyReviews: {
    backgroundColor: '#1E1E1E',
    padding: 18,
    borderRadius: 12,
  },

  emptyReviewText: {
    color: '#999999',
    fontSize: 14,
    lineHeight: 22,
  },

  footer: {
    color: '#8B1500',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 35,
  },
});
