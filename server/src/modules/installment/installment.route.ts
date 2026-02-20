import { Router } from 'express';
import { auth } from '@/middlewares/auth';
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
  auth,
  validateRequest(createInstallmentPlanSchema),
  createPlan
);

router.get('/', auth, getPlans);
router.get('/overdue', auth, getOverduePayments);
router.get('/:planId', auth, getPlan);

router.patch(
  '/:planId',
  auth,
  validateRequest(updateInstallmentPlanSchema),
  updatePlan
);

router.patch(
  '/payments/:paymentId',
  auth,
  validateRequest(makePaymentSchema),
  makePayment
);

router.delete('/:planId', auth, cancelPlan);

export { router as InstallmentRoutes };
