import { useEffect, useState } from 'react';
import { logger, errorLogStore, ErrorLogEntry } from '@/lib/logger';

/**
 * Global error handlers for uncaught errors and unhandled promise rejections
 */
export function setupGlobalErrorHandlers() {
  if (typeof window === 'undefined') return;

  // Handle uncaught errors
  window.onerror = (message, source, lineno, colno, error) => {
    logger.error(
      `Uncaught Error: ${message}`,
      error,
      {
        source,
        lineno,
        colno,
        filename: source,
      }
    );
    
    // Don't prevent default - let the error bubble up
    return false;
  };

  // Handle unhandled promise rejections
  window.onunhandledrejection = (event) => {
    logger.error(
      'Unhandled Promise Rejection',
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      {
        reason: event.reason,
      }
    );
  };

  logger.debug('Global error handlers initialized');
}

/**
 * Hook to access error logs in components
 */
export function useErrorLogs(limit = 10): ErrorLogEntry[] {
  const [logs, setLogs] = useState<ErrorLogEntry[]>([]);

  useEffect(() => {
    // Initial load
    setLogs(errorLogStore.getErrors().slice(0, limit));

    // Subscribe to updates
    const unsubscribe = errorLogStore.subscribe(() => {
      setLogs(errorLogStore.getErrors().slice(0, limit));
    });

    return unsubscribe;
  }, [limit]);

  return logs;
}

/**
 * Hook for component-level error handling
 */
export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = (err: Error | string, context?: Record<string, any>) => {
    const errorObj = typeof err === 'string' ? new Error(err) : err;
    logger.error('Component Error', errorObj, context);
    setError(errorObj);
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
}
