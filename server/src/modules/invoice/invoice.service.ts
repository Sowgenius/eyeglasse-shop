import { prisma } from '@/lib/prisma';
import { TJwtPayload } from '../user/user.interface';
import { Invoice, InvoiceUpdate, Payment } from './invoice.interface';

function generateInvoiceNumber(year: number, sequence: number): string {
  return `INV-${year}-${sequence.toString().padStart(4, '0')}`;
}

async function getNextInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNumber: {
        startsWith: `INV-${currentYear}-`,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  let sequence = 1;
  if (lastInvoice) {
    const parts = lastInvoice.invoiceNumber.split('-');
    sequence = parseInt(parts[2]) + 1;
  }

  return generateInvoiceNumber(currentYear, sequence);
}

export async function create(payload: Invoice, userId: string) {
  const invoiceNumber = await getNextInvoiceNumber();
  
  // Calculate totals
  const subtotal = payload.items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice - item.discount;
    return sum + itemTotal;
  }, 0);
  
  const taxAmount = subtotal * (payload.taxRate / 100);
  const total = subtotal + taxAmount;

  return prisma.$transaction(async (tx) => {
    // Create invoice
    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber,
        customerId: payload.customerId,
        quoteId: payload.quoteId || null,
        userId,
        subtotal,
        taxRate: payload.taxRate,
        taxAmount,
        total,
        amountPaid: 0,
        balanceDue: total,
        dueDate: new Date(payload.dueDate),
        notes: payload.notes,
        terms: payload.terms,
        status: 'PENDING',
        items: {
          create: payload.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            total: item.quantity * item.unitPrice - item.discount,
            productId: item.productId || null,
          })),
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });

    // Update quote if exists
    if (payload.quoteId) {
      await tx.quote.update({
        where: { id: payload.quoteId },
        data: {
          status: 'ACCEPTED',
          convertedToInvoiceId: invoice.id,
        },
      });
    }

    // Deduct stock for products
    for (const item of payload.items) {
      if (item.productId) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (product) {
          const newQuantity = product.quantity - item.quantity;
          
          await tx.product.update({
            where: { id: item.productId },
            data: { quantity: newQuantity },
          });

          // Log stock movement
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              userId,
              type: 'OUT',
              quantity: item.quantity,
              previousStock: product.quantity,
              newStock: newQuantity,
              referenceId: invoice.id,
              referenceType: 'INVOICE',
              reason: `Invoice ${invoiceNumber}`,
            },
          });
        }
      }
    }

    return invoice;
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

  if (query.search) {
    where.OR = [
      { invoiceNumber: { contains: query.search, mode: 'insensitive' } },
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

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
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
          },
        },
        items: true,
        payments: true,
      },
    }),
    prisma.invoice.count({ where }),
  ]);

  return {
    data: invoices,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getById(invoiceId: string, jwtPayload: TJwtPayload) {
  const where: any = { id: invoiceId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  return prisma.invoice.findFirst({
    where,
    include: {
      items: {
        include: {
          product: true,
        },
      },
      customer: true,
      payments: {
        orderBy: { createdAt: 'desc' },
      },
      quote: true,
    },
  });
}

export async function update(
  invoiceId: string,
  payload: InvoiceUpdate,
  jwtPayload: TJwtPayload
) {
  const where: any = { id: invoiceId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  const data: any = { ...payload };
  if (payload.dueDate) {
    data.dueDate = new Date(payload.dueDate);
  }

  return prisma.invoice.update({
    where: { id: invoiceId },
    data,
    include: {
      items: true,
      customer: true,
      payments: true,
    },
  });
}

export async function remove(invoiceId: string, jwtPayload: TJwtPayload) {
  const where: any = { id: invoiceId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  return prisma.$transaction(async (tx) => {
    // Restore stock for products
    const invoice = await tx.invoice.findUnique({
      where: { id: invoiceId },
      include: { items: true },
    });

    if (invoice) {
      for (const item of invoice.items) {
        if (item.productId) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (product) {
            const newQuantity = product.quantity + item.quantity;
            
            await tx.product.update({
              where: { id: item.productId },
              data: { quantity: newQuantity },
            });

            await tx.stockMovement.create({
              data: {
                productId: item.productId,
                userId: jwtPayload.userId,
                type: 'IN',
                quantity: item.quantity,
                previousStock: product.quantity,
                newStock: newQuantity,
                referenceId: invoiceId,
                referenceType: 'INVOICE_CANCELLED',
                reason: `Invoice ${invoice.invoiceNumber} cancelled`,
              },
            });
          }
        }
      }
    }

    // Delete invoice and related data
    await tx.payment.deleteMany({ where: { invoiceId } });
    await tx.invoiceItem.deleteMany({ where: { invoiceId } });
    return tx.invoice.delete({ where: { id: invoiceId } });
  });
}

export async function addPayment(
  invoiceId: string,
  payload: Payment,
  userId: string
) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  if (invoice.status === 'PAID') {
    throw new Error('Invoice is already fully paid');
  }

  if (invoice.status === 'CANCELLED') {
    throw new Error('Cannot add payment to cancelled invoice');
  }

  const newAmountPaid = Number(invoice.amountPaid) + payload.amount;
  const newBalanceDue = Number(invoice.total) - newAmountPaid;

  let newStatus = invoice.status;
  if (newBalanceDue <= 0) {
    newStatus = 'PAID';
  } else if (newAmountPaid > 0) {
    newStatus = 'PARTIAL';
  }

  return prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        invoiceId,
        amount: payload.amount,
        method: payload.method,
        reference: payload.reference,
        notes: payload.notes,
      },
    });

    const updatedInvoice = await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        amountPaid: newAmountPaid,
        balanceDue: newBalanceDue,
        status: newStatus,
        paidAt: newStatus === 'PAID' ? new Date() : null,
      },
      include: {
        payments: true,
        customer: true,
      },
    });

    return updatedInvoice;
  });
}

export async function getOverdueInvoices(jwtPayload: TJwtPayload) {
  const where: any = {
    status: { in: ['PENDING', 'PARTIAL'] },
    dueDate: { lt: new Date() },
  };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  return prisma.invoice.findMany({
    where,
    orderBy: { dueDate: 'asc' },
    include: {
      customer: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}
