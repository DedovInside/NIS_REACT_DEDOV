import { useEffect, useReducer, useCallback } from 'react';
import type { Pet, PetAction } from '../components/PetCard/types';

const petReducer = (state: Pet, action: PetAction): Pet => {
  switch (action.type) {
    case 'FEED':
      return {
        ...state,
        energy: Math.min(100, state.energy + 20),
        mood: state.energy + 20 > 60 ? 'happy' : state.mood
      };
    case 'LEVEL_UP':
      return {
        ...state,
        level: state.level + 1,
        mood: 'excited'
      };
    case 'CHEER':
      return {
        ...state,
        mood: 'playful',
        energy: Math.min(100, state.energy + 5)
      };
    case 'RESET':
      return action.payload;
    case 'DECREASE_ENERGY':
      const newEnergy = Math.max(0, state.energy - 5);
      let newMood = state.mood;
      
      if (newEnergy <= 20) {
        newMood = 'sad';
      } else if (newEnergy <= 40) {
        newMood = 'tired';
      } else if (newEnergy >= 80) {
        newMood = 'happy';
      }
      
      return {
        ...state,
        energy: newEnergy,
        mood: newEnergy === 0 ? 'sleeping' : newMood
      };
    default:
      return state;
  }
};

export const usePetLifecycle = (initialPet: Pet, onAction: (petId: string, action: string) => void) => {
  const [pet, dispatch] = useReducer(petReducer, initialPet);

  const feed = useCallback(() => {
    dispatch({ type: 'FEED' });
    onAction(pet.id, 'Feed');
  }, [pet.id, onAction]);

  const levelUp = useCallback(() => {
    dispatch({ type: 'LEVEL_UP' });
    onAction(pet.id, 'Level Up');
  }, [pet.id, onAction]);

  const cheer = useCallback(() => {
    dispatch({ type: 'CHEER' });
    onAction(pet.id, 'Cheer');
  }, [pet.id, onAction]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET', payload: initialPet });
    onAction(pet.id, 'Reset');
  }, [pet.id, onAction, initialPet]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'DECREASE_ENERGY' });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return {
    pet,
    actions: {
      feed,
      levelUp,
      cheer,
      reset
    }
  };
};
