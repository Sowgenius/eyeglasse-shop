import { z } from 'zod';
import { quoteItemSchema, quoteSchema, quoteUpdateSchema } from './quote.validation';

export type QuoteItem = z.infer<typeof quoteItemSchema>;
export type Quote = z.infer<typeof quoteSchema>;
export type QuoteUpdate = z.infer<typeof quoteUpdateSchema>;
