import { SERVER_DOMAIN } from '@/config';
import { User } from '@/types/user';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_DOMAIN,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = Cookies.get('token');

      if (token) {
        headers.set('authorization', token);
      }

      return headers;
    },
  }),
  tagTypes: [
    'products',
    'profile',
    'customers',
    'quotes',
    'invoices',
    'prescriptions',
    'reports',
    'dashboard'
  ],
  endpoints: (build) => ({
    profile: build.query<User, void>({
      query: () => '/profile',
      transformResponse: (res: { data: User }) => res.data,
      providesTags: ['profile'],
    }),
  }),
});

export const { useProfileQuery } = baseApi;
