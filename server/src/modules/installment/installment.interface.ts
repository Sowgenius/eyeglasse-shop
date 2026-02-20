import { z } from 'zod';
import {
  createInstallmentPlanSchema,
  makePaymentSchema,
  updateInstallmentPlanSchema,
} from './installment.validation';

export type CreateInstallmentPlan = z.infer<typeof createInstallmentPlanSchema>;
export type MakePayment = z.infer<typeof makePaymentSchema>;
export type UpdateInstallmentPlan = z.infer<typeof updateInstallmentPlanSchema>;
