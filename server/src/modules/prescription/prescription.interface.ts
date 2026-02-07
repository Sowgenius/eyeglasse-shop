import { z } from 'zod';
import { prescriptionSchema, prescriptionUpdateSchema } from './prescription.validation';

export type Prescription = z.infer<typeof prescriptionSchema>;
export type PrescriptionUpdate = z.infer<typeof prescriptionUpdateSchema>;
