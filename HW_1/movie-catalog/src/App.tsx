import { useState, useMemo, useCallback } from 'react';

import type { Movie, FilterMode, ViewMode } from './types/Movie';
import MovieCard from './components/MovieCard';
import FilterButtons from './components/FilterButtons';
import MovieModal from './components/MovieModal';
import SearchInput from './components/SearchInput';
import ViewModeToggle from './components/ViewModeToggle';
import { moviesData } from './data/movies';
import { filterMovies } from './utils/filterMovies';
import './App.css';

function App() {
  const [movies, setMovies] = useState<Movie[]>(moviesData);
  const [filterMode, setFilterMode] = useState<FilterMode>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFavorite = useCallback((id: number) => {
    setMovies(prevMovies =>
      prevMovies.map(movie =>
        movie.id === id ? { ...movie, isFavorite: !movie.isFavorite } : movie,
      ),
    );
  }, []);

  const handleCardClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  }, []);

  const filteredMovies = useMemo(
    () => filterMovies(movies, filterMode, searchQuery),
    [movies, filterMode, searchQuery],
  );

  const favoriteCount = useMemo(() => movies.filter(movie => movie.isFavorite).length, [movies]);

  const viewModeClass = viewMode.toLowerCase();

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🎬 Каталог фильмов</h1>
        <p className="app-subtitle">
          Всего фильмов: {movies.length} | Избранных: {favoriteCount}
        </p>
      </header>

      <div className="app-controls">
        <div className="app-filters">
          <FilterButtons currentFilter={filterMode} onFilterChange={setFilterMode} />
        </div>

        <SearchInput onSearch={setSearchQuery} />

        <ViewModeToggle currentMode={viewMode} onModeChange={setViewMode} />
      </div>

      <main className="app-content">
        {filteredMovies.length === 0 ? (
          <div className="app-empty-state">
            <p>Фильмов нет</p>
            {searchQuery && <p className="app-empty-hint">Попробуйте изменить поисковый запрос</p>}
          </div>
        ) : (
          <div className={`movies-grid movies-grid-${viewModeClass}`}>
            {filteredMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onToggleFavorite={toggleFavorite}
                onCardClick={handleCardClick}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </main>

      <MovieModal movie={selectedMovie} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default App;
