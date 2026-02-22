import { env } from '@/config';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  DeleteAccountPayload,
  LoginPayload,
  LogoutPayload,
  TJwtPayload,
  User,
} from './user.interface';

export async function create(payload: Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt' | 'status'>) {
  const hashedPassword = await hash(payload.password, 10);
  
  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
      status: 'PENDING',
    } as any,
  });

  return { 
    user, 
    message: 'Registration successful. Your account is pending admin approval.' 
  };
}

export async function login(payload: LoginPayload) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) throw new AppError(404, 'User is not registered.');

  // Check if user is approved
  if (user.status === 'PENDING') {
    throw new AppError(403, 'Your account is pending admin approval. Please wait for approval before logging in.');
  }

  if (user.status === 'REJECTED') {
    throw new AppError(403, 'Your account registration has been rejected. Please contact admin for more information.');
  }

  if (user.status === 'SUSPENDED') {
    throw new AppError(403, 'Your account has been suspended. Please contact admin for more information.');
  }

  const isMatched = await compare(payload.password, user.password);

  if (!isMatched) throw new AppError(401, 'Password does not match.');

  const token = jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: '15d',
  });

  return {
    user,
    token,
  };
}

export async function getUser(payload: TJwtPayload) {
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) throw new AppError(404, 'User does not exist.');

  return user;
}

export async function logout(payload: LogoutPayload) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) throw new AppError(404, 'User does not exist.');

  return user;
}

export async function deleteAccount(
  payload: DeleteAccountPayload,
  userId: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new AppError(404, 'User does not exist.');

  const isMatched = await compare(payload.password, user.password);

  if (!isMatched) throw new AppError(401, 'Password does not match.');

  // Delete in transaction
  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        invoice: {
          userId,
        },
      },
    });
    
    await tx.invoiceItem.deleteMany({
      where: {
        invoice: {
          userId,
        },
      },
    });
    
    await tx.invoice.deleteMany({
      where: { userId },
    });
    
    await tx.quoteItem.deleteMany({
      where: {
        quote: {
          userId,
        },
      },
    });
    
    await tx.quote.deleteMany({
      where: { userId },
    });
    
    await tx.prescription.deleteMany({
      where: { userId },
    });
    
    await tx.eyeExam.deleteMany({
      where: {
        customer: {
          userId,
        },
      },
    });
    
    await tx.customer.deleteMany({
      where: { userId },
    });
    
    await tx.stockMovement.deleteMany({
      where: { userId },
    });
    
    await tx.product.deleteMany({
      where: { userId },
    });
    
    await tx.user.delete({
      where: { id: userId },
    });
  });

  return user;
}

// Admin functions for user management

export async function getPendingUsers() {
  const users = await prisma.user.findMany({
    where: { status: 'PENDING' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
}

export async function getAllUsers(query: { status?: string; role?: string; search?: string }) {
  const where: any = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.role) {
    where.role = query.role;
  }

  if (query.search) {
    where.OR = [
      { email: { contains: query.search, mode: 'insensitive' } },
      { name: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
}

export async function approveUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new AppError(404, 'User not found.');
  if (user.status !== 'PENDING') throw new AppError(400, 'User is not in pending status.');

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: 'ACTIVE' },
  });

  return updatedUser;
}

export async function rejectUser(userId: string, reason?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new AppError(404, 'User not found.');
  if (user.status !== 'PENDING') throw new AppError(400, 'User is not in pending status.');

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: 'REJECTED' },
  });

  // TODO: Send email notification with rejection reason

  return updatedUser;
}

export async function suspendUser(userId: string, reason?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new AppError(404, 'User not found.');

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: 'SUSPENDED' },
  });

  // TODO: Send email notification with suspension reason

  return updatedUser;
}

export async function activateUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new AppError(404, 'User not found.');

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: 'ACTIVE' },
  });

  return updatedUser;
}

export async function updateUserRole(userId: string, role: 'USER' | 'MANAGER') {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new AppError(404, 'User not found.');

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return updatedUser;
}
