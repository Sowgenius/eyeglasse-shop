import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginForm } from '@/components/layouts/form/login-form';

vi.mock('@/redux/api/auth', () => ({
  useLoginMutation: () => [
    vi.fn(),
    { isLoading: false },
  ],
}));

vi.mock('js-cookie', () => ({}));

vi.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('LoginForm', () => {
  const mockStore = configureStore({
    reducer: {
      auth: () => ({ isAuthenticated: false }),
    },
  });

  it('should render component without errors', () => {
    expect(() =>
      render(
        <Provider store={mockStore}>
          <LoginForm setError={() => {}} />
        </Provider>
      )
    ).not.toThrow();
  });
});
