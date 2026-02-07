import { Product } from '@/types/product';
import { Params } from '@/types/query-params';
import { baseApi } from '.';

export interface ProductWithStock extends Product {
  sku: string;
  costPrice?: number;
  reorderPoint: number;
  reorderQuantity: number;
  frameMaterial: string;
  frameShape: string;
  lensType: string;
  color: string;
  gender: string;
  templeLength: number;
  bridgeSize: number;
  hingeType: string;
  supplierName?: string;
  supplierContact?: string;
  location?: string;
  isActive: boolean;
  stockMovements?: {
    id: string;
    type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';
    quantity: number;
    previousStock: number;
    newStock: number;
    reason?: string;
    createdAt: string;
  }[];
}

export interface CreateProductData {
  name: string;
  sku: string;
  description?: string;
  imageSrc?: string;
  brand: string;
  price: number;
  costPrice?: number;
  quantity: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  frameMaterial: string;
  frameShape: string;
  lensType: string;
  color: string;
  gender: string;
  templeLength: number;
  bridgeSize: number;
  hingeType: string;
  supplierName?: string;
  supplierContact?: string;
  location?: string;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    products: build.query<ProductWithStock[], Params | undefined>({
      query: (params) => ({ url: '/products', method: 'GET', params }),
      transformResponse: (res: { data: ProductWithStock[] }) => res.data,
      providesTags: ['products'],
    }),
    getProduct: build.query<ProductWithStock, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (res: { data: ProductWithStock }) => res.data,
      providesTags: (result, error, id) => [{ type: 'products', id }],
    }),
    addProduct: build.mutation({
      query: (body: CreateProductData) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      transformResponse: (res: { data: ProductWithStock }) => res.data,
      invalidatesTags: ['products'],
    }),
    updateProduct: build.mutation<
      ProductWithStock,
      { id: string; body: Partial<CreateProductData> }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (res: { data: ProductWithStock }) => res.data,
      invalidatesTags: (result, error, { id }) => [{ type: 'products', id }, 'products'],
    }),
    deleteProduct: build.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['products'],
    }),
    bulkDelete: build.mutation({
      query: (productIds: string[]) => ({
        url: '/products/bulk-delete',
        method: 'DELETE',
        body: { productIds },
      }),
      invalidatesTags: ['products'],
    }),
    getLowStock: build.query<ProductWithStock[], void>({
      query: () => '/products/low-stock',
      transformResponse: (res: { data: ProductWithStock[] }) => res.data,
      providesTags: ['products'],
    }),
  }),
});

export const {
  useProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useBulkDeleteMutation,
  useDeleteProductMutation,
  useGetLowStockQuery,
} = productsApi;
