import { env } from '@config';
import app from './app';

(async function () {
  try {
    app.listen(env.PORT, () => {
      console.log(`🚀 Server listening on port ${env.PORT}`);
      console.log(`📚 API Documentation: http://localhost:${env.PORT}/api/health`);
      console.log(`🔧 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();
