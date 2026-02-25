import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { loadState } from '@/shared/lib/localStorage';

export type Theme = 'light' | 'dark';
export type Language = 'ru' | 'en';

interface SettingsState {
  theme: Theme;
  language: Language;
  pageSize: number;
}

const persistedSettings = loadState<SettingsState>('settings');

const initialState: SettingsState = {
  theme: persistedSettings?.theme ?? 'light',
  language: persistedSettings?.language ?? 'ru',
  pageSize: persistedSettings?.pageSize ?? 10,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
  },
});

export const { setTheme, setLanguage, setPageSize } = settingsSlice.actions;
export default settingsSlice.reducer;
