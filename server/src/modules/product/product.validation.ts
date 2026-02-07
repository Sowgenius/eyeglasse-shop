import { z } from 'zod';

export const hingeTypes = ['standard', 'spring-loaded', 'flexible'] as const;

export const productSchema = z.object({
  name: z.string(),
  sku: z.string(),
  description: z.string().optional(),
  imageSrc: z.string().optional(),
  brand: z.string(),
  price: z.number(),
  costPrice: z.number().optional(),
  quantity: z.number().default(0),
  reorderPoint: z.number().default(10),
  reorderQuantity: z.number().default(50),
  frameMaterial: z.string(),
  frameShape: z.string(),
  lensType: z.string(),
  color: z.string(),
  gender: z.string(),
  templeLength: z.number(),
  bridgeSize: z.number(),
  hingeType: z.enum(hingeTypes),
  supplierName: z.string().optional(),
  supplierContact: z.string().optional(),
  location: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const productUpdateSchema = productSchema.partial();

export const bulkDeleteSchema = z.object({
  productIds: z.string().uuid().array(),
});

export const querySchema = z.object({
  brand: z.string().optional(),
  frameMaterial: z.string().optional(),
  frameShape: z.string().optional(),
  lensType: z.string().optional(),
  color: z.string().optional(),
  gender: z.string().optional(),
  hingeType: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  search: z.string().optional(),
});
