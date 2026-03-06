import { prisma } from '@/lib/prisma';
import { TJwtPayload } from '../user/user.interface';
import { BulkDeletePayload, Product, ProductUpdate, Query } from './product.interface';

export async function add(payload: Product, userId: string) {
  // Create stock movement for initial quantity
  const product = await prisma.product.create({
    data: {
      ...payload,
      userId,
      price: payload.price,
      costPrice: payload.costPrice || null,
    } as any,
  });

  // Log initial stock movement if quantity > 0
  if (payload.quantity > 0) {
    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        userId,
        type: 'IN',
        quantity: payload.quantity,
        previousStock: 0,
        newStock: payload.quantity,
        reason: 'Initial stock',
        referenceType: 'INITIAL',
      },
    });
  }

  return product;
}

export async function get(query: Query, jwtPayload: TJwtPayload) {
  const where: any = {
    isActive: true,
  };

  // Role-based filtering
  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  // Helper to check if string is not empty
  const hasValue = (val: string | undefined) => val !== undefined && val !== '';

  // Query filters
  if (hasValue(query.brand)) where.brand = { contains: query.brand, mode: 'insensitive' };
  if (hasValue(query.frameMaterial)) where.frameMaterial = { contains: query.frameMaterial, mode: 'insensitive' };
  if (hasValue(query.frameShape)) where.frameShape = { contains: query.frameShape, mode: 'insensitive' };
  if (hasValue(query.lensType)) where.lensType = { contains: query.lensType, mode: 'insensitive' };
  if (hasValue(query.color)) where.color = { contains: query.color, mode: 'insensitive' };
  if (hasValue(query.gender)) where.gender = { contains: query.gender, mode: 'insensitive' };
  if (hasValue(query.hingeType)) where.hingeType = query.hingeType;
  
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) {
      const min = parseFloat(query.minPrice);
      if (!isNaN(min)) where.price.gte = min;
    }
    if (query.maxPrice) {
      const max = parseFloat(query.maxPrice);
      if (!isNaN(max)) where.price.lte = max;
    }
    // Remove price filter if both are NaN
    if (Object.keys(where.price).length === 0) delete where.price;
  }

  if (hasValue(query.search)) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { brand: { contains: query.search, mode: 'insensitive' } },
      { sku: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  return prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      stockMovements: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });
}

export async function getById(productId: string, jwtPayload: TJwtPayload) {
  const where: any = { id: productId };
  
  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  return prisma.product.findFirst({
    where,
    include: {
      stockMovements: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function update(
  jwtPayload: TJwtPayload,
  productId: string,
  payload: ProductUpdate
) {
  const where: any = { id: productId };
  
  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  // Get current product to check quantity changes
  const currentProduct = await prisma.product.findFirst({ where });
  
  if (!currentProduct) {
    return null;
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: payload,
  });

  // Log stock movement if quantity changed
  if (payload.quantity !== undefined && payload.quantity !== currentProduct.quantity) {
    const diff = payload.quantity - currentProduct.quantity;
    await prisma.stockMovement.create({
      data: {
        productId,
        userId: jwtPayload.userId,
        type: diff > 0 ? 'IN' : 'OUT',
        quantity: Math.abs(diff),
        previousStock: currentProduct.quantity,
        newStock: payload.quantity,
        reason: 'Stock adjustment',
        referenceType: 'ADJUSTMENT',
      },
    });
  }

  return updatedProduct;
}

export async function remove(productId: string, jwtPayload: TJwtPayload) {
  const where: any = { id: productId };
  
  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  // Soft delete by setting isActive to false
  return prisma.product.update({
    where: { id: productId },
    data: { isActive: false, quantity: 0 },
  });
}

export async function bulkDelete(
  payload: BulkDeletePayload,
  jwtPayload: TJwtPayload
) {
  const where: any = { 
    id: { in: payload.productIds } 
  };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  // Soft delete
  return prisma.product.updateMany({
    where,
    data: { isActive: false, quantity: 0 },
  });
}

export async function getLowStock(jwtPayload: TJwtPayload) {
  const where: any = {
    isActive: true,
  };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { quantity: 'asc' },
  });

  return products.filter(p => p.quantity <= p.reorderPoint);
}
