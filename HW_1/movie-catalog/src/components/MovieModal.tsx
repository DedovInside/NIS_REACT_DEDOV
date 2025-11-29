import { useEffect, memo } from 'react';
import type { Movie } from '../types/Movie';

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieModal = memo(({ movie, isOpen, onClose }: MovieModalProps) => {
  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Блокируем скролл
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !movie) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
        
        <div className="modal-body">
          <div className="modal-poster">
            <img 
              src={movie.posterUrl} 
              alt={`${movie.title} poster`}
              className="modal-poster-image"
            />
          </div>
          
          <div className="modal-info">
            <h2 className="modal-title">{movie.title}</h2>
            <p className="modal-year">{movie.year}</p>
            
            <div className="modal-overview">
              <h3>Описание:</h3>
              <p>{movie.overview}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MovieModal.displayName = 'MovieModal';

export default MovieModal;