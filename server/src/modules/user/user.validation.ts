import { z } from 'zod';
import { role } from './user.constants';

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginPayload = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const jwtPayload = z.object({
  userId: z.string().uuid(),
  role: z.enum(role),
});

export const logoutPayload = z.object({
  email: z.string().email(),
});

export const deleteAccountPayload = z.object({
  password: z.string(),
});
