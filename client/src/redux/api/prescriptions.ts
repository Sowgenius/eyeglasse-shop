import { baseApi } from '.';

export interface Prescription {
  id: string;
  customerId: string;
  prescriptionDate: string;
  expiryDate?: string;
  prescribedBy?: string;
  odSph?: string;
  odCyl?: string;
  odAxis?: string;
  odAdd?: string;
  odPd?: string;
  osSph?: string;
  osCyl?: string;
  osAxis?: string;
  osAdd?: string;
  osPd?: string;
  nearPd?: string;
  lensTypeRecommended?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    firstName: string;
    lastName: string;
  };
}

export interface CreatePrescriptionData {
  customerId: string;
  prescriptionDate: string;
  expiryDate?: string;
  prescribedBy?: string;
  odSph?: string;
  odCyl?: string;
  odAxis?: string;
  odAdd?: string;
  odPd?: string;
  osSph?: string;
  osCyl?: string;
  osAxis?: string;
  osAdd?: string;
  osPd?: string;
  nearPd?: string;
  lensTypeRecommended?: string;
  notes?: string;
}

export interface PrescriptionListResponse {
  data: Prescription[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const prescriptionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPrescriptions: build.query<PrescriptionListResponse, { page?: number; limit?: number; customerId?: string; expiringSoon?: boolean }>({
      query: (params) => ({
        url: '/prescriptions',
        params,
      }),
      transformResponse: (res: { data: PrescriptionListResponse }) => res.data,
      providesTags: ['prescriptions'],
    }),
    getPrescription: build.query<Prescription, string>({
      query: (id) => `/prescriptions/${id}`,
      transformResponse: (res: { data: Prescription }) => res.data,
      providesTags: (result, error, id) => [{ type: 'prescriptions', id }],
    }),
    createPrescription: build.mutation<Prescription, CreatePrescriptionData>({
      query: (data) => ({
        url: '/prescriptions',
        method: 'POST',
        body: data,
      }),
      transformResponse: (res: { data: Prescription }) => res.data,
      invalidatesTags: ['prescriptions'],
    }),
    updatePrescription: build.mutation<Prescription, { id: string; data: Partial<CreatePrescriptionData> }>({
      query: ({ id, data }) => ({
        url: `/prescriptions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: { data: Prescription }) => res.data,
      invalidatesTags: (result, error, { id }) => [{ type: 'prescriptions', id }, 'prescriptions'],
    }),
    deletePrescription: build.mutation<void, string>({
      query: (id) => ({
        url: `/prescriptions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['prescriptions'],
    }),
  }),
});

export const {
  useGetPrescriptionsQuery,
  useGetPrescriptionQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
} = prescriptionApi;
