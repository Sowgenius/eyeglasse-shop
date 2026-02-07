import { z } from 'zod';
import { invoiceItemSchema, invoiceSchema, invoiceUpdateSchema, paymentSchema } from './invoice.validation';

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceUpdate = z.infer<typeof invoiceUpdateSchema>;
export type Payment = z.infer<typeof paymentSchema>;
