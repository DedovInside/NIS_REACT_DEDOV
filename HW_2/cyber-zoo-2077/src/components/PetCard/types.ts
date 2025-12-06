export interface Pet {
  id: string;
  name: string;
  species: string;
  mood: string;
  energy: number;
  level: number;
  originalName?: string;
  characteristics?: Record<string, string>;
  taxonomy?: Record<string, string>;
}

export type PetAction = 
  | { type: 'FEED' }
  | { type: 'LEVEL_UP' }
  | { type: 'CHEER' }
  | { type: 'RESET'; payload: Pet }
  | { type: 'DECREASE_ENERGY' };

export interface PetCardProps {
  pet: Pet;
  onAction: (petId: string, action: string) => void;
}
