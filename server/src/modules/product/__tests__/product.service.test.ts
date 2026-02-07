import { prisma } from '@/lib/prisma';
import * as productService from '../product.service';
import * as userService from '../../user/user.service';

describe('Product Service', () => {
  let testUser: any;

  beforeEach(async () => {
    const userResult = await userService.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    testUser = userResult.user;
  });

  const mockProduct = {
    name: 'Lunettes Ray-Ban Aviator',
    sku: 'RB-AV-001',
    description: 'Lunettes de soleil aviateur classiques',
    imageSrc: 'https://example.com/image.jpg',
    brand: 'Ray-Ban',
    price: 159.99,
    costPrice: 80.00,
    quantity: 25,
    reorderPoint: 5,
    reorderQuantity: 20,
    frameMaterial: 'metal',
    frameShape: 'aviator',
    lensType: 'polycarbonate',
    color: 'gold',
    gender: 'unisex',
    templeLength: 140,
    bridgeSize: 14,
    hingeType: 'standard',
    supplierName: 'Luxottica France',
    supplierContact: 'contact@luxottica.fr',
    location: 'A1-B2',
    isActive: true,
  };

  describe('add', () => {
    it('should create a new product', async () => {
      const result = await productService.add(mockProduct, testUser.id);

      expect(result).toBeDefined();
      expect(result.name).toBe(mockProduct.name);
      expect(result.sku).toBe(mockProduct.sku);
      expect(result.userId).toBe(testUser.id);
    });

    it('should log stock movement for initial quantity', async () => {
      const result = await productService.add(mockProduct, testUser.id);

      const movements = await prisma.stockMovement.findMany({
        where: { productId: result.id },
      });

      expect(movements).toHaveLength(1);
      expect(movements[0].type).toBe('IN');
      expect(movements[0].quantity).toBe(mockProduct.quantity);
      expect(movements[0].previousStock).toBe(0);
      expect(movements[0].newStock).toBe(mockProduct.quantity);
    });

    it('should not log movement if quantity is 0', async () => {
      const productWithZeroStock = { ...mockProduct, sku: 'RB-AV-002', quantity: 0 };
      const result = await productService.add(productWithZeroStock, testUser.id);

      const movements = await prisma.stockMovement.findMany({
        where: { productId: result.id },
      });

      expect(movements).toHaveLength(0);
    });

    it('should throw error for duplicate SKU', async () => {
      await productService.add(mockProduct, testUser.id);

      await expect(
        productService.add(mockProduct, testUser.id)
      ).rejects.toThrow();
    });
  });

  describe('get', () => {
    beforeEach(async () => {
      await productService.add(mockProduct, testUser.id);
      await productService.add(
        { ...mockProduct, sku: 'OK-001', name: 'Oakley Holbrook', brand: 'Oakley' },
        testUser.id
      );
    });

    it('should get all active products with stock', async () => {
      const result = await productService.get(
        {},
        { userId: testUser.id, role: 'USER' }
      );

      expect(result).toHaveLength(2);
    });

    it('should filter by brand', async () => {
      const result = await productService.get(
        { brand: 'Ray-Ban' },
        { userId: testUser.id, role: 'USER' }
      );

      expect(result).toHaveLength(1);
      expect(result[0].brand).toBe('Ray-Ban');
    });

    it('should filter by price range', async () => {
      const result = await productService.get(
        { minPrice: '100', maxPrice: '200' },
        { userId: testUser.id, role: 'USER' }
      );

      expect(result.length).toBeGreaterThan(0);
      expect(Number(result[0].price)).toBeGreaterThanOrEqual(100);
      expect(Number(result[0].price)).toBeLessThanOrEqual(200);
    });

    it('should search by name', async () => {
      const result = await productService.get(
        { search: 'Aviator' },
        { userId: testUser.id, role: 'USER' }
      );

      expect(result).toHaveLength(1);
      expect(result[0].name).toContain('Aviator');
    });
  });

  describe('update', () => {
    let createdProduct: any;

    beforeEach(async () => {
      createdProduct = await productService.add(mockProduct, testUser.id);
    });

    it('should update product data', async () => {
      const updates = {
        price: 179.99,
        description: 'Updated description',
      };

      const result = await productService.update(
        { userId: testUser.id, role: 'USER' },
        createdProduct.id,
        updates
      );

      expect(result?.price).toBe(179.99);
      expect(result?.description).toBe('Updated description');
    });

    it('should log stock movement when quantity changes', async () => {
      const updates = {
        quantity: 30,
      };

      await productService.update(
        { userId: testUser.id, role: 'USER' },
        createdProduct.id,
        updates
      );

      const movements = await prisma.stockMovement.findMany({
        where: { productId: createdProduct.id },
        orderBy: { createdAt: 'desc' },
      });

      expect(movements.length).toBeGreaterThanOrEqual(1);
      const latestMovement = movements[movements.length - 1];
      expect(latestMovement.type).toBe('IN');
      expect(latestMovement.quantity).toBe(5); // 30 - 25 = 5
    });
  });

  describe('remove', () => {
    let createdProduct: any;

    beforeEach(async () => {
      createdProduct = await productService.add(mockProduct, testUser.id);
    });

    it('should soft delete product', async () => {
      await productService.remove(createdProduct.id, {
        userId: testUser.id,
        role: 'USER',
      });

      const result = await prisma.product.findUnique({
        where: { id: createdProduct.id },
      });

      expect(result?.isActive).toBe(false);
      expect(result?.quantity).toBe(0);
    });
  });

  describe('getLowStock', () => {
    beforeEach(async () => {
      await productService.add(
        { ...mockProduct, sku: 'LOW-001', quantity: 3, reorderPoint: 5 },
        testUser.id
      );
      await productService.add(
        { ...mockProduct, sku: 'OK-002', quantity: 20, reorderPoint: 5 },
        testUser.id
      );
    });

    it('should return only low stock products', async () => {
      const result = await productService.getLowStock({
        userId: testUser.id,
        role: 'USER',
      });

      expect(result).toHaveLength(1);
      expect(result[0].sku).toBe('LOW-001');
    });
  });
});
