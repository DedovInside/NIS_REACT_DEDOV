import type { Movie, FilterMode } from '../types/Movie';

export function filterMovies(
  movies: Movie[],
  filterMode: FilterMode,
  searchQuery: string,
): Movie[] {
  let filtered = movies;

  if (filterMode === 'FAVORITES') {
    filtered = filtered.filter(movie => movie.isFavorite);
  }

  if (searchQuery.trim()) {
    filtered = filtered.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  return filtered;
}
