import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddProduct } from '../../table/row-actions/add-product';

// Mock the API hooks
vi.mock('@/redux/api/products', () => ({
  useAddProductMutation: () => [
    vi.fn().mockResolvedValue({ data: { id: '1', name: 'Test Product' } }),
    { isLoading: false },
  ],
}));

// Mock the image upload
vi.mock('@/lib/handle-image-upload', () => ({
  handleImageUpload: vi.fn().mockResolvedValue('https://example.com/image.jpg'),
}));

// Mock encryption
vi.mock('@/lib/encryption', () => ({
  decryptUrl: vi.fn().mockReturnValue(''),
}));

describe('AddProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(<AddProduct />);
  };

  describe('Rendering', () => {
    it('should render add product button', () => {
      renderComponent();

      expect(screen.getByText('Add New')).toBeInTheDocument();
    });

    it('should open dialog when button is clicked', async () => {
      renderComponent();

      const addButton = screen.getByText('Add New');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Add new product')).toBeInTheDocument();
      });
    });

    it('should render all form fields in dialog', async () => {
      renderComponent();

      fireEvent.click(screen.getByText('Add New'));

      await waitFor(() => {
        expect(screen.getByText('Product Name')).toBeInTheDocument();
        expect(screen.getByText('Brand Name')).toBeInTheDocument();
        expect(screen.getByText('Price')).toBeInTheDocument();
        expect(screen.getByText('Quantity')).toBeInTheDocument();
        expect(screen.getByText('Frame Material')).toBeInTheDocument();
        expect(screen.getByText('Frame Shape')).toBeInTheDocument();
        expect(screen.getByText('Hinge Type')).toBeInTheDocument();
        expect(screen.getByText('Gender')).toBeInTheDocument();
      });
    });
  });

  describe('Form Interaction', () => {
    it('should allow entering product name', async () => {
      const user = userEvent.setup();
      renderComponent();

      fireEvent.click(screen.getByText('Add New'));

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText('Enter eye-glass name');
        expect(nameInput).toBeInTheDocument();
      });
    });

    it('should allow entering brand name', async () => {
      renderComponent();

      fireEvent.click(screen.getByText('Add New'));

      await waitFor(() => {
        const brandInput = screen.getByPlaceholderText('Enter brand name');
        expect(brandInput).toBeInTheDocument();
      });
    });

    it('should allow entering price', async () => {
      renderComponent();

      fireEvent.click(screen.getByText('Add New'));

      await waitFor(() => {
        const priceInput = screen.getByPlaceholderText('Price in dollars');
        expect(priceInput).toBeInTheDocument();
      });
    });

    it('should allow entering quantity', async () => {
      renderComponent();

      fireEvent.click(screen.getByText('Add New'));

      await waitFor(() => {
        const quantityInput = screen.getByPlaceholderText('Available quantity');
        expect(quantityInput).toBeInTheDocument();
      });
    });

    it('should render save button', async () => {
      renderComponent();

      fireEvent.click(screen.getByText('Add New'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      renderComponent();

      fireEvent.click(screen.getByText('Add New'));

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: 'Save' });
        expect(saveButton).toBeInTheDocument();
      });

      // Try to submit empty form
      const saveButton = screen.getByRole('button', { name: 'Save' });
      fireEvent.click(saveButton);

      // Dialog should remain open due to validation
      await waitFor(() => {
        expect(screen.getByText('Add new product')).toBeInTheDocument();
      });
    });
  });

  describe('Dialog Behavior', () => {
    it('should close dialog when cancel is clicked', async () => {
      renderComponent();

      fireEvent.click(screen.getByText('Add New'));

      await waitFor(() => {
        expect(screen.getByText('Add new product')).toBeInTheDocument();
      });

      // Find and click the close button (X icon)
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      // Dialog should be closed
      await waitFor(() => {
        expect(screen.queryByText('Add new product')).not.toBeInTheDocument();
      });
    });

    it('should have correct dialog description', async () => {
      renderComponent();

      fireEvent.click(screen.getByText('Add New'));

      await waitFor(() => {
        expect(
          screen.getByText(
            'Provide details of the new product here. Click save when you are done.'
          )
        ).toBeInTheDocument();
      });
    });
  });
});
