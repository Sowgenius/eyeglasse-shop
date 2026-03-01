import { prisma } from '@/lib/prisma';
import { TJwtPayload } from '../user/user.interface';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, format } from 'date-fns';

export async function getDashboardStats(jwtPayload: TJwtPayload) {
  const where: any = {};

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  // Low stock products query (raw SQL for comparison)
  let lowStockProducts = 0;
  try {
    const userIdFilter = jwtPayload.role === 'USER' ? `AND "userId" = '${jwtPayload.userId}'` : '';
    const lowStockRawResult = await prisma.$queryRawUnsafe<{count: bigint}[]>(
      `SELECT COUNT(*) as count FROM product WHERE "isActive" = true AND quantity <= "reorderPoint" ${userIdFilter}`
    );
    lowStockProducts = lowStockRawResult[0]?.count ? Number(lowStockRawResult[0].count) : 0;
  } catch (error) {
    console.error('Error fetching low stock products:', error);
  }

  const [
    totalCustomers,
    totalProducts,
    totalInvoices,
    todayRevenue,
    pendingInvoices,
    overdueInvoices,
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

export async function getSalesHistory(query: any, jwtPayload: TJwtPayload) {
  const where: any = {};

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  // Get date range
  const categorizeBy = query.categorize_by || 'daily';
  const days = categorizeBy === 'yearly' ? 365 * 2 : categorizeBy === 'monthly' ? 365 : categorizeBy === 'weekly' ? 90 : 30;
  
  const endDate = new Date();
  const startDate = subDays(endDate, days);
  
  where.createdAt = {
    gte: startDate,
    lte: endDate,
  };

  // Get all invoices in date range
  const invoices = await prisma.invoice.findMany({
    where,
    select: {
      total: true,
      amountPaid: true,
      createdAt: true,
      status: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Group by date based on categorizeBy
  const groupedData = invoices.reduce((acc: any, invoice) => {
    let dateKey: string;
    const date = new Date(invoice.createdAt);
    
    switch (categorizeBy) {
      case 'yearly':
        dateKey = format(date, 'yyyy');
        break;
      case 'monthly':
        dateKey = format(date, 'MMM yyyy');
        break;
      case 'weekly':
        dateKey = format(date, 'yyyy-Www');
        break;
      default:
        dateKey = format(date, 'yyyy-MM-dd');
    }
    
    if (!acc[dateKey]) {
      acc[dateKey] = { date: dateKey, total: 0, paid: 0, count: 0 };
    }
    
    acc[dateKey].total += Number(invoice.total) || 0;
    acc[dateKey].paid += Number(invoice.amountPaid) || 0;
    acc[dateKey].count += 1;
    
    return acc;
  }, {});

  const chartData = Object.values(groupedData).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate totals
  const totals = {
    totalSales: chartData.reduce((sum: number, d: any) => sum + d.total, 0),
    totalPaid: chartData.reduce((sum: number, d: any) => sum + d.paid, 0),
    totalInvoices: chartData.reduce((sum: number, d: any) => sum + d.count, 0),
  };

  return {
    data: chartData,
    totals,
  };
}
