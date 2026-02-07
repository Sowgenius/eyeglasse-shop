import { baseApi } from '.';

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  productId?: string;
  product?: {
    name: string;
    sku: string;
  };
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  validUntil?: string;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  convertedToInvoiceId?: string;
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
  };
  items: QuoteItem[];
}

export interface CreateQuoteData {
  customerId: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    productId?: string;
  }[];
  taxRate?: number;
  validUntil?: string;
  notes?: string;
  terms?: string;
}

export interface QuoteListResponse {
  data: Quote[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const quoteApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getQuotes: build.query<QuoteListResponse, { page?: number; limit?: number; status?: string; search?: string }>({
      query: (params) => ({
        url: '/quotes',
        params,
      }),
      transformResponse: (res: { data: QuoteListResponse }) => res.data,
      providesTags: ['quotes'],
    }),
    getQuote: build.query<Quote, string>({
      query: (id) => `/quotes/${id}`,
      transformResponse: (res: { data: Quote }) => res.data,
      providesTags: (result, error, id) => [{ type: 'quotes', id }],
    }),
    createQuote: build.mutation<Quote, CreateQuoteData>({
      query: (data) => ({
        url: '/quotes',
        method: 'POST',
        body: data,
      }),
      transformResponse: (res: { data: Quote }) => res.data,
      invalidatesTags: ['quotes'],
    }),
    updateQuote: build.mutation<Quote, { id: string; data: Partial<CreateQuoteData> & { status?: string } }>({
      query: ({ id, data }) => ({
        url: `/quotes/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: { data: Quote }) => res.data,
      invalidatesTags: (result, error, { id }) => [{ type: 'quotes', id }, 'quotes'],
    }),
    deleteQuote: build.mutation<void, string>({
      query: (id) => ({
        url: `/quotes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['quotes'],
    }),
    sendQuote: build.mutation<Quote, string>({
      query: (id) => ({
        url: `/quotes/${id}/send`,
        method: 'POST',
      }),
      transformResponse: (res: { data: Quote }) => res.data,
      invalidatesTags: (result, error, id) => [{ type: 'quotes', id }, 'quotes'],
    }),
  }),
});

export const {
  useGetQuotesQuery,
  useGetQuoteQuery,
  useCreateQuoteMutation,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
  useSendQuoteMutation,
} = quoteApi;
