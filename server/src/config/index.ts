import dotenv from 'dotenv';
import * as path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const env = z
  .object({
    PORT: z.coerce.number().default(8080),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    RESEND_API_KEY: z.string().optional(),
    CLIENT_URL: z.string().url().default('http://localhost:3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    isDevelopment: z.boolean().default(process.env.NODE_ENV !== 'production'),
  })
  .parse(process.env);
