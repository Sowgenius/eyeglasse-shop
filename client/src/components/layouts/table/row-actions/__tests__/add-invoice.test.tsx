import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AddInvoice } from '../add-invoice';

vi.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/redux/api/invoices', () => ({
  useCreateInvoiceMutation: () => [
    vi.fn(),
    { isLoading: false },
  ],
}));

vi.mock('@/redux/api', () => ({
  useGetCustomersQuery: () => ({
    data: { data: [] },
    isLoading: false,
  }),
}));

describe('AddInvoice', () => {
  it('should render add invoice button', () => {
    render(<AddInvoice />);
    expect(screen.getByText('invoices.addInvoice')).toBeInTheDocument();
  });

  it('should render button', () => {
    render(<AddInvoice />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
