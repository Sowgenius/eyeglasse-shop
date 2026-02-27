import { prisma } from '@/lib/prisma';
import { TJwtPayload } from '../user/user.interface';

export class TransactionService {
  static async getTransactions(
    userId: string,
    query: { type?: string; startDate?: string; endDate?: string },
    jwtPayload: TJwtPayload | null
  ) {
    const { type, startDate, endDate } = query;

    const whereClause: any = {
      userId,
    };

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
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
        invoices.map((inv) => ({
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
        payments.map((pay) => ({
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

    return transactions;
  }
}
