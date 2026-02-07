import { z } from 'zod';
import { bulkDeleteSchema, productSchema, productUpdateSchema } from './product.validation';

export type Product = z.infer<typeof productSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
export type BulkDeletePayload = z.infer<typeof bulkDeleteSchema>;
export type Query = Record<string, string | undefined>;
