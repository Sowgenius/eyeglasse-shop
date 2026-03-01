import { globalCatch } from '@middlewares/global-catch';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config';
import router from './routes';
import { requestLogger, debugMiddleware, errorLogger } from './middlewares/request-logger';
import { logger } from './lib/logger';

const app = express();

// Request logging
app.use(requestLogger);

// Debug logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(debugMiddleware);
}

app.use(cookieParser());
app.use(express.json());

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

app.use('/api', router);

// Error logging
app.use(errorLogger);

app.use(globalCatch);

// Startup message
logger.info('Express app initialized', { 
  environment: env.NODE_ENV,
  corsOrigin: env.CLIENT_URL,
});

export default app;
