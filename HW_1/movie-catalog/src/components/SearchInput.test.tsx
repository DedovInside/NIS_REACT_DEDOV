import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import SearchInput from './SearchInput';

describe('SearchInput', () => {
  it('рендерит поле ввода', () => {
    render(<SearchInput onSearch={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('отображает placeholder по умолчанию "Search movies..."', () => {
    render(<SearchInput onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument();
  });

  it('отображает кастомный placeholder', () => {
    render(<SearchInput onSearch={vi.fn()} placeholder="Найти фильм..." />);
    expect(screen.getByPlaceholderText('Найти фильм...')).toBeInTheDocument();
  });

  it('вызывает onSearch при изменении значения в поле', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Inception' } });
    expect(onSearch).toHaveBeenCalledOnce();
    expect(onSearch).toHaveBeenCalledWith('Inception');
  });

  it('вызывает onSearch при нажатии Enter', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Matrix' } });
    onSearch.mockClear();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledOnce();
  });

  it('НЕ вызывает onSearch при нажатии других клавиш', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onSearch).not.toHaveBeenCalled();
  });
});
