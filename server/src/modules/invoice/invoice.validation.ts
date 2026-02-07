import { z } from 'zod';

export const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  discount: z.number().min(0).default(0),
  productId: z.string().uuid().optional(),
});

export const invoiceSchema = z.object({
  customerId: z.string().uuid(),
  quoteId: z.string().uuid().optional(),
  items: z.array(invoiceItemSchema).min(1),
  taxRate: z.number().min(0).max(100).default(0),
  dueDate: z.string().datetime(),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

export const invoiceUpdateSchema = z.object({
  dueDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

export const paymentSchema = z.object({
  amount: z.number().positive(),
  method: z.enum(['CASH', 'CHECK', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'INSURANCE', 'OTHER']),
  reference: z.string().optional(),
  notes: z.string().optional(),
});
