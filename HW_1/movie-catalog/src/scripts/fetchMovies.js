import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const API_KEY = '----------';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w300';

async function fetchMovies() {
  try {
    const totalPages = 300;
    const allMovies = [];
    const seenIds = new Set(); // Для отслеживания дубликатов по ID
    const seenTitles = new Set(); // Для отслеживания дубликатов по названию

    console.log('Загружаем фильмы из TMDB...');

    for (let page = 1; page <= totalPages; page++) {
      console.log(`Загружаем страницу ${page}/${totalPages}...`);
      
      const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}&include_adult=false`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Фильтруем дубликаты на лету
      const uniqueMovies = data.results.filter(movie => {
        // Проверяем наличие постера
        if (!movie.poster_path) return false;
        
        // Проверяем дубликаты по ID
        if (seenIds.has(movie.id)) return false;
        
        // Проверяем дубликаты по названию (нормализуем для сравнения)
        const normalizedTitle = movie.title.toLowerCase().trim();
        if (seenTitles.has(normalizedTitle)) return false;
        
        // Проверяем год выпуска
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
        if (!year || year < 1930 || year > 2020) return false;
        
        // Добавляем в множества для отслеживания
        seenIds.add(movie.id);
        seenTitles.add(normalizedTitle);
        
        return true;
      });
      
      allMovies.push(...uniqueMovies);
      
      // Небольшая задержка между запросами, чтобы не превысить лимиты API
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`Найдено ${allMovies.length} уникальных фильмов`);

    // Преобразуем в наш формат
    const movies = allMovies
      .slice(0, 4000)
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2024,
        posterUrl: `${IMAGE_BASE_URL}${movie.poster_path}`,
        overview: movie.overview || 'Описание недоступно',
        isFavorite: false
      }));

    // Финальная проверка на дубликаты
    const finalMovies = [];
    const finalIds = new Set();
    
    for (const movie of movies) {
      if (!finalIds.has(movie.id)) {
        finalIds.add(movie.id);
        finalMovies.push(movie);
      }
    }

    console.log(`Финальное количество фильмов: ${finalMovies.length}`);

    // Генерируем TypeScript файл
    const fileContent = `import type { Movie } from '../types/Movie';

export const moviesData: Movie[] = ${JSON.stringify(finalMovies, null, 2)};
`;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const outputPath = path.resolve(__dirname, '../data/movies.ts');

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, fileContent);
    console.log(`Создан файл movies.ts с ${finalMovies.length} уникальными фильмами`);
    console.log(`Файл сохранен: ${outputPath}`);

  } catch (error) {
    console.error('Ошибка при получении данных:', error.message);
    
    if (error.message.includes('401')) {
      console.error('Проверьте правильность API ключа TMDB');
    } else if (error.message.includes('429')) {
      console.error('Слишком много запросов, подождите перед повторной попыткой');
    }
  }
}

fetchMovies();