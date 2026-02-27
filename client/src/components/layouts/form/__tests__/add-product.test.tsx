import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AddProduct } from '../../table/row-actions/add-product';

vi.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/redux/api/products', () => ({
  useAddProductMutation: () => [
    vi.fn(),
    { isLoading: false },
  ],
}));

vi.mock('@/lib/handle-image-upload', () => ({
  handleImageUpload: vi.fn(),
}));

describe('AddProduct', () => {
  it('should render component', () => {
    expect(() => render(<AddProduct />)).not.toThrow();
  });
});
