import { z } from 'zod';

export const installmentFrequency = ['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY'] as const;
export const installmentStatus = ['ACTIVE', 'PAID', 'CANCELLED', 'DEFAULTED'] as const;
export const paymentStatus = ['PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'WAIVED'] as const;

export const createInstallmentPlanSchema = z.object({
  invoiceId: z.string().uuid(),
  totalAmount: z.number().positive(),
  numPayments: z.number().int().min(2).max(24), // 2 to 24 payments
  frequency: z.enum(installmentFrequency),
  startDate: z.string().datetime(),
  lateFeePercent: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export const makePaymentSchema = z.object({
  amount: z.number().positive(),
  paymentMethod: z.enum([
    'CASH',
    'CHECK',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'BANK_TRANSFER',
    'OTHER',
  ]),
  notes: z.string().optional(),
});

export const updateInstallmentPlanSchema = z.object({
  notes: z.string().optional(),
  lateFeePercent: z.number().min(0).max(100).optional(),
});

export type CreateInstallmentPlan = z.infer<typeof createInstallmentPlanSchema>;
export type MakePayment = z.infer<typeof makePaymentSchema>;
