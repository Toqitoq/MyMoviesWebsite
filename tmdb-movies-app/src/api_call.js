const API_KEY = '9d5a0dbde24256d9f1327c7fc4e5600a'; // Replace with your TMDb API key
const BASE_URL = 'https://api.themoviedb.org/3';


export async function fetchMovieCredits(movieId) {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
  const data = await response.json();
  return data.cast;
}

// ...existing code...
export async function fetchGenres() {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  const data = await response.json();
  return data.genres;
}

export async function fetchPopularMovies(page = 1) {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
  const data = await response.json();
  return data.results;
}

export async function fetchMoviesByGenre(genreId, page = 1) {
  const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
  const data = await response.json();
  return data.results;
}

export async function searchMovies(query, page = 1) {
  const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  const data = await response.json();
  return data.results;
}

export async function fetchSimilarMovies(movieId) {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
}

export async function fetchMovieTrailer(movieId) {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
  const data = await response.json();
  // Find the first YouTube trailer
  const trailer = data.results.find(
    vid => vid.site === 'YouTube' && vid.type === 'Trailer'
  );
  return trailer ? trailer.key : null;
}
