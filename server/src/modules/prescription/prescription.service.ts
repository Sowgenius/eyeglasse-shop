import { prisma } from '@/lib/prisma';
import { TJwtPayload } from '../user/user.interface';
import { Prescription, PrescriptionUpdate } from './prescription.interface';

export async function create(payload: Prescription, userId: string) {
  return prisma.prescription.create({
    data: {
      customerId: payload.customerId,
      userId,
      prescriptionDate: new Date(payload.prescriptionDate),
      expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : null,
      prescribedBy: payload.prescribedBy,
      odSph: payload.odSph,
      odCyl: payload.odCyl,
      odAxis: payload.odAxis,
      odAdd: payload.odAdd,
      odPd: payload.odPd,
      osSph: payload.osSph,
      osCyl: payload.osCyl,
      osAxis: payload.osAxis,
      osAdd: payload.osAdd,
      osPd: payload.osPd,
      nearPd: payload.nearPd,
      lensTypeRecommended: payload.lensTypeRecommended,
      notes: payload.notes,
    },
    include: {
      customer: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getAll(query: any, jwtPayload: TJwtPayload) {
  const page = parseInt(query.page || '1');
  const limit = parseInt(query.limit || '20');
  const skip = (page - 1) * limit;

  const where: any = {};

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  if (query.customerId) {
    where.customerId = query.customerId;
  }

  // Filter for prescriptions expiring soon
  if (query.expiringSoon) {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    where.expiryDate = {
      lte: thirtyDaysFromNow,
      gte: new Date(),
    };
  }

  const [prescriptions, total] = await Promise.all([
    prisma.prescription.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
    prisma.prescription.count({ where }),
  ]);

  return {
    data: prescriptions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getById(prescriptionId: string, jwtPayload: TJwtPayload) {
  const where: any = { id: prescriptionId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  return prisma.prescription.findFirst({
    where,
    include: {
      customer: true,
    },
  });
}

export async function update(
  prescriptionId: string,
  payload: PrescriptionUpdate,
  jwtPayload: TJwtPayload
) {
  const where: any = { id: prescriptionId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  const data: any = { ...payload };
  if (payload.prescriptionDate) {
    data.prescriptionDate = new Date(payload.prescriptionDate);
  }
  if (payload.expiryDate) {
    data.expiryDate = new Date(payload.expiryDate);
  }

  return prisma.prescription.update({
    where: { id: prescriptionId },
    data,
    include: {
      customer: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function remove(prescriptionId: string, jwtPayload: TJwtPayload) {
  const where: any = { id: prescriptionId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  return prisma.prescription.delete({
    where: { id: prescriptionId },
  });
}
