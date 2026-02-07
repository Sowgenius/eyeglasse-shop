import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginForm } from '@/components/layouts/form/login-form';

// Mock the API hooks
vi.mock('@/redux/api/auth', () => ({
  useLoginMutation: () => [
    vi.fn().mockResolvedValue({ data: { user: { id: '1', name: 'Test' }, token: 'test-token' } }),
    { isLoading: false },
  ],
}));

vi.mock('js-cookie', () => ({
  default: {
    set: vi.fn(),
  },
}));

describe('LoginForm', () => {
  const mockStore = configureStore({
    reducer: {},
  });

  const renderComponent = () => {
    return render(
      <Provider store={mockStore}>
        <LoginForm />
      </Provider>
    );
  };

  it('should render login form correctly', () => {
    renderComponent();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });
});
