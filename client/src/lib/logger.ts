/**
 * Client-side debug logging utility
 * Can be toggled based on environment
 */

const DEBUG = process.env.NODE_ENV !== 'production';
const LOG_PREFIX = '[Eyeglasse]';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Error log entry for tracking
 */
export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: Error;
  stack?: string;
  context?: Record<string, any>;
  url?: string;
  userAgent?: string;
}

/**
 * Error log store - keeps track of recent errors
 */
class ErrorLogStore {
  private logs: ErrorLogEntry[] = [];
  private maxLogs = 100;
  private listeners: Set<() => void> = new Set();

  add(entry: ErrorLogEntry) {
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
    this.notifyListeners();
  }

  getAll(): ErrorLogEntry[] {
    return [...this.logs];
  }

  getErrors(): ErrorLogEntry[] {
    return this.logs.filter(log => log.level === 'error');
  }

  clear() {
    this.logs = [];
    this.notifyListeners();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export const errorLogStore = new ErrorLogStore();

/**
 * Generate unique error ID
 */
const generateErrorId = (): string => {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format message with timestamp
 */
const formatMessage = (level: LogLevel, message: string, data?: any): string => {
  const timestamp = new Date().toISOString();
  const dataStr = data ? ` ${JSON.stringify(data)}` : '';
  return `${timestamp} ${level.toUpperCase()} ${LOG_PREFIX} ${message}${dataStr}`;
};

/**
 * Core logging function
 */
function log(level: LogLevel, message: string, data?: any): void {
  if (!DEBUG) return;

  const formatted = formatMessage(level, message, data);

  switch (level) {
    case 'debug':
      console.debug(formatted);
      break;
    case 'info':
      console.info(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    case 'error':
      console.error(formatted);
      break;
  }
}

/**
 * Enhanced error logging with stack traces and tracking
 */
export const logger = {
  debug: (message: string, data?: any) => log('debug', message, data),
  info: (message: string, data?: any) => log('info', message, data),
  warn: (message: string, data?: any) => log('warn', message, data),
  
  error: (message: string, errorOrData?: Error | any, context?: Record<string, any>) => {
    // Handle both signatures: error(message, error) and error(message, data)
    let error: Error | undefined;
    let data: any;
    
    if (errorOrData instanceof Error) {
      error = errorOrData;
      data = context;
    } else {
      data = errorOrData;
    }

    // Log to console
    log('error', message, data);
    
    if (error) {
      console.error('Stack trace:', error.stack);
    }

    // Store in error log for tracking
    const entry: ErrorLogEntry = {
      id: generateErrorId(),
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      error,
      stack: error?.stack,
      context: data,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };
    
    errorLogStore.add(entry);
  },

  /**
   * Log API error with full details
   */
  apiError: (url: string, method: string, status: number, error: Error | any, response?: Response) => {
    const message = `API Error: ${method} ${url} - ${status}`;
    
    logger.error(message, error, {
      url,
      method,
      status,
      statusText: response?.statusText,
      ok: response?.ok,
      type: response?.type,
    });
  },

  /**
   * Log validation error
   */
  validationError: (field: string, message: string, value?: any) => {
    logger.error(`Validation Error: ${field}`, { field, message, value });
  },

  /**
   * Log unexpected error
   */
  unexpectedError: (error: Error, context?: Record<string, any>) => {
    logger.error('Unexpected Error', error, context);
  },
};

/**
 * Log API requests
 */
export const logApiRequest = (
  url: string,
  options: RequestInit = {},
  response?: Response,
  error?: Error
) => {
  const logData = {
    url,
    method: options.method || 'GET',
    status: response?.status,
    ok: response?.ok,
    error: error?.message,
  };

  if (error) {
    logger.error(`API Request Failed: ${url}`, logData);
  } else if (response?.ok) {
    logger.info(`API Request: ${url}`, logData);
  } else {
    logger.warn(`API Request Error: ${url}`, logData);
  }
};

/**
 * Log Redux API calls (for RTK Query)
 */
export const logApiCall = (
  baseQueryArgs: any,
  result: any,
  error: any
) => {
  const { url, method } = baseQueryArgs;
  
  if (error) {
    logger.error(`RTK Query Error: ${method} ${url}`, { error: error.message || error });
  } else {
    logger.debug(`RTK Query: ${method} ${url}`, { 
      status: result?.status,
      duration: result?.meta?.response?.headers?.get('x-response-time'),
    });
  }
};

/**
 * Log component mount/unmount for debugging
 */
export const logMount = (componentName: string, props?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.debug(`Mounted: ${componentName}`, props ? { props: typeof props === 'object' ? '[object]' : props } : {});
  }
};

export const logUnmount = (componentName: string) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.debug(`Unmounted: ${componentName}`);
  }
};

export default logger;
