import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { fetchMoviesFromApi } from './fetchMovies';

const mockApiResponse = {
  results: [
    {
      id: 101,
      title: 'Mock Movie 1',
      release_date: '2023-05-15',
      poster_path: '/mock1.jpg',
      overview: 'Overview of mock movie 1',
    },
    {
      id: 102,
      title: 'Mock Movie 2',
      release_date: '2022-11-01',
      poster_path: null,
      overview: 'Overview of mock movie 2',
    },
    {
      id: 103,
      title: 'No Date Movie',
      release_date: '',
      poster_path: '/mock3.jpg',
      overview: 'Overview of no date movie',
    },
  ],
  total_pages: 10,
};

describe('fetchMoviesFromApi', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('успешно загружает и трансформирует фильмы', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const movies = await fetchMoviesFromApi('test-api-key', 1);

    expect(movies).toHaveLength(3);
    expect(movies[0]).toMatchObject({
      id: 101,
      title: 'Mock Movie 1',
      year: 2023,
      posterUrl: 'https://image.tmdb.org/t/p/w300/mock1.jpg',
      overview: 'Overview of mock movie 1',
      isFavorite: false,
    });
  });

  it('устанавливает posterUrl в пустую строку при отсутствии poster_path', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const movies = await fetchMoviesFromApi('test-api-key', 1);

    expect(movies[1].posterUrl).toBe('');
  });

  it('устанавливает year = 0 при пустой release_date', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const movies = await fetchMoviesFromApi('test-api-key', 1);

    expect(movies[2].year).toBe(0);
  });

  it('правильно вычисляет rank для второй страницы', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [mockApiResponse.results[0]], total_pages: 10 }),
    } as Response);

    const movies = await fetchMoviesFromApi('test-api-key', 2);

    // rank для первого элемента второй страницы = (2-1)*20 + 0 + 1 = 21
    expect(movies[0].rank).toBe(21);
  });

  it('бросает ошибку при неуспешном HTTP ответе', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
    } as Response);

    await expect(fetchMoviesFromApi('bad-key', 1)).rejects.toThrow('HTTP error! status: 401');
  });

  it('бросает ошибку при сетевой ошибке (fetch rejected)', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network failure'));

    await expect(fetchMoviesFromApi('test-api-key', 1)).rejects.toThrow('Network failure');
  });

  it('передаёт корректный URL с api_key и номером страницы', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [], total_pages: 1 }),
    } as Response);

    await fetchMoviesFromApi('my-secret-key', 3);

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('api_key=my-secret-key'));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('page=3'));
  });
});
