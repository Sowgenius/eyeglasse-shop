import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DashboardProducts from '@/pages/dashboard/products';
import { ProductWithStock } from '@/redux/api/products';

vi.mock('@/redux/api/products', () => ({
  useProductsQuery: vi.fn(),
  ProductWithStock: {},
}));

vi.mock('@/components/layouts/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/layouts/table/data-table', () => ({
  DataTable: () => <div>DataTable</div>,
}));

describe('DashboardProducts', () => {
  it('renders without crashing', () => {
    const store = configureStore({
      reducer: {
        [require('@/redux/api').baseApi.reducerPath]: require('@/redux/api').baseApi.reducer,
      },
    });

    render(
      <Provider store={store}>
        <DashboardProducts />
      </Provider>
    );
  });
});
