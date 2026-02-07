import { z } from 'zod';
import { Role } from './user.constants';
import {
  deleteAccountPayload,
  jwtPayload,
  loginPayload,
  logoutPayload,
  userSchema,
} from './user.validation';

export type User = z.infer<typeof userSchema> & {
  id: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};
export type LoginPayload = z.infer<typeof loginPayload>;
export type TJwtPayload = z.infer<typeof jwtPayload>;
export type LogoutPayload = z.infer<typeof logoutPayload>;
export type DeleteAccountPayload = z.infer<typeof deleteAccountPayload>;
