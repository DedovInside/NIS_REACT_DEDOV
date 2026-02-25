import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store/store';

export const selectToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;

export const selectIsAuthenticated = createSelector(selectToken, token => !!token);

export const selectUserDisplayName = createSelector(selectCurrentUser, user =>
  user ? `${user.firstName} ${user.lastName}` : null,
);
