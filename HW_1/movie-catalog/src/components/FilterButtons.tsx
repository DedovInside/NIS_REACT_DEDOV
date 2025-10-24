import { memo } from 'react';
import type { FilterMode } from '../types/Movie';

interface FilterButtonsProps {
  currentFilter: FilterMode;
  onFilterChange: (filter: FilterMode) => void;
}

const FilterButtons = memo(({ currentFilter, onFilterChange }: FilterButtonsProps) => {
  return (
    <div className="filter-buttons" role="tablist">
      <button
        className={`filter-buttons-btn ${currentFilter === 'ALL' ? 'filter-buttons-btn-active' : ''}`}
        onClick={() => onFilterChange('ALL')}
        role="tab"
        aria-selected={currentFilter === 'ALL'}
      >
        Все
      </button>
      <button
        className={`filter-buttons-btn ${currentFilter === 'FAVORITES' ? 'filter-buttons-btn-active' : ''}`}
        onClick={() => onFilterChange('FAVORITES')}
        role="tab"
        aria-selected={currentFilter === 'FAVORITES'}
      >
        Только избранные
      </button>
    </div>
  );
});

FilterButtons.displayName = 'FilterButtons';

export default FilterButtons;