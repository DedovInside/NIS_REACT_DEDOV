import type { Pet } from '../components/PetCard/types';

// Функция для создания безопасного имени файла (такая же логика как в скрипте генерации)
function createSafeFileName(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Удаляем спецсимволы
    .replace(/\s+/g, '_') // Заменяем пробелы на подчеркивания
    .toLowerCase(); // Приводим к нижнему регистру
}

// Функция для получения пути к изображению животного
export function getAnimalImagePath(pet: Pet): string {
  // Используем originalName напрямую, если он есть
  if (pet.originalName) {
    const fileName = createSafeFileName(pet.originalName);
    const imagePath = `/images/animals/${fileName}.png`;
    return imagePath;
  }

  // Fallback - если нет originalName, возвращаем пустую строку
  console.warn(`No originalName for pet: ${pet.name}`);
  return ''; // Вернет пустую строку, что вызовет ошибку загрузки и покажет эмодзи
}

// Функция для проверки существования изображения (опциональная, для отладки)
export async function checkImageExists(imagePath: string): Promise<boolean> {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Хук для загрузки изображения с fallback на эмодзи
export function useAnimalImage(pet: Pet) {
  const imagePath = getAnimalImagePath(pet);
  
  return {
    imagePath,
    animalName: pet.originalName || pet.name
  };
}
