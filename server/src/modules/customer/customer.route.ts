import { verifyToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validate-request';
import { Router } from 'express';
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from './customer.controller';
import { customerSchema, customerUpdateSchema, querySchema } from './customer.validation';

const router = Router();

router.post(
  '/',
  [verifyToken(), validateRequest(customerSchema)],
  createCustomer
);

router.get(
  '/',
  [verifyToken()],
  getCustomers
);

router.get(
  '/:customerId',
  [verifyToken()],
  getCustomer
);

router.patch(
  '/:customerId',
  [verifyToken(), validateRequest(customerUpdateSchema)],
  updateCustomer
);

router.delete(
  '/:customerId',
  [verifyToken()],
  deleteCustomer
);

export const CustomerRoutes = router;
