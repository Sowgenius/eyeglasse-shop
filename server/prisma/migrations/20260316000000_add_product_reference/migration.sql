-- Add missing reference column to products
ALTER TABLE "products" ADD COLUMN "reference" TEXT;
