import { describe, it, expect, vi } from 'vitest';

import authReducer, { setCredentials, setUser, logout } from '@/entities/user/model/authSlice';
import type { AuthResponse, User } from '@/shared/types';

vi.mock('@/shared/lib/localStorage', () => ({
  loadState: vi.fn(() => undefined),
  saveState: vi.fn(),
  removeState: vi.fn(),
}));

const mockAuthResponse: AuthResponse = {
  id: 1,
  username: 'emilys',
  email: 'emily@example.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: 'https://example.com/avatar.png',
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
};

const mockUser: User = {
  id: 1,
  username: 'emilys',
  email: 'emily@example.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: 'https://example.com/avatar.png',
};

const emptyState = { token: null, user: null };

describe('authSlice', () => {
  describe('начальное состояние', () => {
    it('должно быть token: null и user: null', () => {
      const state = authReducer(undefined, { type: '@@INIT' });
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
    });
  });

  describe('setCredentials', () => {
    it('должно сохранить токен из AuthResponse', () => {
      const state = authReducer(emptyState, setCredentials(mockAuthResponse));
      expect(state.token).toBe('test-access-token');
    });

    it('должно сохранить данные пользователя из AuthResponse', () => {
      const state = authReducer(emptyState, setCredentials(mockAuthResponse));
      expect(state.user).not.toBeNull();
      expect(state.user?.username).toBe('emilys');
      expect(state.user?.email).toBe('emily@example.com');
      expect(state.user?.firstName).toBe('Emily');
    });

    it('не должно сохранять accessToken и refreshToken в user', () => {
      const state = authReducer(emptyState, setCredentials(mockAuthResponse));
      expect(state.user).not.toHaveProperty('accessToken');
      expect(state.user).not.toHaveProperty('refreshToken');
    });
  });

  describe('setUser', () => {
    it('должно установить пользователя не меняя токен', () => {
      const stateWithToken = { token: 'existing-token', user: null };
      const state = authReducer(stateWithToken, setUser(mockUser));
      expect(state.user?.username).toBe('emilys');
      expect(state.token).toBe('existing-token');
    });
  });

  describe('logout', () => {
    it('должно обнулить токен', () => {
      const loggedIn = authReducer(emptyState, setCredentials(mockAuthResponse));
      const state = authReducer(loggedIn, logout());
      expect(state.token).toBeNull();
    });

    it('должно обнулить пользователя', () => {
      const loggedIn = authReducer(emptyState, setCredentials(mockAuthResponse));
      const state = authReducer(loggedIn, logout());
      expect(state.user).toBeNull();
    });

    it('должно вернуть состояние идентичное начальному', () => {
      const loggedIn = authReducer(emptyState, setCredentials(mockAuthResponse));
      const state = authReducer(loggedIn, logout());
      expect(state).toEqual(emptyState);
    });
  });
});
