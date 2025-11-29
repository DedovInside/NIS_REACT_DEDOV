import { memo } from 'react';
import type { ViewMode } from '../types/Movie';

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const ViewModeToggle = memo(({ currentMode, onModeChange }: ViewModeToggleProps) => {
  return (
    <div className="view-mode-toggle">
      <button
        className={`view-mode-toggle-btn ${currentMode === 'GRID' ? 'view-mode-toggle-btn-active' : ''}`}
        onClick={() => onModeChange('GRID')}
        aria-label="Grid view"
        title="Плитка"
      >
        ⊞
      </button>
      <button
        className={`view-mode-toggle-btn ${currentMode === 'LIST' ? 'view-mode-toggle-btn-active' : ''}`}
        onClick={() => onModeChange('LIST')}
        aria-label="List view"
        title="Список"
      >
        ☰
      </button>
    </div>
  );
});

ViewModeToggle.displayName = 'ViewModeToggle';

export default ViewModeToggle;