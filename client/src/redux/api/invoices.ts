import { baseApi } from '.';

export interface InvoiceItem {
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

export interface Payment {
  id: string;
  amount: number;
  method: 'CASH' | 'CHECK' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'INSURANCE' | 'OTHER';
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quoteId?: string;
  customerId: string;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  issueDate: string;
  dueDate: string;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  sentAt?: string;
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
  };
  items: InvoiceItem[];
  payments: Payment[];
  quote?: {
    quoteNumber: string;
  };
}

export interface CreateInvoiceData {
  customerId: string;
  quoteId?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    productId?: string;
  }[];
  taxRate?: number;
  dueDate: string;
  notes?: string;
  terms?: string;
}

export interface CreatePaymentData {
  amount: number;
  method: Payment['method'];
  reference?: string;
  notes?: string;
}

export interface InvoiceListResponse {
  data: Invoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getInvoices: build.query<InvoiceListResponse, { page?: number; limit?: number; status?: string; search?: string }>({
      query: (params) => ({
        url: '/invoices',
        params,
      }),
      transformResponse: (res: { data: InvoiceListResponse }) => res.data,
      providesTags: ['invoices'],
    }),
    getInvoice: build.query<Invoice, string>({
      query: (id) => `/invoices/${id}`,
      transformResponse: (res: { data: Invoice }) => res.data,
      providesTags: (result, error, id) => [{ type: 'invoices', id }],
    }),
    createInvoice: build.mutation<Invoice, CreateInvoiceData>({
      query: (data) => ({
        url: '/invoices',
        method: 'POST',
        body: data,
      }),
      transformResponse: (res: { data: Invoice }) => res.data,
      invalidatesTags: ['invoices', 'products'],
    }),
    updateInvoice: build.mutation<Invoice, { id: string; data: Partial<CreateInvoiceData> }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: { data: Invoice }) => res.data,
      invalidatesTags: (result, error, { id }) => [{ type: 'invoices', id }, 'invoices'],
    }),
    deleteInvoice: build.mutation<void, string>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['invoices', 'products'],
    }),
    addPayment: build.mutation<Invoice, { id: string; data: CreatePaymentData }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}/payments`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (res: { data: Invoice }) => res.data,
      invalidatesTags: (result, error, { id }) => [{ type: 'invoices', id }, 'invoices'],
    }),
    getOverdueInvoices: build.query<Invoice[], void>({
      query: () => '/invoices/overdue',
      transformResponse: (res: { data: Invoice[] }) => res.data,
      providesTags: ['invoices'],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useAddPaymentMutation,
  useGetOverdueInvoicesQuery,
} = invoiceApi;
