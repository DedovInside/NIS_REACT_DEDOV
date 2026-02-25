import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { User, AuthResponse } from '@/shared/types';
import { loadState, saveState, removeState } from '@/shared/lib/localStorage';

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: loadState<string>('token') ?? null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.accessToken;
      state.user = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        gender: action.payload.gender,
        image: action.payload.image,
      };
      saveState('token', action.payload.accessToken);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: state => {
      state.token = null;
      state.user = null;
      removeState('token');
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
