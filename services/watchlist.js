
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from './firebase';

// Add a movie to the user's watchlist
export async function addToWatchlist(userId, movie) {
  const movieRef = doc(
    db,
    'users',
    userId,
    'watchlist',
    String(movie.id)
  );

  await setDoc(movieRef, {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path || null,
    vote_average: movie.vote_average || 0,
    release_date: movie.release_date || '',
    addedAt: serverTimestamp(),
  });
}

// Get all movies saved by a user
export async function getWatchlist(userId) {
  const watchlistRef = collection(
    db,
    'users',
    userId,
    'watchlist'
  );

  const snapshot = await getDocs(watchlistRef);

  return snapshot.docs.map((document) => document.data());
}

// Remove a movie from the user's watchlist
export async function removeFromWatchlist(userId, movieId) {
  const movieRef = doc(
    db,
    'users',
    userId,
    'watchlist',
    String(movieId)
  );

  await deleteDoc(movieRef);
}
