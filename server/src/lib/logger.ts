import winston from 'winston';
import { env } from '@config';

/**
 * Custom format for colorized console output (development)
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    const metaStr = Object.keys(metadata).length > 0 
      ? ` ${JSON.stringify(metadata, null, 0)}` 
      : '';
    return `${timestamp} ${level}: ${message}${metaStr}`;
  })
);

/**
 * JSON format for production
 */
const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Create logger instance
 */
export const logger = winston.createLogger({
  level: env.DEBUG ? 'debug' : 'info',
  format: jsonFormat,
  defaultMeta: { 
    service: 'eyeglasse-api',
    environment: env.NODE_ENV,
  },
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

/**
 * Create child logger with module context
 */
export const createLogger = (module: string) => {
  return logger.child({ module });
};

/**
 * HTTP request logging
 */
export const logHttpRequest = (req: any, res: any, duration: number) => {
  const logData = {
    method: req.method,
    url: req.originalUrl || req.url,
    status: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.get('user-agent'),
    userId: req.jwtPayload?.userId,
  };

  if (res.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl || req.url}`, logData);
  } else if (res.statusCode >= 400) {
    logger.warn(`${req.method} ${req.originalUrl || req.url}`, logData);
  } else {
    logger.http(`${req.method} ${req.originalUrl || req.url}`, logData);
  }
};

/**
 * Database query logging
 */
export const logQuery = (query: string, duration: number, params?: any) => {
  logger.debug('Database Query', {
    query: query.substring(0, 200),
    duration: `${duration}ms`,
    paramsCount: params?.length,
  });
};

/**
 * Error logging with context
 */
export const logError = (error: Error, context?: any) => {
  logger.error(error.message, {
    stack: error.stack,
    ...context,
  });
};

export default logger;
