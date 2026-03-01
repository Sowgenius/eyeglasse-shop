import { env } from '@config';
import app from './app';
import { logger } from './lib/logger';

(async function () {
  try {
    app.listen(env.PORT, () => {
      logger.info(`🚀 Server listening on port ${env.PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${env.PORT}/api/health`);
      logger.info(`🔧 Environment: ${env.NODE_ENV}`);
      logger.info(`🐛 Debug mode: ${process.env.DEBUG === 'true' ? 'enabled' : 'disabled'}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();
