
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;

const BASE_URL = 'https://api.themoviedb.org/3';

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export async function getTrendingMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch trending movies');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('TMDB Error:', error);
    return [];
  }
}

export async function getPopularMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch popular movies');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('TMDB Error:', error);
    return [];
  }
}

export async function searchMovies(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error('Failed to search movies');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('TMDB Search Error:', error);
    return [];
  }
}

export async function getMovieDetails(movieId) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Could not fetch movie details');
    }

    return await response.json();
  } catch (error) {
    console.error('Movie Details Error:', error);
    return null;
  }
}

export async function getMovieReviews(movieId) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Could not fetch movie reviews');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Movie Reviews Error:', error);
    return [];
  }
}
