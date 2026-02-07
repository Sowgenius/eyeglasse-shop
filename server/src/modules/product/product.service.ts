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
    },
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
    quantity: { gt: 0 },
    isActive: true,
  };

  // Role-based filtering
  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  // Query filters
  if (query.brand) where.brand = { contains: query.brand, mode: 'insensitive' };
  if (query.frameMaterial) where.frameMaterial = { contains: query.frameMaterial, mode: 'insensitive' };
  if (query.frameShape) where.frameShape = { contains: query.frameShape, mode: 'insensitive' };
  if (query.lensType) where.lensType = { contains: query.lensType, mode: 'insensitive' };
  if (query.color) where.color = { contains: query.color, mode: 'insensitive' };
  if (query.gender) where.gender = { contains: query.gender, mode: 'insensitive' };
  if (query.hingeType) where.hingeType = query.hingeType;
  
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
  }

  if (query.search) {
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
    quantity: { lte: prisma.product.fields.reorderPoint },
    isActive: true,
  };

  if (jwtPayload.role === 'USER') {
    where.userId = jwtPayload.userId;
  }

  return prisma.product.findMany({
    where,
    orderBy: { quantity: 'asc' },
  });
}
