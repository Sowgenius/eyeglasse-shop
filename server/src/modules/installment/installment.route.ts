import { Router } from 'express';
import { verifyToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validate-request';
import {
  createPlan,
  getPlans,
  getPlan,
  makePayment,
  getOverduePayments,
  cancelPlan,
  updatePlan,
} from './installment.controller';
import {
  createInstallmentPlanSchema,
  makePaymentSchema,
  updateInstallmentPlanSchema,
} from './installment.validation';

const router = Router();

router.post(
  '/',
  verifyToken(),
  validateRequest(createInstallmentPlanSchema),
  createPlan
);

router.get('/', verifyToken(), getPlans);
router.get('/overdue', verifyToken(), getOverduePayments);
router.get('/:planId', verifyToken(), getPlan);

router.patch(
  '/:planId',
  verifyToken(),
  validateRequest(updateInstallmentPlanSchema),
  updatePlan
);

router.patch(
  '/payments/:paymentId',
  verifyToken(),
  validateRequest(makePaymentSchema),
  makePayment
);

router.delete('/:planId', verifyToken(), cancelPlan);

export { router as InstallmentRoutes };
