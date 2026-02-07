import { verifyToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validate-request';
import { Router } from 'express';
import {
  addPaymentToInvoice,
  createInvoice,
  deleteInvoice,
  getInvoice,
  getInvoices,
  getOverdue,
  updateInvoice,
} from './invoice.controller';
import { invoiceSchema, invoiceUpdateSchema, paymentSchema } from './invoice.validation';

const router = Router();

router.post(
  '/',
  [verifyToken(), validateRequest(invoiceSchema)],
  createInvoice
);

router.get(
  '/',
  [verifyToken()],
  getInvoices
);

router.get(
  '/overdue',
  [verifyToken()],
  getOverdue
);

router.get(
  '/:invoiceId',
  [verifyToken()],
  getInvoice
);

router.patch(
  '/:invoiceId',
  [verifyToken(), validateRequest(invoiceUpdateSchema)],
  updateInvoice
);

router.post(
  '/:invoiceId/payments',
  [verifyToken(), validateRequest(paymentSchema)],
  addPaymentToInvoice
);

router.delete(
  '/:invoiceId',
  [verifyToken()],
  deleteInvoice
);

export const InvoiceRoutes = router;
