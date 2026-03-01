/**
 * Client-side debug logging utility
 * Can be toggled based on environment
 */

const DEBUG = process.env.NODE_ENV !== 'production';
const LOG_PREFIX = '[Eyeglasse]';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

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
 * Debug logger API
 */
export const logger = {
  debug: (message: string, data?: any) => log('debug', message, data),
  info: (message: string, data?: any) => log('info', message, data),
  warn: (message: string, data?: any) => log('warn', message, data),
  error: (message: string, data?: any) => log('error', message, data),
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
