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
router.get('/:productId', verifyToken(), getProductById);
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
