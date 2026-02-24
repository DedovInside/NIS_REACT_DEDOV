import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import FilterButtons from './FilterButtons';

describe('FilterButtons', () => {
  it('рендерит кнопки "Все" и "Только избранные"', () => {
    render(<FilterButtons currentFilter="ALL" onFilterChange={vi.fn()} />);
    expect(screen.getByText('Все')).toBeInTheDocument();
    expect(screen.getByText('Только избранные')).toBeInTheDocument();
  });

  it('кнопка "Все" имеет aria-selected=true при currentFilter="ALL"', () => {
    render(<FilterButtons currentFilter="ALL" onFilterChange={vi.fn()} />);
    expect(screen.getByText('Все')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Только избранные')).toHaveAttribute('aria-selected', 'false');
  });

  it('кнопка "Только избранные" имеет aria-selected=true при currentFilter="FAVORITES"', () => {
    render(<FilterButtons currentFilter="FAVORITES" onFilterChange={vi.fn()} />);
    expect(screen.getByText('Только избранные')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Все')).toHaveAttribute('aria-selected', 'false');
  });

  it('вызывает onFilterChange("ALL") при клике на кнопку "Все"', () => {
    const onFilterChange = vi.fn();
    render(<FilterButtons currentFilter="FAVORITES" onFilterChange={onFilterChange} />);
    fireEvent.click(screen.getByText('Все'));
    expect(onFilterChange).toHaveBeenCalledOnce();
    expect(onFilterChange).toHaveBeenCalledWith('ALL');
  });

  it('вызывает onFilterChange("FAVORITES") при клике на кнопку "Только избранные"', () => {
    const onFilterChange = vi.fn();
    render(<FilterButtons currentFilter="ALL" onFilterChange={onFilterChange} />);
    fireEvent.click(screen.getByText('Только избранные'));
    expect(onFilterChange).toHaveBeenCalledOnce();
    expect(onFilterChange).toHaveBeenCalledWith('FAVORITES');
  });

  it('кнопка "Все" имеет активный класс при currentFilter="ALL"', () => {
    render(<FilterButtons currentFilter="ALL" onFilterChange={vi.fn()} />);
    expect(screen.getByText('Все')).toHaveClass('filter-buttons-btn-active');
  });

  it('кнопка "Только избранные" НЕ имеет активный класс при currentFilter="ALL"', () => {
    render(<FilterButtons currentFilter="ALL" onFilterChange={vi.fn()} />);
    expect(screen.getByText('Только избранные')).not.toHaveClass('filter-buttons-btn-active');
  });

  it('контейнер имеет role="tablist"', () => {
    render(<FilterButtons currentFilter="ALL" onFilterChange={vi.fn()} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });
});
