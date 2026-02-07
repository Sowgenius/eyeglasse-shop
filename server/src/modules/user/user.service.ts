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

export async function create(payload: Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>) {
  const hashedPassword = await hash(payload.password, 10);
  
  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  const token = jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: '15d',
  });

  return { user, token };
}

export async function login(payload: LoginPayload) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) throw new AppError(404, 'User is not registered.');

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
