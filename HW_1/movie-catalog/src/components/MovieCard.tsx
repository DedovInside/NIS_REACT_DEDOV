import type { Movie, ViewMode } from '../types/Movie';
import React from 'react';

interface MovieCardProps {
  movie: Movie;
  viewMode: ViewMode;
  onToggleFavorite: (id: number) => void;
  onCardClick: (movie: Movie) => void; // Добавляем обработчик клика
}

const MovieCard = React.memo(({ movie, onToggleFavorite, viewMode, onCardClick }: MovieCardProps) => {
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем открытие модального окна при клике на кнопку
    onToggleFavorite(movie.id);
  };

  const handleCardClick = () => {
    onCardClick(movie);
  };

  const viewModeClass = viewMode.toLowerCase();

  return (
    <article 
      className={`movie-card movie-card-${viewModeClass}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      <div className="movie-card-image-container">
        <img 
          src={movie.posterUrl} 
          alt={`${movie.title} poster`}
          className="movie-card-image"
          loading="lazy"
        />
      </div>
      <div className="movie-card-content">
        <h3 className="movie-card-title">{movie.title}</h3>
        <p className="movie-card-year">{movie.year}</p>
        <button 
          className={`movie-card-favorite-btn ${movie.isFavorite ? 'movie-card-favorite-btn-active' : ''}`}
          onClick={handleToggleFavorite}
          aria-label={movie.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          ⭐
        </button>
      </div>
    </article>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;