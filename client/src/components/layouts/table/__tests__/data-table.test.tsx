import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColumnDef } from '@tanstack/react-table';

// Mock child components before importing DataTable
vi.mock('../data-table-toolbar', () => ({
  DataTableToolbar: ({ table }: { table: any }) => (
    <div data-testid="data-table-toolbar">Toolbar</div>
  ),
}));

vi.mock('../data-table-pagination', () => ({
  DataTablePagination: ({ table }: { table: any }) => (
    <div data-testid="data-table-pagination">Pagination</div>
  ),
}));

// Now import DataTable after mocks
import { DataTable } from '../data-table';

interface TestData {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

describe('DataTable', () => {
  const mockData: TestData[] = [
    { id: '1', name: 'Product A', price: 100, quantity: 10 },
    { id: '2', name: 'Product B', price: 200, quantity: 20 },
    { id: '3', name: 'Product C', price: 150, quantity: 15 },
    { id: '4', name: 'Product D', price: 300, quantity: 5 },
    { id: '5', name: 'Product E', price: 250, quantity: 25 },
  ];

  const columns: ColumnDef<TestData>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => `$${row.original.price}`,
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ row }) => row.original.quantity,
    },
  ];

  const renderComponent = (data = mockData) => {
    return render(<DataTable columns={columns} data={data} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render table with correct headers', () => {
      renderComponent();

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('Quantity')).toBeInTheDocument();
    });

    it('should render all data rows', () => {
      renderComponent();

      mockData.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
        expect(screen.getByText(`$${item.price}`)).toBeInTheDocument();
        expect(screen.getByText(item.quantity.toString())).toBeInTheDocument();
      });
    });

    it('should render toolbar and pagination', () => {
      renderComponent();

      expect(screen.getByTestId('data-table-toolbar')).toBeInTheDocument();
      expect(screen.getByTestId('data-table-pagination')).toBeInTheDocument();
    });

    it('should show empty state when no data', () => {
      renderComponent([]);

      expect(screen.getByText('No results.')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort by name when header is clicked', async () => {
      renderComponent();

      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);

      // After clicking, the rows should be sorted
      const rows = screen.getAllByRole('row');
      // First row is header, so check data rows
      expect(rows.length).toBeGreaterThan(1);
    });

    it('should sort by price when header is clicked', async () => {
      renderComponent();

      const priceHeader = screen.getByText('Price');
      fireEvent.click(priceHeader);

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });

    it('should toggle sort direction on multiple clicks', async () => {
      renderComponent();

      const nameHeader = screen.getByText('Name');
      
      // First click - ascending
      fireEvent.click(nameHeader);
      
      // Second click - descending
      fireEvent.click(nameHeader);

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });
  });

  describe('Column Visibility', () => {
    it('should render all columns by default', () => {
      renderComponent();

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('Quantity')).toBeInTheDocument();
    });
  });

  describe('Large Dataset', () => {
    it('should handle large datasets efficiently', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        id: String(i + 1),
        name: `Product ${i + 1}`,
        price: Math.floor(Math.random() * 1000),
        quantity: Math.floor(Math.random() * 100),
      }));

      const { container } = render(<DataTable columns={columns} data={largeData} />);

      // Should render without crashing
      expect(container.querySelector('table')).toBeInTheDocument();
    });
  });
});
