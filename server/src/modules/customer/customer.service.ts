import { prisma } from '@/lib/prisma';
import { syncService } from '@/lib/sync';
import { TJwtPayload } from '../user/user.interface';
import { Customer, CustomerUpdate, Query } from './customer.interface';

export async function create(payload: Customer, userId: string) {
  const customer = await prisma.customer.create({
    data: {
      ...payload,
      userId,
      birthDate: payload.birthDate ? new Date(payload.birthDate) : null,
    },
  });

  // Queue sync operation
  await syncService.queueOperation({
    operation: 'CREATE',
    tableName: 'customers',
    recordId: customer.id,
    data: customer,
  });

  return customer;
}

export async function getAll(query: Query, jwtPayload: TJwtPayload) {
  const page = parseInt(query.page || '1');
  const limit = parseInt(query.limit || '20');
  const skip = (page - 1) * limit;

  const where: any = {};

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  if (query.search) {
    where.OR = [
      { firstName: { contains: query.search, mode: 'insensitive' } },
      { lastName: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
      { phone: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            invoices: true,
            quotes: true,
          },
        },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    data: customers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getById(customerId: string, jwtPayload: TJwtPayload) {
  const where: any = { id: customerId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  return prisma.customer.findFirst({
    where,
    include: {
      invoices: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      quotes: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      prescriptions: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });
}

export async function update(
  customerId: string,
  payload: CustomerUpdate,
  jwtPayload: TJwtPayload
) {
  const where: any = { id: customerId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  const data: any = { ...payload };
  if (payload.birthDate) {
    data.birthDate = new Date(payload.birthDate);
  }

  const customer = await prisma.customer.update({
    where: { id: customerId },
    data,
  });

  // Queue sync operation
  await syncService.queueOperation({
    operation: 'UPDATE',
    tableName: 'customers',
    recordId: customerId,
    data: customer,
  });

  return customer;
}

export async function remove(customerId: string, jwtPayload: TJwtPayload) {
  const where: any = { id: customerId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  const result = await prisma.customer.delete({
    where: { id: customerId },
  });

  // Queue sync operation
  await syncService.queueOperation({
    operation: 'DELETE',
    tableName: 'customers',
    recordId: customerId,
  });

  return result;
}
