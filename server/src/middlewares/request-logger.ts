import { Request, Response, NextFunction } from 'express';
import { logHttpRequest, logger } from '../lib/logger';

/**
 * Request logging middleware
 * Logs all HTTP requests with timing information
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Capture original end to log after response
  const originalEnd = res.end;
  
  (res as any).end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - startTime;
    
    // Log the request
    logHttpRequest(req, res, duration);
    
    // Call original end
    originalEnd.call(res, chunk, encoding);
  };
  
  next();
};

/**
 * Debug middleware - logs request details in development
 */
export const debugMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.DEBUG === 'true') {
    logger.debug('Incoming Request', {
      method: req.method,
      url: req.url,
      headers: {
        origin: req.get('origin'),
        referer: req.get('referer'),
        contentType: req.get('content-type'),
      },
      query: req.query,
      body: req.body ? '[body present]' : '[no body]',
    });
  }
  next();
};

/**
 * Error handling middleware
 */
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Request Error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body ? '[body present]' : '[no body]',
  });
  next(err);
};

export default requestLogger;
