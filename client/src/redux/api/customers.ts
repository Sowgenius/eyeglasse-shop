import { baseApi } from '.';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  birthDate?: string;
  notes?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    invoices: number;
    quotes: number;
  };
}

export interface CreateCustomerData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  birthDate?: string;
  notes?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

export interface CustomerListResponse {
  data: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomers: build.query<CustomerListResponse, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: '/customers',
        params,
      }),
      transformResponse: (res: { data: CustomerListResponse }) => res.data,
      providesTags: ['customers'],
    }),
    getCustomer: build.query<Customer, string>({
      query: (id) => `/customers/${id}`,
      transformResponse: (res: { data: Customer }) => res.data,
      providesTags: (result, error, id) => [{ type: 'customers', id }],
    }),
    createCustomer: build.mutation<Customer, CreateCustomerData>({
      query: (data) => ({
        url: '/customers',
        method: 'POST',
        body: data,
      }),
      transformResponse: (res: { data: Customer }) => res.data,
      invalidatesTags: ['customers'],
    }),
    updateCustomer: build.mutation<Customer, { id: string; data: Partial<CreateCustomerData> }>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: { data: Customer }) => res.data,
      invalidatesTags: (result, error, { id }) => [{ type: 'customers', id }, 'customers'],
    }),
    deleteCustomer: build.mutation<void, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['customers'],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
