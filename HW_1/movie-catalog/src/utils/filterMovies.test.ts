import { describe, it, expect } from 'vitest';

import type { Movie } from '../types/Movie';

import { filterMovies } from './filterMovies';

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Inception',
    year: 2010,
    posterUrl: 'https://example.com/inception.jpg',
    overview: 'A thief who steals corporate secrets.',
    isFavorite: true,
  },
  {
    id: 2,
    title: 'The Dark Knight',
    year: 2008,
    posterUrl: 'https://example.com/dark-knight.jpg',
    overview: 'Batman fights the Joker.',
    isFavorite: false,
  },
  {
    id: 3,
    title: 'Interstellar',
    year: 2014,
    posterUrl: 'https://example.com/interstellar.jpg',
    overview: 'A team of explorers travel through a wormhole.',
    isFavorite: true,
  },
  {
    id: 4,
    title: 'The Matrix',
    year: 1999,
    posterUrl: 'https://example.com/matrix.jpg',
    overview: 'A hacker discovers reality is a simulation.',
    isFavorite: false,
  },
];

describe('filterMovies', () => {
  describe('filterMode = ALL', () => {
    it('возвращает все фильмы при пустом поисковом запросе', () => {
      const result = filterMovies(mockMovies, 'ALL', '');
      expect(result).toHaveLength(4);
      expect(result).toEqual(mockMovies);
    });

    it('фильтрует по поисковому запросу (без учёта регистра)', () => {
      const result = filterMovies(mockMovies, 'ALL', 'inter');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Interstellar');
    });

    it('фильтрует по поисковому запросу в верхнем регистре', () => {
      const result = filterMovies(mockMovies, 'ALL', 'INCEPTION');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('возвращает пустой массив если ничего не найдено', () => {
      const result = filterMovies(mockMovies, 'ALL', 'nonexistentmovie');
      expect(result).toHaveLength(0);
    });

    it('игнорирует пробелы в поисковом запросе (только пробелы)', () => {
      const result = filterMovies(mockMovies, 'ALL', '   ');
      expect(result).toHaveLength(4);
    });
  });

  describe('filterMode = FAVORITES', () => {
    it('возвращает только избранные фильмы', () => {
      const result = filterMovies(mockMovies, 'FAVORITES', '');
      expect(result).toHaveLength(2);
      expect(result.every(m => m.isFavorite)).toBe(true);
    });

    it('комбинирует фильтр избранных с поиском', () => {
      const result = filterMovies(mockMovies, 'FAVORITES', 'inception');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Inception');
    });

    it('возвращает пустой массив если нет избранных с таким названием', () => {
      const result = filterMovies(mockMovies, 'FAVORITES', 'matrix');
      expect(result).toHaveLength(0);
    });
  });

  it('не мутирует исходный массив', () => {
    const originalLength = mockMovies.length;
    filterMovies(mockMovies, 'FAVORITES', 'inter');
    expect(mockMovies).toHaveLength(originalLength);
  });
});
