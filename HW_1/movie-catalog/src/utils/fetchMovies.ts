import type { Movie } from '../types/Movie';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w300';

interface TmdbMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
}

interface TmdbResponse {
  results: TmdbMovie[];
  total_pages: number;
}

export async function fetchMoviesFromApi(apiKey: string, page = 1): Promise<Movie[]> {
  const BASE_URL = 'https://api.themoviedb.org/3';

  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=${page}&include_adult=false`,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: TmdbResponse = await response.json();

  return data.results.map((movie, index) => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date ? parseInt(movie.release_date.substring(0, 4), 10) : 0,
    posterUrl: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '',
    overview: movie.overview,
    isFavorite: false,
    rank: (page - 1) * 20 + index + 1,
  }));
}
