import { baseApi } from '@/shared/api/baseApi';
import type { AuthResponse, LoginRequest, User } from '@/shared/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useGetMeQuery } = authApi;
