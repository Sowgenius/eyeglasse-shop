import { verifyToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validate-request';
import { Router } from 'express';
import {
  createPrescription,
  deletePrescription,
  getPrescription,
  getPrescriptions,
  updatePrescription,
} from './prescription.controller';
import { prescriptionSchema, prescriptionUpdateSchema } from './prescription.validation';

const router = Router();

router.post(
  '/',
  [verifyToken(), validateRequest(prescriptionSchema)],
  createPrescription
);

router.get(
  '/',
  [verifyToken()],
  getPrescriptions
);

router.get(
  '/:prescriptionId',
  [verifyToken()],
  getPrescription
);

router.patch(
  '/:prescriptionId',
  [verifyToken(), validateRequest(prescriptionUpdateSchema)],
  updatePrescription
);

router.delete(
  '/:prescriptionId',
  [verifyToken()],
  deletePrescription
);

export const PrescriptionRoutes = router;
