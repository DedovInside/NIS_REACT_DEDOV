import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store/store';

export const selectTheme = (state: RootState) => state.settings.theme;
export const selectLanguage = (state: RootState) => state.settings.language;
export const selectPageSize = (state: RootState) => state.settings.pageSize;

export const selectAllSettings = createSelector(
  selectTheme,
  selectLanguage,
  selectPageSize,
  (theme, language, pageSize) => ({ theme, language, pageSize }),
);
