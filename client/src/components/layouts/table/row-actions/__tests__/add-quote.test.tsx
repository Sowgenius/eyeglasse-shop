import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AddQuote } from '../add-quote';

vi.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/redux/api/quotes', () => ({
  useCreateQuoteMutation: () => [
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

describe('AddQuote', () => {
  it('should render add quote button', () => {
    render(<AddQuote />);
    expect(screen.getByText('quotes.addQuote')).toBeInTheDocument();
  });

  it('should render button', () => {
    render(<AddQuote />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
