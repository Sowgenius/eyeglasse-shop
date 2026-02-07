import { z } from 'zod';

export const quoteItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  discount: z.number().min(0).default(0),
  productId: z.string().uuid().optional(),
});

export const quoteSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(quoteItemSchema).min(1),
  taxRate: z.number().min(0).max(100).default(0),
  validUntil: z.string().datetime().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

export const quoteUpdateSchema = z.object({
  items: z.array(quoteItemSchema).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  validUntil: z.string().datetime().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED']).optional(),
});

export const quoteNumberSchema = z.object({
  year: z.number(),
  sequence: z.number(),
});
