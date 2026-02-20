import { verifyToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validate-request';
import { Router } from 'express';
import {
  activateUser,
  approveUser,
  deleteUser,
  getAllUsers,
  getPendingUsers,
  getUserData,
  loginUser,
  logoutUser,
  registerUser,
  rejectUser,
  suspendUser,
  updateUserRole,
} from './user.controller';
import {
  deleteAccountPayload,
  loginPayload,
  logoutPayload,
  userSchema,
} from './user.validation';

const router = Router();

// Public routes
router.post('/register', validateRequest(userSchema), registerUser);
router.post('/login', validateRequest(loginPayload), loginUser);

// Protected routes (any authenticated user)
router.get('/profile', verifyToken(), getUserData);

router.post(
  '/logout',
  [verifyToken(), validateRequest(logoutPayload)],
  logoutUser
);

router.delete(
  '/profile/delete',
  [verifyToken(), validateRequest(deleteAccountPayload)],
  deleteUser
);

// Admin routes (MANAGER only)
router.get('/admin/pending', verifyToken('MANAGER'), getPendingUsers);
router.get('/admin/all', verifyToken('MANAGER'), getAllUsers);
router.patch('/admin/:userId/approve', verifyToken('MANAGER'), approveUser);
router.patch('/admin/:userId/reject', verifyToken('MANAGER'), rejectUser);
router.patch('/admin/:userId/suspend', verifyToken('MANAGER'), suspendUser);
router.patch('/admin/:userId/activate', verifyToken('MANAGER'), activateUser);
router.patch('/admin/:userId/role', verifyToken('MANAGER'), updateUserRole);

export const UserRoutes = router;
