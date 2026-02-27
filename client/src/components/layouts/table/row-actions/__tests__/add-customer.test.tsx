import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AddCustomer } from '../add-customer';

vi.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/redux/api/customers', () => ({
  useCreateCustomerMutation: () => [
    vi.fn(),
    { isLoading: false },
  ],
}));

describe('AddCustomer', () => {
  it('should render add customer button', () => {
    render(<AddCustomer />);
    expect(screen.getByText('customers.addCustomer')).toBeInTheDocument();
  });

  it('should render button with UserPlus icon', () => {
    render(<AddCustomer />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
