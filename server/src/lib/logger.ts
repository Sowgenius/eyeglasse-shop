/**
 * Simple logging utility for the server
 * Uses structured JSON logging for production compatibility
 */

// Log levels enum
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Get current log level from environment
const getLogLevel = (): LogLevel => {
  const env = process.env.NODE_ENV || 'development';
  const debug = process.env.DEBUG === 'true';
  
  if (env === 'production') {
    return LogLevel.INFO;
  }
  if (debug) {
    return LogLevel.DEBUG;
  }
  return LogLevel.INFO;
};

const currentLevel = getLogLevel();

// Color codes for console output (development only)
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
};

const levelLabels: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
};

/**
 * Format metadata for display
 */
const formatMetadata = (meta?: any): string => {
  if (!meta) return '';
  if (typeof meta === 'string') return meta;
  
  try {
    // Filter out sensitive data
    const safeMeta = { ...meta };
    delete safeMeta.password;
    delete safeMeta.token;
    delete safeMeta.authorization;
    delete safeMeta.body?.password;
    delete safeMeta.body?.token;
    
    return JSON.stringify(safeMeta);
  } catch {
    return String(meta);
  }
};

/**
 * Create formatted timestamp
 */
const getTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Core logging function
 */
function log(level: LogLevel, message: string, meta?: any): void {
  if (level < currentLevel) return;
  
  const isProduction = process.env.NODE_ENV === 'production';
  const timestamp = getTimestamp();
  const levelLabel = levelLabels[level];
  
  if (isProduction) {
    // Production: JSON structured logging
    const logEntry = {
      timestamp,
      level: levelLabel,
      message,
      ...(meta && { metadata: meta }),
      service: 'eyeglasse-api',
      environment: process.env.NODE_ENV || 'development',
    };
    console.log(JSON.stringify(logEntry));
  } else {
    // Development: Human-readable colored output
    const color = level === LogLevel.ERROR ? colors.red 
      : level === LogLevel.WARN ? colors.yellow 
      : level === LogLevel.INFO ? colors.green 
      : colors.gray;
    
    const metaStr = formatMetadata(meta);
    const metaPart = metaStr ? ` ${metaStr}` : '';
    console.log(`${colors.gray}${timestamp}${colors.reset} ${color}${levelLabel}${colors.reset} ${message}${metaPart}`);
  }
}

/**
 * Logger API
 */
export const logger = {
  debug: (message: string, meta?: any) => log(LogLevel.DEBUG, message, meta),
  info: (message: string, meta?: any) => log(LogLevel.INFO, message, meta),
  warn: (message: string, meta?: any) => log(LogLevel.WARN, message, meta),
  error: (message: string, meta?: any) => log(LogLevel.ERROR, message, meta),
};

/**
 * Create a child logger with predefined context
 */
export const createLogger = (module: string) => {
  return {
    debug: (message: string, meta?: any) => logger.debug(message, { module, ...meta }),
    info: (message: string, meta?: any) => logger.info(message, { module, ...meta }),
    warn: (message: string, meta?: any) => logger.warn(message, { module, ...meta }),
    error: (message: string, meta?: any) => logger.error(message, { module, ...meta }),
  };
};

/**
 * Log HTTP requests
 */
export const logHttpRequest = (req: any, res: any, duration: number) => {
  const statusLevel = res.statusCode >= 500 ? LogLevel.ERROR 
    : res.statusCode >= 400 ? LogLevel.WARN 
    : LogLevel.INFO;
  
  logger[levelLabels[statusLevel].toLowerCase() as keyof typeof logger](
    `${req.method} ${req.originalUrl || req.url}`,
    {
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
      userId: req.jwtPayload?.userId,
      method: req.method,
      url: req.originalUrl || req.url,
    }
  );
};

/**
 * Log database queries (only in debug mode)
 */
export const logQuery = (query: string, duration: number, params?: any) => {
  logger.debug('Database Query', {
    query: query.substring(0, 200), // Truncate long queries
    duration: `${duration}ms`,
    params: params ? `${params.length} params` : undefined,
  });
};

/**
 * Log errors with stack trace
 */
export const logError = (error: Error, context?: any) => {
  logger.error(error.message, {
    stack: error.stack,
    ...context,
  });
};

export default logger;
