import { prisma } from '@/lib/prisma';
import { TJwtPayload } from '../user/user.interface';
import { Quote, QuoteUpdate } from './quote.interface';

function generateQuoteNumber(year: number, sequence: number): string {
  return `QT-${year}-${sequence.toString().padStart(4, '0')}`;
}

async function getNextQuoteNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  
  const lastQuote = await prisma.quote.findFirst({
    where: {
      quoteNumber: {
        startsWith: `QT-${currentYear}-`,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  let sequence = 1;
  if (lastQuote) {
    const parts = lastQuote.quoteNumber.split('-');
    sequence = parseInt(parts[2]) + 1;
  }

  return generateQuoteNumber(currentYear, sequence);
}

export async function create(payload: Quote, userId: string) {
  const quoteNumber = await getNextQuoteNumber();
  
  // Calculate totals
  const subtotal = payload.items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice - item.discount;
    return sum + itemTotal;
  }, 0);
  
  const taxAmount = subtotal * (payload.taxRate / 100);
  const total = subtotal + taxAmount;

  return prisma.quote.create({
    data: {
      quoteNumber,
      customerId: payload.customerId,
      userId,
      subtotal,
      taxRate: payload.taxRate,
      taxAmount,
      total,
      validUntil: payload.validUntil ? new Date(payload.validUntil) : null,
      notes: payload.notes,
      terms: payload.terms,
      status: 'DRAFT',
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
      { quoteNumber: { contains: query.search, mode: 'insensitive' } },
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

  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
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
      },
    }),
    prisma.quote.count({ where }),
  ]);

  return {
    data: quotes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getById(quoteId: string, jwtPayload: TJwtPayload) {
  const where: any = { id: quoteId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  return prisma.quote.findFirst({
    where,
    include: {
      items: {
        include: {
          product: true,
        },
      },
      customer: true,
    },
  });
}

export async function update(
  quoteId: string,
  payload: QuoteUpdate,
  jwtPayload: TJwtPayload
) {
  const where: any = { id: quoteId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  const quote = await prisma.quote.findFirst({ where });
  
  if (!quote) {
    throw new Error('Quote not found');
  }

  // If items are updated, recalculate totals
  let subtotal = quote.subtotal;
  let taxAmount = quote.taxAmount;
  let total = quote.total;

  if (payload.items && payload.items.length > 0) {
    subtotal = payload.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice - item.discount;
      return sum + itemTotal;
    }, 0);
    
    const taxRate = payload.taxRate ?? quote.taxRate;
    taxAmount = subtotal * (taxRate / 100);
    total = subtotal + taxAmount;
  }

  const updateData: any = {
    subtotal,
    taxAmount,
    total,
    validUntil: payload.validUntil ? new Date(payload.validUntil) : undefined,
    notes: payload.notes,
    terms: payload.terms,
    status: payload.status,
  };

  if (payload.taxRate !== undefined) {
    updateData.taxRate = payload.taxRate;
  }

  // Update status timestamps
  if (payload.status === 'SENT' && quote.status !== 'SENT') {
    updateData.sentAt = new Date();
  } else if (payload.status === 'ACCEPTED' && quote.status !== 'ACCEPTED') {
    updateData.acceptedAt = new Date();
  } else if (payload.status === 'REJECTED' && quote.status !== 'REJECTED') {
    updateData.rejectedAt = new Date();
  }

  return prisma.$transaction(async (tx) => {
    // Delete existing items if new items provided
    if (payload.items) {
      await tx.quoteItem.deleteMany({
        where: { quoteId },
      });

      await tx.quoteItem.createMany({
        data: payload.items.map(item => ({
          quoteId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          total: item.quantity * item.unitPrice - item.discount,
          productId: item.productId || null,
        })),
      });
    }

    return tx.quote.update({
      where: { id: quoteId },
      data: updateData,
      include: {
        items: true,
        customer: true,
      },
    });
  });
}

export async function remove(quoteId: string, jwtPayload: TJwtPayload) {
  const where: any = { id: quoteId };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  return prisma.quote.delete({
    where: { id: quoteId },
  });
}

export async function convertToInvoice(quoteId: string, userId: string) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { items: true },
  });

  if (!quote) {
    throw new Error('Quote not found');
  }

  if (quote.status !== 'ACCEPTED') {
    throw new Error('Quote must be accepted before converting to invoice');
  }

  if (quote.convertedToInvoiceId) {
    throw new Error('Quote has already been converted to an invoice');
  }

  // This will be implemented in the invoice service
  return { quote, message: 'Use invoice service to create invoice from quote' };
}
