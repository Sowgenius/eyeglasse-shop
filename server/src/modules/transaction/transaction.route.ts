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
    
    // Build date filter
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate as string);
    if (endDate) dateFilter.lte = new Date(endDate as string);

    let transactions: any[] = [];

    if (!type || type === 'invoice') {
      const invoiceWhere: any = {};
      if (userId) invoiceWhere.userId = userId;
      if (Object.keys(dateFilter).length > 0) invoiceWhere.createdAt = dateFilter;

      const invoices = await prisma.invoice.findMany({
        where: invoiceWhere,
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
      // Payments don't have userId, so we need to get all payments first, then filter
      const paymentWhere: any = {};
      if (Object.keys(dateFilter).length > 0) paymentWhere.createdAt = dateFilter;

      const payments = await prisma.payment.findMany({
        where: paymentWhere,
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

      // Filter to only include payments for this user's invoices
      transactions = transactions.concat(
        payments
          .filter(pay => pay.invoice && (!userId || pay.invoice.userId === userId))
          .map(pay => ({
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
