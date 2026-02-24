import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { Movie } from '../types/Movie';

import MovieCard from './MovieCard';

const mockMovie: Movie = {
  id: 1,
  title: 'Inception',
  year: 2010,
  posterUrl: 'https://example.com/inception.jpg',
  overview: 'A thief who steals corporate secrets.',
  isFavorite: false,
};

const favoriteMovie: Movie = { ...mockMovie, isFavorite: true };

describe('MovieCard', () => {
  it('рендерит название фильма', () => {
    render(
      <MovieCard
        movie={mockMovie}
        viewMode="GRID"
        onToggleFavorite={vi.fn()}
        onCardClick={vi.fn()}
      />,
    );
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('рендерит год выхода фильма', () => {
    render(
      <MovieCard
        movie={mockMovie}
        viewMode="GRID"
        onToggleFavorite={vi.fn()}
        onCardClick={vi.fn()}
      />,
    );
    expect(screen.getByText('2010')).toBeInTheDocument();
  });

  it('рендерит постер с корректным alt текстом', () => {
    render(
      <MovieCard
        movie={mockMovie}
        viewMode="GRID"
        onToggleFavorite={vi.fn()}
        onCardClick={vi.fn()}
      />,
    );
    const img = screen.getByAltText('Inception poster');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockMovie.posterUrl);
  });

  it('кнопка избранного показывает "Add to favorites" для не-избранного', () => {
    render(
      <MovieCard
        movie={mockMovie}
        viewMode="GRID"
        onToggleFavorite={vi.fn()}
        onCardClick={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('Add to favorites')).toBeInTheDocument();
  });

  it('кнопка избранного показывает "Remove from favorites" для избранного', () => {
    render(
      <MovieCard
        movie={favoriteMovie}
        viewMode="GRID"
        onToggleFavorite={vi.fn()}
        onCardClick={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();
  });

  it('вызывает onToggleFavorite при клике на кнопку избранного', () => {
    const onToggleFavorite = vi.fn();
    render(
      <MovieCard
        movie={mockMovie}
        viewMode="GRID"
        onToggleFavorite={onToggleFavorite}
        onCardClick={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByLabelText('Add to favorites'));
    expect(onToggleFavorite).toHaveBeenCalledOnce();
    expect(onToggleFavorite).toHaveBeenCalledWith(mockMovie.id);
  });

  it('вызывает onCardClick при клике на карточку', () => {
    const onCardClick = vi.fn();
    render(
      <MovieCard
        movie={mockMovie}
        viewMode="GRID"
        onToggleFavorite={vi.fn()}
        onCardClick={onCardClick}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /inception/i }));
    expect(onCardClick).toHaveBeenCalledOnce();
    expect(onCardClick).toHaveBeenCalledWith(mockMovie);
  });

  it('вызывает onCardClick при нажатии Enter на карточке', () => {
    const onCardClick = vi.fn();
    render(
      <MovieCard
        movie={mockMovie}
        viewMode="GRID"
        onToggleFavorite={vi.fn()}
        onCardClick={onCardClick}
      />,
    );
    const card = screen.getByRole('button', { name: /inception/i });
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onCardClick).toHaveBeenCalledOnce();
  });

  it('NOT вызывает onCardClick при нажатии кнопки избранного (stopPropagation)', () => {
    const onCardClick = vi.fn();
    render(
      <MovieCard
        movie={mockMovie}
        viewMode="GRID"
        onToggleFavorite={vi.fn()}
        onCardClick={onCardClick}
      />,
    );
    fireEvent.click(screen.getByLabelText('Add to favorites'));
    expect(onCardClick).not.toHaveBeenCalled();
  });

  it('применяет класс movie-card-list в LIST режиме', () => {
    render(
      <MovieCard
        movie={mockMovie}
        viewMode="LIST"
        onToggleFavorite={vi.fn()}
        onCardClick={vi.fn()}
      />,
    );
    const article = screen.getByRole('button', { name: /inception/i });
    expect(article).toHaveClass('movie-card-list');
  });
});
