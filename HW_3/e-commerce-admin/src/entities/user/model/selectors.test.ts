import { describe, it, expect, vi } from 'vitest';

import {
  selectToken,
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserDisplayName,
} from '@/entities/user/model/userSelectors';
import {
  selectTheme,
  selectLanguage,
  selectPageSize,
  selectAllSettings,
} from '@/features/settings/model/settingsSelectors';
import type { RootState } from '@/app/store/store';

vi.mock('@/shared/lib/localStorage', () => ({
  loadState: vi.fn(() => undefined),
  saveState: vi.fn(),
  removeState: vi.fn(),
}));

const buildState = (overrides?: Partial<RootState>): RootState =>
  ({
    auth: {
      token: null,
      user: null,
    },
    settings: {
      theme: 'light',
      language: 'ru',
      pageSize: 10,
    },
    ...overrides,
  }) as RootState;

describe('userSelectors', () => {
  describe('selectToken', () => {
    it('должен вернуть null если пользователь не авторизован', () => {
      expect(selectToken(buildState())).toBeNull();
    });

    it('должен вернуть токен если пользователь авторизован', () => {
      const state = buildState({ auth: { token: 'abc123', user: null } });
      expect(selectToken(state)).toBe('abc123');
    });
  });

  describe('selectIsAuthenticated', () => {
    it('должен вернуть false если токен null', () => {
      expect(selectIsAuthenticated(buildState())).toBe(false);
    });

    it('должен вернуть true если токен есть', () => {
      const state = buildState({ auth: { token: 'abc123', user: null } });
      expect(selectIsAuthenticated(state)).toBe(true);
    });
  });

  describe('selectCurrentUser', () => {
    it('должен вернуть null если пользователь не загружен', () => {
      expect(selectCurrentUser(buildState())).toBeNull();
    });

    it('должен вернуть пользователя если он загружен', () => {
      const user = {
        id: 1,
        username: 'emilys',
        email: 'emily@example.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        gender: 'female',
        image: '',
      };
      const state = buildState({ auth: { token: 'abc', user } });
      expect(selectCurrentUser(state)).toEqual(user);
    });
  });

  describe('selectUserDisplayName', () => {
    it('должен вернуть null если пользователь не загружен', () => {
      expect(selectUserDisplayName(buildState())).toBeNull();
    });

    it('должен вернуть полное имя пользователя', () => {
      const user = {
        id: 1,
        username: 'emilys',
        email: 'emily@example.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        gender: 'female',
        image: '',
      };
      const state = buildState({ auth: { token: 'abc', user } });
      expect(selectUserDisplayName(state)).toBe('Emily Johnson');
    });
  });
});

describe('settingsSelectors', () => {
  describe('selectTheme', () => {
    it('должен вернуть light по умолчанию', () => {
      expect(selectTheme(buildState())).toBe('light');
    });

    it('должен вернуть dark если тема тёмная', () => {
      const state = buildState({
        settings: { theme: 'dark', language: 'ru', pageSize: 10 },
      });
      expect(selectTheme(state)).toBe('dark');
    });
  });

  describe('selectLanguage', () => {
    it('должен вернуть ru по умолчанию', () => {
      expect(selectLanguage(buildState())).toBe('ru');
    });

    it('должен вернуть en если язык английский', () => {
      const state = buildState({
        settings: { theme: 'light', language: 'en', pageSize: 10 },
      });
      expect(selectLanguage(state)).toBe('en');
    });
  });

  describe('selectPageSize', () => {
    it('должен вернуть 10 по умолчанию', () => {
      expect(selectPageSize(buildState())).toBe(10);
    });

    it('должен вернуть изменённый pageSize', () => {
      const state = buildState({
        settings: { theme: 'light', language: 'ru', pageSize: 20 },
      });
      expect(selectPageSize(state)).toBe(20);
    });
  });

  describe('selectAllSettings (memoized)', () => {
    it('должен вернуть объект со всеми настройками', () => {
      const state = buildState({
        settings: { theme: 'dark', language: 'en', pageSize: 5 },
      });
      expect(selectAllSettings(state)).toEqual({
        theme: 'dark',
        language: 'en',
        pageSize: 5,
      });
    });

    it('должен вернуть тот же объект при повторном вызове (мемоизация)', () => {
      const state = buildState();
      const result1 = selectAllSettings(state);
      const result2 = selectAllSettings(state);
      expect(result1).toBe(result2);
    });
  });
});
