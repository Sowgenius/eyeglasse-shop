import { verifyToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validate-request';
import { Router } from 'express';
import {
  addProduct,
  bulkDeleteProducts,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from './product.controller';
import { bulkDeleteSchema, productSchema } from './product.validation';

const router = Router();

router.get('/', verifyToken(), getProducts);
router.get('/low-stock', verifyToken(), async (req, res, next) => {
  const { catchAsync } = await import('@/utils');
  const { sendResponse } = await import('@/utils/send-response');
  const { prisma } = await import('@/lib/prisma');
  
  catchAsync(async (req, res) => {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        quantity: { lte: 10 }, // Low stock threshold
      },
      orderBy: { quantity: 'asc' },
    });
    sendResponse(res, { message: 'Low stock products retrieved', data: products });
  })(req, res, next);
});
router.get('/:productId', verifyToken(), getProductById);
router.post(
  '/',
  [verifyToken(), validateRequest(productSchema)],
  addProduct
);
router.post(
  '/add',
  [verifyToken(), validateRequest(productSchema)],
  addProduct
);
router.patch(
  '/:productId',
  [verifyToken(), validateRequest(productSchema.deepPartial())],
  updateProduct
);
router.delete(
  '/bulk-delete',
  [verifyToken(), validateRequest(bulkDeleteSchema)],
  bulkDeleteProducts
);
router.delete('/:productId', [verifyToken()], deleteProduct);

export const ProductRoutes = router;
