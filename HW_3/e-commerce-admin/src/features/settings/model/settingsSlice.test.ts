import { describe, it, expect, vi } from 'vitest';

import settingsReducer, {
  setTheme,
  setLanguage,
  setPageSize,
} from '@/features/settings/model/settingsSlice';

vi.mock('@/shared/lib/localStorage', () => ({
  loadState: vi.fn(() => undefined),
  saveState: vi.fn(),
  removeState: vi.fn(),
}));

const defaultState = {
  theme: 'light' as const,
  language: 'ru' as const,
  pageSize: 10,
};

describe('settingsSlice', () => {
  describe('начальное состояние', () => {
    it('должно иметь тему light по умолчанию', () => {
      const state = settingsReducer(undefined, { type: '@@INIT' });
      expect(state.theme).toBe('light');
    });

    it('должно иметь язык ru по умолчанию', () => {
      const state = settingsReducer(undefined, { type: '@@INIT' });
      expect(state.language).toBe('ru');
    });

    it('должно иметь pageSize 10 по умолчанию', () => {
      const state = settingsReducer(undefined, { type: '@@INIT' });
      expect(state.pageSize).toBe(10);
    });
  });

  describe('setTheme', () => {
    it('должно переключить тему на dark', () => {
      const state = settingsReducer(defaultState, setTheme('dark'));
      expect(state.theme).toBe('dark');
    });

    it('должно переключить тему обратно на light', () => {
      const darkState = { ...defaultState, theme: 'dark' as const };
      const state = settingsReducer(darkState, setTheme('light'));
      expect(state.theme).toBe('light');
    });

    it('не должно менять другие поля при смене темы', () => {
      const state = settingsReducer(defaultState, setTheme('dark'));
      expect(state.language).toBe('ru');
      expect(state.pageSize).toBe(10);
    });
  });

  describe('setLanguage', () => {
    it('должно переключить язык на en', () => {
      const state = settingsReducer(defaultState, setLanguage('en'));
      expect(state.language).toBe('en');
    });

    it('должно переключить язык обратно на ru', () => {
      const enState = { ...defaultState, language: 'en' as const };
      const state = settingsReducer(enState, setLanguage('ru'));
      expect(state.language).toBe('ru');
    });

    it('не должно менять другие поля при смене языка', () => {
      const state = settingsReducer(defaultState, setLanguage('en'));
      expect(state.theme).toBe('light');
      expect(state.pageSize).toBe(10);
    });
  });

  describe('setPageSize', () => {
    it('должно изменить размер страницы', () => {
      const state = settingsReducer(defaultState, setPageSize(20));
      expect(state.pageSize).toBe(20);
    });

    it('должно принять любое числовое значение', () => {
      const state = settingsReducer(defaultState, setPageSize(5));
      expect(state.pageSize).toBe(5);
    });

    it('не должно менять другие поля при смене pageSize', () => {
      const state = settingsReducer(defaultState, setPageSize(20));
      expect(state.theme).toBe('light');
      expect(state.language).toBe('ru');
    });
  });
});
