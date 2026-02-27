import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export class SalesService {
  static async createSale(payload: any, userId: string) {
    const invoiceNumber = await this.getNextInvoiceNumber();

    const subtotal = payload.items.reduce((sum: number, item: any) => {
      const itemTotal = item.quantity * item.unitPrice - item.discount;
      return sum + itemTotal;
    }, 0);

    const taxAmount = subtotal * (payload.taxRate / 100);
    const total = subtotal + taxAmount;

    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          customerId: payload.customerId,
          quoteId: payload.quoteId || null,
          userId,
          subtotal: new Decimal(subtotal.toFixed(2)),
          taxRate: new Decimal(payload.taxRate.toFixed(2)),
          taxAmount: new Decimal(taxAmount.toFixed(2)),
          total: new Decimal(total.toFixed(2)),
          amountPaid: payload.processPayment ? new Decimal(total.toFixed(2)) : new Decimal('0'),
          balanceDue: payload.processPayment ? new Decimal('0') : new Decimal(total.toFixed(2)),
          dueDate: payload.dueDate
            ? new Date(payload.dueDate)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          notes: payload.notes,
          terms: payload.terms,
          status: payload.processPayment ? 'PAID' : 'PENDING',
          paidAt: payload.processPayment ? new Date() : null,
          items: {
            create: payload.items.map((item: any) => ({
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
      if (payload.processPayment && payload.payment) {
        paymentRecord = await tx.payment.create({
          data: {
            invoiceId: invoice.id,
            amount: new Decimal(total.toFixed(2)),
            method: payload.payment.method,
            reference: payload.payment.reference,
            notes: payload.payment.notes,
          },
        });
      }

      for (const item of payload.items) {
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

    return result;
  }

  static async getNextInvoiceNumber(): Promise<string> {
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

    return `INV-${currentYear}-${sequence.toString().padStart(4, '0')}`;
  }
}
