export interface Movie {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  overview: string; // Добавим для дополнительного функционала
  isFavorite: boolean;
}

export type FilterMode = 'ALL' | 'FAVORITES';
export type ViewMode = 'GRID' | 'LIST';