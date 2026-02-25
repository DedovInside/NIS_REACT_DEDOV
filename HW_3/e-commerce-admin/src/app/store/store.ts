import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from '@/shared/api/baseApi';
import authReducer from '@/entities/user/model/authSlice';
import settingsReducer from '@/features/settings/model/settingsSlice';
import { saveState } from '@/shared/lib/localStorage';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    settings: settingsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
});

store.subscribe(() => {
  const state = store.getState();
  saveState('settings', state.settings);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
