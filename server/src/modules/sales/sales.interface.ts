import { z } from 'zod';
import { invoiceItemSchema, paymentSchema } from '../invoice/invoice.validation';

export const saleSchema = z.object({
  customerId: z.string().uuid(),
  quoteId: z.string().uuid().optional(),
  items: z.array(invoiceItemSchema).min(1),
  taxRate: z.number().min(0).max(100).default(0),
  dueDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  processPayment: z.boolean().default(false),
  payment: paymentSchema.optional(),
});

export type Sale = z.infer<typeof saleSchema>;
