import { catchAsync } from '@/utils';
import { sendResponse } from '@/utils/send-response';
import { Request } from 'express';
import { LoginPayload, User } from './user.interface';
import * as userServices from './user.service';

export const registerUser = catchAsync<User>(async (req, res) => {
  const result = await userServices.create(req.body);

  return sendResponse(res, {
    status: 201,
    message: result.message,
    data: { user: result.user },
  });
});

export const loginUser = catchAsync<LoginPayload>(async (req, res) => {
  const data = await userServices.login(req.body);

  return sendResponse(res, {
    message: 'Login successful',
    data,
  });
});

export const getUserData = catchAsync(async (req, res) => {
  const data = await userServices.getUser(req.jwtPayload);

  return sendResponse(res, {
    message: 'User data retrieved successfully',
    data,
  });
});

export const logoutUser = catchAsync(async (req, res) => {
  const data = await userServices.logout(req.body);

  return sendResponse(res, {
    message: 'Logout successful.',
    data,
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  const data = await userServices.deleteAccount(req.body, req.jwtPayload.userId);

  return sendResponse(res, {
    message: 'Account deleted successfully.',
    data,
  });
});

// Admin user management controllers

export const getPendingUsers = catchAsync(async (req, res) => {
  const data = await userServices.getPendingUsers();

  return sendResponse(res, {
    message: 'Pending users retrieved successfully',
    data,
  });
});

export const getAllUsers = catchAsync(async (req: Request, res) => {
  const data = await userServices.getAllUsers(req.query);

  return sendResponse(res, {
    message: 'Users retrieved successfully',
    data,
  });
});

export const approveUser = catchAsync(async (req: Request, res) => {
  const userId = req.params.userId as string;
  const data = await userServices.approveUser(userId);

  return sendResponse(res, {
    message: 'User approved successfully',
    data,
  });
});

export const rejectUser = catchAsync(async (req: Request, res) => {
  const userId = req.params.userId as string;
  const { reason } = req.body;
  const data = await userServices.rejectUser(userId, reason);

  return sendResponse(res, {
    message: 'User rejected successfully',
    data,
  });
});

export const suspendUser = catchAsync(async (req: Request, res) => {
  const userId = req.params.userId as string;
  const { reason } = req.body;
  const data = await userServices.suspendUser(userId, reason);

  return sendResponse(res, {
    message: 'User suspended successfully',
    data,
  });
});

export const activateUser = catchAsync(async (req: Request, res) => {
  const userId = req.params.userId as string;
  const data = await userServices.activateUser(userId);

  return sendResponse(res, {
    message: 'User activated successfully',
    data,
  });
});

export const updateUserRole = catchAsync(async (req: Request, res) => {
  const userId = req.params.userId as string;
  const { role } = req.body;
  const data = await userServices.updateUserRole(userId, role);

  return sendResponse(res, {
    message: 'User role updated successfully',
    data,
  });
});
