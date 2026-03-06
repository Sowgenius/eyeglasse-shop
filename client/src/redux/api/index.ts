import { SERVER_DOMAIN } from '@/config';
import { User } from '@/types/user';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { logger } from '@/lib/logger';

/**
 * Custom base query with error logging
 */
const baseQueryWithLogging = fetchBaseQuery({
  baseUrl: SERVER_DOMAIN,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = Cookies.get('token');

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseApi = createApi({
  baseQuery: async (args, api, extraOptions) => {
    const { url, method } = args;
    const startTime = Date.now();

    try {
      const result = await baseQueryWithLogging(args, api, extraOptions);
      const duration = Date.now() - startTime;

      if (result.error) {
        const error = result.error;
        const status = 'status' in error ? error.status : 500;
        
        logger.apiError(
          url as string,
          method as string,
          typeof status === 'number' ? status : 500,
          error,
          result.error.response as Response
        );
      } else if (!result.data) {
        logger.warn(`Empty response: ${method} ${url}`, { duration });
      } else {
        logger.debug(`API Success: ${method} ${url}`, { status: 200, duration });
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.apiError(
        url as string,
        method as string,
        0,
        error as Error
      );
      throw error;
    }
  },
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
