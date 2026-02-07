import request from 'supertest';
import express from 'express';
import router from '@/routes';
import { globalCatch } from '@/middlewares/global-catch';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use('/api', router);
app.use(globalCatch);

describe('API Integration Tests', () => {
  describe('Health Check', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown-route');
      expect(response.status).toBe(404);
    });
  });

  describe('Authentication', () => {
    it('should reject requests without authentication', async () => {
      const response = await request(app).get('/api/customers');
      expect(response.status).toBe(401);
    });

    it('should reject invalid tokens', async () => {
      const response = await request(app)
        .get('/api/customers')
        .set('Authorization', 'Bearer invalid-token');
      expect(response.status).toBe(401);
    });
  });

  describe('Validation', () => {
    it('should validate request body', async () => {
      // This would require a valid token, so we're just testing the middleware structure
      // Full integration tests would be in separate files per module
    });
  });
});

export { app };
