import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

import LoginPage from '@/pages/LoginPage/LoginPage';
import authReducer from '@/entities/user/model/authSlice';
import settingsReducer from '@/features/settings/model/settingsSlice';
import { baseApi } from '@/shared/api/baseApi';

vi.mock('@/shared/lib/localStorage', () => ({
  loadState: vi.fn(() => undefined),
  saveState: vi.fn(),
  removeState: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn() },
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLogin = vi.fn();
vi.mock('@/features/auth/api/authApi', () => ({
  useLoginMutation: () => [mockLogin, { isLoading: false }],
}));

const renderLoginPage = () => {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
      settings: settingsReducer,
    },
    middleware: gDM => gDM().concat(baseApi.middleware),
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>,
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('рендер', () => {
    it('должен отобразить поля username и password', () => {
      renderLoginPage();
      expect(screen.getByLabelText('auth.username')).toBeInTheDocument();
      expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
    });

    it('должен отобразить кнопку входа', () => {
      renderLoginPage();
      expect(screen.getByRole('button', { name: 'auth.login' })).toBeInTheDocument();
    });
  });

  describe('валидация - пустые поля', () => {
    it('должен показать ошибку если username пустой', async () => {
      renderLoginPage();
      await userEvent.click(screen.getByRole('button', { name: 'auth.login' }));
      const errors = await screen.findAllByText('auth.required');
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });

    it('должен показать ошибку для обоих полей если оба пустые', async () => {
      renderLoginPage();
      await userEvent.click(screen.getByRole('button', { name: 'auth.login' }));
      const errors = await screen.findAllByText('auth.required');
      expect(errors).toHaveLength(2);
    });

    it('должен показать ошибку минимальной длины пароля', async () => {
      renderLoginPage();
      await userEvent.type(screen.getByLabelText('auth.username'), 'emilys');
      await userEvent.type(screen.getByLabelText('auth.password'), '123');
      await userEvent.click(screen.getByRole('button', { name: 'auth.login' }));
      expect(await screen.findByText('auth.passwordMinLength')).toBeInTheDocument();
    });
  });

  describe('валидация - исчезновение ошибки', () => {
    it('должен убрать ошибку username после ввода текста', async () => {
      renderLoginPage();
      await userEvent.click(screen.getByRole('button', { name: 'auth.login' }));
      expect(await screen.findAllByText('auth.required')).toHaveLength(2);
      await userEvent.type(screen.getByLabelText('auth.username'), 'emilys');
      await waitFor(() => {
        expect(screen.queryAllByText('auth.required')).toHaveLength(1);
      });
    });
  });

  describe('успешный логин', () => {
    it('должен вызвать login с введёнными данными', async () => {
      mockLogin.mockResolvedValue({
        data: {
          id: 1,
          username: 'emilys',
          email: 'e@e.com',
          firstName: 'Emily',
          lastName: 'Johnson',
          gender: 'female',
          image: '',
          accessToken: 'token',
          refreshToken: 'refresh',
        },
      });
      mockLogin.mockReturnValue({
        unwrap: () =>
          Promise.resolve({
            id: 1,
            username: 'emilys',
            email: 'e@e.com',
            firstName: 'Emily',
            lastName: 'Johnson',
            gender: 'female',
            image: '',
            accessToken: 'token',
            refreshToken: 'refresh',
          }),
      });

      renderLoginPage();
      await userEvent.type(screen.getByLabelText('auth.username'), 'emilys');
      await userEvent.type(screen.getByLabelText('auth.password'), 'emilyspass');
      await userEvent.click(screen.getByRole('button', { name: 'auth.login' }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: 'emilys',
          password: 'emilyspass',
          expiresInMins: 60,
        });
      });
    });

    it('должен перенаправить на / после успешного входа', async () => {
      mockLogin.mockReturnValue({
        unwrap: () =>
          Promise.resolve({
            id: 1,
            username: 'emilys',
            email: 'e@e.com',
            firstName: 'Emily',
            lastName: 'Johnson',
            gender: 'female',
            image: '',
            accessToken: 'token',
            refreshToken: 'refresh',
          }),
      });

      renderLoginPage();
      await userEvent.type(screen.getByLabelText('auth.username'), 'emilys');
      await userEvent.type(screen.getByLabelText('auth.password'), 'emilyspass');
      await userEvent.click(screen.getByRole('button', { name: 'auth.login' }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('ошибка логина', () => {
    it('должен показать общую ошибку при неверных данных', async () => {
      mockLogin.mockReturnValue({ unwrap: () => Promise.reject(new Error('Unauthorized')) });

      renderLoginPage();
      await userEvent.type(screen.getByLabelText('auth.username'), 'wronguser');
      await userEvent.type(screen.getByLabelText('auth.password'), 'wrongpass');
      await userEvent.click(screen.getByRole('button', { name: 'auth.login' }));

      expect(await screen.findByText('auth.loginError')).toBeInTheDocument();
    });
  });
});
