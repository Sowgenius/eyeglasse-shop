import { prisma } from '@/lib/prisma';
import { TJwtPayload } from '../user/user.interface';
import {
  CreateInstallmentPlan,
  MakePayment,
  PaymentStatus,
} from './installment.interface';

function generatePlanNumber(year: number, sequence: number): string {
  return `INST-${year}-${sequence.toString().padStart(4, '0')}`;
}

async function getNextPlanNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();

  const lastPlan = await prisma.installmentPlan.findFirst({
    where: {
      planNumber: {
        startsWith: `INST-${currentYear}-`,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  let sequence = 1;
  if (lastPlan) {
    const parts = lastPlan.planNumber.split('-');
    sequence = parseInt(parts[2]) + 1;
  }

  return generatePlanNumber(currentYear, sequence);
}

function calculateDueDate(startDate: Date, paymentNumber: number, frequency: string): Date {
  const date = new Date(startDate);
  
  switch (frequency) {
    case 'WEEKLY':
      date.setDate(date.getDate() + (paymentNumber - 1) * 7);
      break;
    case 'BIWEEKLY':
      date.setDate(date.getDate() + (paymentNumber - 1) * 14);
      break;
    case 'MONTHLY':
      date.setMonth(date.getMonth() + (paymentNumber - 1));
      break;
    case 'QUARTERLY':
      date.setMonth(date.getMonth() + (paymentNumber - 1) * 3);
      break;
    default:
      date.setMonth(date.getMonth() + (paymentNumber - 1));
  }
  
  return date;
}

export async function createPlan(
  payload: CreateInstallmentPlan,
  userId: string
) {
  const planNumber = await getNextPlanNumber();
  const invoice = await prisma.invoice.findUnique({
    where: { id: payload.invoiceId },
    include: { customer: true },
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  // Calculate payment amount
  const paymentAmount = payload.totalAmount / payload.numPayments;

  return prisma.$transaction(async (tx) => {
    // Create installment plan
    const plan = await tx.installmentPlan.create({
      data: {
        planNumber,
        invoiceId: payload.invoiceId,
        customerId: invoice.customerId,
        totalAmount: payload.totalAmount,
        numPayments: payload.numPayments,
        paymentAmount,
        frequency: payload.frequency,
        startDate: new Date(payload.startDate),
        lateFeePercent: payload.lateFeePercent || 0,
        notes: payload.notes,
        userId,
      },
    });

    // Create scheduled payments
    const payments = [];
    for (let i = 1; i <= payload.numPayments; i++) {
      const dueDate = calculateDueDate(
        new Date(payload.startDate),
        i,
        payload.frequency
      );

      const payment = await tx.installmentPayment.create({
        data: {
          installmentPlanId: plan.id,
          paymentNumber: i,
          dueDate,
          amount: paymentAmount,
          totalAmount: paymentAmount,
          status: 'PENDING',
        },
      });
      payments.push(payment);
    }

    return { plan, payments };
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

  if (query.status) {
    where.status = query.status;
  }

  if (query.customerId) {
    where.customerId = query.customerId;
  }

  if (query.invoiceId) {
    where.invoiceId = query.invoiceId;
  }

  if (query.search) {
    where.OR = [
      { planNumber: { contains: query.search, mode: 'insensitive' } },
      {
        customer: {
          OR: [
            { firstName: { contains: query.search, mode: 'insensitive' } },
            { lastName: { contains: query.search, mode: 'insensitive' } },
          ],
        },
      },
    ];
  }

  const [plans, total] = await Promise.all([
    prisma.installmentPlan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        invoice: {
          select: {
            invoiceNumber: true,
            total: true,
          },
        },
        payments: {
          orderBy: { paymentNumber: 'asc' },
        },
      },
    }),
    prisma.installmentPlan.count({ where }),
  ]);

  return {
    data: plans,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getById(planId: string, jwtPayload: TJwtPayload) {
  const where: any = { id: planId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  return prisma.installmentPlan.findFirst({
    where,
    include: {
      customer: true,
      invoice: true,
      payments: {
        orderBy: { paymentNumber: 'asc' },
      },
    },
  });
}

export async function makePayment(
  paymentId: string,
  payload: MakePayment,
  userId: string
) {
  const payment = await prisma.installmentPayment.findUnique({
    where: { id: paymentId },
    include: { installmentPlan: true },
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  // Check if already paid
  if (payment.status === 'PAID') {
    throw new Error('Payment already completed');
  }

  // Calculate late fee if overdue
  const now = new Date();
  let lateFee = 0;
  if (now > payment.dueDate && payment.installmentPlan.lateFeePercent) {
    const daysOverdue = Math.floor(
      (now.getTime() - payment.dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysOverdue > 0) {
      lateFee =
        Number(payment.amount) *
        (Number(payment.installmentPlan.lateFeePercent) / 100);
    }
  }

  const totalAmount = Number(payment.amount) + lateFee;

  return prisma.$transaction(async (tx) => {
    // Update payment
    const updatedPayment = await tx.installmentPayment.update({
      where: { id: paymentId },
      data: {
        paidAmount: payload.amount,
        paidDate: new Date(),
        lateFee: lateFee || null,
        totalAmount,
        status: payload.amount >= totalAmount ? 'PAID' : 'PARTIAL',
        paymentMethod: payload.paymentMethod,
        notes: payload.notes,
      },
    });

    // Check if all payments are completed
    const allPayments = await tx.installmentPayment.findMany({
      where: { installmentPlanId: payment.installmentPlanId },
    });

    const allPaid = allPayments.every((p) => p.status === 'PAID');
    const anyOverdue = allPayments.some(
      (p) =>
        p.status === 'PENDING' &&
        new Date() > p.dueDate &&
        new Date().getTime() - p.dueDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days grace period
    );

    let planStatus = payment.installmentPlan.status;
    if (allPaid) {
      planStatus = 'PAID';
    } else if (anyOverdue) {
      planStatus = 'DEFAULTED';
    }

    await tx.installmentPlan.update({
      where: { id: payment.installmentPlanId },
      data: { status: planStatus },
    });

    // Also record as regular invoice payment
    await tx.payment.create({
      data: {
        invoiceId: payment.installmentPlan.invoiceId,
        amount: payload.amount,
        method: payload.paymentMethod,
        reference: `Installment ${payment.paymentNumber}`,
        notes: payload.notes,
      },
    });

    return updatedPayment;
  });
}

export async function getOverduePayments(jwtPayload: TJwtPayload) {
  const now = new Date();

  const where: any = {
    status: { in: ['PENDING', 'PARTIAL'] },
    dueDate: { lt: now },
  };

  if (jwtPayload.role === 'USER') {
    where.installmentPlan = {
      userId: jwtPayload.userId,
    };
  }

  return prisma.installmentPayment.findMany({
    where,
    orderBy: { dueDate: 'asc' },
    include: {
      installmentPlan: {
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
  });
}

export async function cancelPlan(planId: string, jwtPayload: TJwtPayload) {
  const where: any = { id: planId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  const plan = await prisma.installmentPlan.findFirst({ where });

  if (!plan) {
    throw new Error('Installment plan not found');
  }

  if (plan.status === 'PAID') {
    throw new Error('Cannot cancel a paid plan');
  }

  return prisma.$transaction(async (tx) => {
    // Cancel all pending payments
    await tx.installmentPayment.updateMany({
      where: {
        installmentPlanId: planId,
        status: { in: ['PENDING', 'PARTIAL'] },
      },
      data: {
        status: 'WAIVED',
      },
    });

    // Cancel the plan
    return tx.installmentPlan.update({
      where: { id: planId },
      data: { status: 'CANCELLED' },
    });
  });
}

export async function updatePlan(
  planId: string,
  payload: { notes?: string; lateFeePercent?: number },
  jwtPayload: TJwtPayload
) {
  const where: any = { id: planId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  return prisma.installmentPlan.update({
    where: { id: planId },
    data: payload,
    include: {
      payments: true,
      customer: true,
    },
  });
}
