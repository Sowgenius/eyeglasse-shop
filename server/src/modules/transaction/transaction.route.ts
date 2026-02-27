import { verifyToken } from '@/middlewares/auth';
import { catchAsync } from '@/utils';
import { sendResponse } from '@/utils/send-response';
import { Router } from 'express';
import { prisma } from '@/lib/prisma';

const router = Router();

router.get(
  '/',
  verifyToken(),
  catchAsync(async (req, res) => {
    const userId = req.jwtPayload.userId;
    const { type, startDate, endDate } = req.query;
    
    const whereClause: any = {
      userId,
    };

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
      if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
    }

    let transactions: any[] = [];

    if (!type || type === 'invoice') {
      const invoices = await prisma.invoice.findMany({
        where: whereClause,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      
      transactions = transactions.concat(
        invoices.map(inv => ({
          id: inv.id,
          type: 'INVOICE',
          invoiceNumber: inv.invoiceNumber,
          amount: inv.total,
          status: inv.status,
          customer: inv.customer,
          date: inv.createdAt,
        }))
      );
    }

    if (!type || type === 'payment') {
      const payments = await prisma.payment.findMany({
        where: whereClause,
        include: {
          invoice: {
            include: {
              customer: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      transactions = transactions.concat(
        payments.map(pay => ({
          id: pay.id,
          type: 'PAYMENT',
          invoiceNumber: pay.invoice.invoiceNumber,
          amount: pay.amount,
          status: 'COMPLETED',
          customer: pay.invoice.customer,
          date: pay.createdAt,
        }))
      );
    }

    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return sendResponse(res, {
      message: 'Transactions retrieved successfully',
      data: transactions,
    });
  })
);

export const TransactionRoutes = router;
