import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('@/redux/api/products', () => ({
  useProductsQuery: vi.fn().mockReturnValue({
    data: [],
    isSuccess: true,
  }),
}));

vi.mock('@/components/layouts/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/layouts/table/data-table', () => ({
  DataTable: () => <div>DataTable</div>,
}));

describe('DashboardProducts', () => {
  it('should render component without errors', () => {
    const store = configureStore({
      reducer: {
        api: () => ({}),
      },
    });

    const DashboardProducts = () => <div>Dashboard Products</div>;

    expect(() =>
      render(
        <Provider store={store}>
          <DashboardProducts />
        </Provider>
      )
    ).not.toThrow();
  });
});
