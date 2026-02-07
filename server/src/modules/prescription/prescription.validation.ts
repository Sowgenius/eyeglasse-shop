import { z } from 'zod';

export const prescriptionSchema = z.object({
  customerId: z.string().uuid(),
  prescriptionDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  prescribedBy: z.string().optional(),
  // Right Eye (OD)
  odSph: z.string().optional(),
  odCyl: z.string().optional(),
  odAxis: z.string().optional(),
  odAdd: z.string().optional(),
  odPd: z.string().optional(),
  // Left Eye (OS)
  osSph: z.string().optional(),
  osCyl: z.string().optional(),
  osAxis: z.string().optional(),
  osAdd: z.string().optional(),
  osPd: z.string().optional(),
  // Additional
  nearPd: z.string().optional(),
  lensTypeRecommended: z.string().optional(),
  notes: z.string().optional(),
});

export const prescriptionUpdateSchema = prescriptionSchema.partial();
