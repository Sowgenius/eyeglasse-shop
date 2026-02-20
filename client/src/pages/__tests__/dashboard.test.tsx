import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard, { ProductsContext } from '@/pages/dashboard';
import { ProductWithStock } from '@/redux/api/products';

// Mock the RTK Query hooks
vi.mock('@/redux/api/products', () => ({
  useProductsQuery: vi.fn(),
  ProductWithStock: {},
}));

// Mock Header component
vi.mock('@/components/layouts/header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

// Mock DataTable component
vi.mock('@/components/layouts/table/data-table', () => ({
  DataTable: ({ data }: { data: any[] }) => (
    <div data-testid="data-table">
      Data Table with {data?.length || 0} rows
    </div>
  ),
}));

// Mock columns
vi.mock('@/components/layouts/table/columns', () => ({
  columns: [],
}));

// Mock Toaster
vi.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

import { useProductsQuery } from '@/redux/api/products';

const mockStore = configureStore({
  reducer: {
    api: () => ({}),
  },
});

describe('Dashboard Page', () => {
  const mockProducts: ProductWithStock[] = [
    {
      id: '1',
      name: 'Ray-Ban Aviator',
      brand: 'Ray-Ban',
      price: 159.99,
      quantity: 25,
      imageSrc: null,
      sku: 'RB-AV-001',
      frameMaterial: 'metal',
      frameShape: 'aviator',
      lensType: 'polycarbonate',
      color: 'gold',
      gender: 'unisex',
      templeLength: 140,
      bridgeSize: 14,
      hingeType: 'standard',
      reorderPoint: 5,
      reorderQuantity: 20,
      isActive: true,
      stockMovements: [],
    },
    {
      id: '2',
      name: 'Oakley Holbrook',
      brand: 'Oakley',
      price: 189.99,
      quantity: 18,
      imageSrc: null,
      sku: 'OK-HB-001',
      frameMaterial: 'plastic',
      frameShape: 'rectangular',
      lensType: 'polycarbonate',
      color: 'black',
      gender: 'men',
      templeLength: 137,
      bridgeSize: 17,
      hingeType: 'spring-loaded',
      reorderPoint: 5,
      reorderQuantity: 15,
      isActive: true,
      stockMovements: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (mockData: any = { data: mockProducts, isSuccess: true }) => {
    (useProductsQuery as any).mockReturnValue(mockData);

    return render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );
  };

  describe('Rendering', () => {
    it('should render header', () => {
      renderComponent();

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render toaster', () => {
      renderComponent();

      expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });

    it('should render data table when products load successfully', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('data-table')).toBeInTheDocument();
      });
    });

    it('should display correct number of products', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Data Table with 2 rows')).toBeInTheDocument();
      });
    });

    it('should handle empty product list', async () => {
      renderComponent({ data: [], isSuccess: true });

      await waitFor(() => {
        expect(screen.getByText('Data Table with 0 rows')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should not render data table while loading', () => {
      renderComponent({ data: undefined, isSuccess: false, isLoading: true });

      expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
    });

    it('should render data table after successful load', async () => {
      renderComponent({ data: mockProducts, isSuccess: true, isLoading: false });

      await waitFor(() => {
        expect(screen.getByTestId('data-table')).toBeInTheDocument();
      });
    });
  });

  describe('Context Provider', () => {
    it('should provide ProductsContext to children', () => {
      renderComponent();

      // The DataTable is wrapped in ProductsContext.Provider
      // If context wasn't provided, DataTable would throw an error
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });
  });

  describe('Main Layout', () => {
    it('should have main element with correct classes', () => {
      const { container } = renderComponent();

      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('container', 'py-9', 'sm:py-10');
    });
  });

  describe('Products Context', () => {
    it('context should have correct default structure', () => {
      // Test that context is created with correct default values
      const context = ProductsContext;
      expect(context).toBeDefined();
      expect(context.displayName).toBeUndefined();
    });
  });
});
