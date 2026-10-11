
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function tmdbFetch(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error("TMDB API key is missing. Check your .env file.");
  }

  const url = new URL(`${BASE_URL}${endpoint}`);

  url.searchParams.set("api_key", API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
}

export const getTrendingMovies = (page = 1) =>
  tmdbFetch("/trending/movie/week", { page });

export const getPopularMovies = (page = 1) =>
  tmdbFetch("/movie/popular", { page });

export const getTopRatedMovies = (page = 1) =>
  tmdbFetch("/movie/top_rated", { page });

export const getUpcomingMovies = (page = 1) =>
  tmdbFetch("/movie/upcoming", { page });

export const searchMovies = (query, page = 1) =>
  tmdbFetch("/search/movie", {
    query,
    page,
    include_adult: false,
  });

export const getMovieDetails = (movieId) =>
  tmdbFetch(`/movie/${movieId}`, {
    append_to_response: "videos,credits,similar",
  });

export const getMovieGenres = () =>
  tmdbFetch("/genre/movie/list");

export const getImageUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const getTrendingTV = (page = 1) =>
  tmdbFetch("/trending/tv/week", { page });

export const getPopularTV = (page = 1) =>
  tmdbFetch("/tv/popular", { page });