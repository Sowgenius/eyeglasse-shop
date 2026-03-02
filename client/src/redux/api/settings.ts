import { baseApi } from '.';

export interface Settings {
  appName?: string;
  [key: string]: string | undefined;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSettings: build.query<Settings, void>({
      query: () => '/settings',
      transformResponse: (res: { data: Settings }) => res.data,
    }),
    updateSetting: build.mutation<{ key: string; value: string }, { key: string; value: string }>({
      query: ({ key, value }) => ({
        url: '/settings',
        method: 'PATCH',
        body: { key, value },
      }),
      transformResponse: (res: { data: { key: string; value: string } }) => res.data,
    }),
    updateSettings: build.mutation<Settings, Partial<Settings>>({
      query: (settings) => ({
        url: '/settings/bulk',
        method: 'PATCH',
        body: settings,
      }),
      transformResponse: (res: { data: Settings }) => res.data,
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingMutation,
  useUpdateSettingsMutation,
} = settingsApi;
