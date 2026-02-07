import { prisma } from '@/lib/prisma';
import { TJwtPayload } from '../user/user.interface';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from 'date-fns';

export async function getDashboardStats(jwtPayload: TJwtPayload) {
  const where: any = {};

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  const [
    totalCustomers,
    totalProducts,
    totalInvoices,
    todayRevenue,
    pendingInvoices,
    overdueInvoices,
    lowStockProducts,
  ] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.product.count({ where: { ...where, isActive: true } }),
    prisma.invoice.count({ where }),
    
    // Today's revenue
    prisma.invoice.aggregate({
      where: {
        ...where,
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
        status: { in: ['PAID', 'PARTIAL'] },
      },
      _sum: {
        amountPaid: true,
      },
    }),

    // Pending invoices
    prisma.invoice.count({
      where: {
        ...where,
        status: { in: ['PENDING', 'PARTIAL'] },
      },
    }),

    // Overdue invoices
    prisma.invoice.count({
      where: {
        ...where,
        status: { in: ['PENDING', 'PARTIAL'] },
        dueDate: { lt: today },
      },
    }),

    // Low stock products
    prisma.product.count({
      where: {
        ...where,
        quantity: { lte: prisma.product.fields.reorderPoint },
        isActive: true,
      },
    }),
  ]);

  return {
    totalCustomers,
    totalProducts,
    totalInvoices,
    todayRevenue: todayRevenue._sum.amountPaid || 0,
    pendingInvoices,
    overdueInvoices,
    lowStockProducts,
  };
}

export async function getSalesReport(query: any, jwtPayload: TJwtPayload) {
  const where: any = {};

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  // Date range filter
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate),
    };
  } else {
    // Default to last 30 days
    const endDate = new Date();
    const startDate = subDays(endDate, 30);
    where.createdAt = {
      gte: startDate,
      lte: endDate,
    };
  }

  const [invoices, totals] = await Promise.all([
    prisma.invoice.findMany({
      where,
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
    prisma.invoice.aggregate({
      where,
      _sum: {
        total: true,
        amountPaid: true,
      },
      _count: {
        id: true,
      },
    }),
  ]);

  return {
    invoices,
    summary: {
      totalSales: totals._sum.total || 0,
      totalPaid: totals._sum.amountPaid || 0,
      totalInvoices: totals._count.id,
    },
  };
}

export async function getProductPerformance(query: any, jwtPayload: TJwtPayload) {
  const where: any = {};

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  // Date range
  if (query.startDate && query.endDate) {
    where.invoice = {
      createdAt: {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      },
    };
  }

  // Top selling products
  const topProducts = await prisma.invoiceItem.groupBy({
    by: ['productId'],
    where: {
      ...where,
      productId: { not: null },
    },
    _sum: {
      quantity: true,
      total: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 10,
  });

  // Get product details
  const productsWithDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId! },
        select: {
          name: true,
          sku: true,
          brand: true,
        },
      });
      return {
        ...item,
        product,
      };
    })
  );

  return {
    topProducts: productsWithDetails,
  };
}
