import { baseApi } from '.';

export interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalInvoices: number;
  todayRevenue: number;
  pendingInvoices: number;
  overdueInvoices: number;
  lowStockProducts: number;
}

export interface SalesReport {
  invoices: any[];
  summary: {
    totalSales: number;
    totalPaid: number;
    totalInvoices: number;
  };
}

export const reportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardStats: build.query<DashboardStats, void>({
      query: () => '/reports/dashboard',
      transformResponse: (res: { data: DashboardStats }) => res.data,
      providesTags: ['dashboard'],
    }),
    getSalesReport: build.query<SalesReport, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/reports/sales',
        params,
      }),
      transformResponse: (res: { data: SalesReport }) => res.data,
    }),
    getProductPerformance: build.query<any, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/reports/products',
        params,
      }),
      transformResponse: (res: { data: any }) => res.data,
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSalesReportQuery,
  useGetProductPerformanceQuery,
} = reportApi;
