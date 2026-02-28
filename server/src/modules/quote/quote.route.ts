import { verifyToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validate-request';
import { catchAsync } from '@/utils';
import { sendResponse } from '@/utils/send-response';
import { Router } from 'express';
import { prisma } from '@/lib/prisma';
import {
  createQuote,
  deleteQuote,
  getQuote,
  getQuotes,
  sendQuote,
  updateQuote,
} from './quote.controller';
import { quoteSchema, quoteUpdateSchema } from './quote.validation';

const router = Router();

router.post(
  '/',
  [verifyToken(), validateRequest(quoteSchema)],
  createQuote
);

router.get(
  '/',
  [verifyToken()],
  getQuotes
);

router.get(
  '/:quoteId',
  [verifyToken()],
  getQuote
);

router.patch(
  '/:quoteId',
  [verifyToken(), validateRequest(quoteUpdateSchema)],
  updateQuote
);

router.post(
  '/:quoteId/send',
  [verifyToken()],
  sendQuote
);

// Convert quote to invoice
router.post(
  '/:quoteId/convert',
  verifyToken(),
  catchAsync(async (req, res) => {
    const { quoteId } = req.params;
    const userId = req.jwtPayload.userId;

    // Get the quote with items
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { items: true, customer: true },
    });

    if (!quote) {
      return sendResponse(res, { status: 404, message: 'Quote not found' });
    }

    // Generate invoice number
    const currentYear = new Date().getFullYear();
    const lastInvoice = await prisma.invoice.findFirst({
      where: { invoiceNumber: { startsWith: `INV-${currentYear}-` } },
      orderBy: { createdAt: 'desc' },
    });

    let sequence = 1;
    if (lastInvoice) {
      const parts = lastInvoice.invoiceNumber.split('-');
      sequence = parseInt(parts[2]) + 1;
    }
    const invoiceNumber = `INV-${currentYear}-${sequence.toString().padStart(4, '0')}`;

    // Create invoice from quote
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId: quote.customerId,
        quoteId: quote.id,
        userId,
        subtotal: quote.subtotal,
        taxRate: quote.taxRate,
        taxAmount: quote.taxAmount,
        total: quote.total,
        amountPaid: 0,
        balanceDue: quote.total,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes: quote.notes,
        terms: quote.terms,
        status: 'PENDING',
        items: {
          create: quote.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            total: item.total,
            productId: item.productId,
          })),
        },
      },
      include: {
        items: true,
        customer: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    // Update quote status
    await prisma.quote.update({
      where: { id: quoteId },
      data: { status: 'ACCEPTED', convertedToInvoiceId: invoice.id },
    });

    sendResponse(res, { status: 201, message: 'Invoice created from quote', data: invoice });
  })
);

router.delete(
  '/:quoteId',
  [verifyToken()],
  deleteQuote
);

export const QuoteRoutes = router;
