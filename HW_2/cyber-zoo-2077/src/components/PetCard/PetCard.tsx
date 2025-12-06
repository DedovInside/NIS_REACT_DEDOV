import React, { useRef, useEffect, memo, useState } from 'react';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { PetCardProps } from './types';
import { usePetLifecycle } from '../../hooks/usePetLifecycle';
import { ActionButton } from '../PetActions/ActionButton.styled';
import { getAnimalImagePath } from '../../utils/imageMapper';
import styles from './PetCard.module.scss';
import PetDetailsModal from '../PetDetailsModal/PetDetailsModal';

const getEnergyColor = (energy: number): string => {
  if (energy <= 20) return '#ff4757';
  if (energy <= 40) return '#ffa502';
  if (energy <= 60) return '#ffda79';
  return '#7bed9f';
};

const getMoodEmoji = (mood: string): string => {
  switch (mood) {
    case 'happy': return '😊';
    case 'excited': return '🤩';
    case 'playful': return '😄';
    case 'calm': return '😌';
    case 'curious': return '🤔';
    case 'sad': return '😢';
    case 'tired': return '😴';
    case 'sleeping': return '💤';
    default: return '🙂';
  }
};

const PetCard: React.FC<PetCardProps> = memo(({ pet: initialPet, onAction }) => {
  const avatarRef = useRef<HTMLDivElement>(null);
  const { pet, actions } = usePetLifecycle(initialPet, onAction);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const imagePath = getAnimalImagePath(pet);

  useEffect(() => {
    if (avatarRef.current) {
      const element = avatarRef.current;
      if (pet.mood === 'excited' || pet.mood === 'playful') {
        element.style.animation = 'bounce 0.6s ease infinite alternate';
      } else {
        element.style.animation = 'none';
      }
    }
  }, [pet.mood]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  const isDisabled = pet.energy === 0;
  const cardStyle = {
    boxShadow: `0 8px 32px rgba(${pet.energy > 50 ? '255, 0, 225' : '255, 71, 87'}, 0.${Math.floor(pet.energy / 10) + 1})`
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Не открываем модалку если кликнули на кнопку или изображение
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'IMG') {
      return;
    }
    setDetailsOpen(true);
  };

  return (
    <>
      <div 
        className={`${styles.petCard} ${isDisabled ? styles.disabled : ''}`}
        style={cardStyle}
        onClick={handleCardClick}
      >
        <div ref={avatarRef} className={styles.avatar}>
          {!imageError && (
            <img
              src={imagePath}
              alt={pet.name}
              className={`${styles.animalImage} ${imageLoaded ? styles.loaded : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          )}
          {imageError && (
            <span className={styles.fallbackEmoji}>🤖</span>
          )}
        </div>
        
        <h3 className={styles.name}>{pet.name}</h3>
        
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>Species:</span>
            <span>{pet.species}</span>
          </div>
          <div className={styles.stat}>
            <span>Level:</span>
            <span>{pet.level}</span>
          </div>
          <div className={styles.stat}>
            <span>Mood:</span>
            <span>
              {pet.mood}
              <span className={styles.moodEmoji}>{getMoodEmoji(pet.mood)}</span>
            </span>
          </div>
          <div className={styles.stat}>
            <span>Energy:</span>
            <span>{pet.energy}/100</span>
          </div>
          <div className={styles.energyBar}>
            <div 
              className={styles.energyFill}
              style={{
                width: `${pet.energy}%`,
                backgroundColor: getEnergyColor(pet.energy)
              }}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <ActionButton
            variant="primary" 
            onClick={actions.feed} 
            disabled={isDisabled}
          >
            <FoodBankIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
            Feed
          </ActionButton>
          <ActionButton 
            variant="secondary" 
            onClick={actions.levelUp} 
            disabled={isDisabled}
          >
            <ArrowUpwardIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
            Level Up
          </ActionButton>
          <ActionButton 
            variant="secondary" 
            onClick={actions.cheer} 
            disabled={isDisabled}
          >
            <RecordVoiceOverIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
            Cheer
          </ActionButton>
          <ActionButton 
            variant="danger" 
            onClick={actions.reset}
          >
            <RefreshIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
            Reset
          </ActionButton>
        </div>
      </div>

      <PetDetailsModal
        pet={pet}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
});

PetCard.displayName = 'PetCard';

export default PetCard;
