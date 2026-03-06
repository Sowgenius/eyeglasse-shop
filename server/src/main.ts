import { env } from '@config';
import app from './app';
import { logger } from './lib/logger';
import { prisma } from '@lib/prisma';

(async function () {
  try {
    // Verify database connection before starting
    logger.info('🔌 Checking database connection...');
    await prisma.$queryRaw`SELECT 1`;
    logger.info('✅ Database connected successfully');
    
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
