import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AddPrescription } from '../add-prescription';

vi.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/redux/api/prescriptions', () => ({
  useCreatePrescriptionMutation: () => [
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

describe('AddPrescription', () => {
  it('should render add prescription button', () => {
    render(<AddPrescription />);
    expect(screen.getByText('prescriptions.addPrescription')).toBeInTheDocument();
  });

  it('should render button', () => {
    render(<AddPrescription />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
