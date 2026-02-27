import { verifyToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validate-request';
import { catchAsync } from '@/utils';
import { sendResponse } from '@/utils/send-response';
import { Router } from 'express';
import { prisma } from '@/lib/prisma';
import { saleSchema } from './sales.interface';
import { Decimal } from '@prisma/client/runtime/library';

const router = Router();

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

router.post(
  '/',
  [verifyToken(), validateRequest(saleSchema)],
  catchAsync(async (req, res) => {
    const userId = req.jwtPayload.userId;
    const { customerId, quoteId, items, taxRate, dueDate, notes, terms, processPayment, payment } = req.body;

    const invoiceNumber = await getNextInvoiceNumber();
    
    const subtotal = items.reduce((sum: number, item: any) => {
      const itemTotal = item.quantity * item.unitPrice - item.discount;
      return sum + itemTotal;
    }, 0);
    
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          customerId,
          quoteId: quoteId || null,
          userId,
          subtotal: new Decimal(subtotal.toFixed(2)),
          taxRate: new Decimal(taxRate.toFixed(2)),
          taxAmount: new Decimal(taxAmount.toFixed(2)),
          total: new Decimal(total.toFixed(2)),
          amountPaid: processPayment ? new Decimal(total.toFixed(2)) : new Decimal('0'),
          balanceDue: processPayment ? new Decimal('0') : new Decimal(total.toFixed(2)),
          dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          notes,
          terms,
          status: processPayment ? 'PAID' : 'PENDING',
          paidAt: processPayment ? new Date() : null,
          items: {
            create: items.map((item: any) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: new Decimal(item.unitPrice.toFixed(2)),
              discount: new Decimal((item.discount || 0).toFixed(2)),
              total: new Decimal(((item.quantity * item.unitPrice) - (item.discount || 0)).toFixed(2)),
              productId: item.productId || null,
            })),
          },
        },
        include: {
          items: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      let paymentRecord = null;
      if (processPayment && payment) {
        paymentRecord = await tx.payment.create({
          data: {
            invoiceId: invoice.id,
            amount: new Decimal(total.toFixed(2)),
            method: payment.method,
            reference: payment.reference,
            notes: payment.notes,
          },
        });
      }

      for (const item of items) {
        if (item.productId) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });
          
          if (product) {
            const newQuantity = product.quantity - item.quantity;
            await tx.product.update({
              where: { id: item.productId },
              data: {
                quantity: newQuantity,
              },
            });

            await tx.stockMovement.create({
              data: {
                productId: item.productId,
                userId,
                type: 'OUT',
                quantity: -item.quantity,
                previousStock: product.quantity,
                newStock: newQuantity,
                referenceId: invoice.id,
                referenceType: 'INVOICE',
              },
            });
          }
        }
      }

      return { invoice, payment: paymentRecord };
    });

    sendResponse(res, {
      status: 201,
      message: processPayment ? 'Sale completed successfully' : 'Invoice created successfully',
      data: result,
    });
  })
);

export const SalesRoutes = router;
