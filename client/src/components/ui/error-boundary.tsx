import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/logger';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches React component errors and logs them
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    logger.error(
      'React Error Boundary Caught Error',
      error,
      {
        componentStack: errorInfo.componentStack,
      }
    );

    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
          <div className="flex flex-col items-center gap-4 max-w-md">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Something went wrong
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.errorInfo?.componentStack && (
              <details className="w-full text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  View error details
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <Button onClick={this.handleRetry} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple error fallback component for inline use
 */
export function ErrorFallback({ 
  error, 
  resetError 
}: { 
  error?: Error; 
  resetError?: () => void 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {error?.message || 'An error occurred'}
      </p>
      {resetError && (
        <Button variant="outline" size="sm" onClick={resetError}>
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
}
