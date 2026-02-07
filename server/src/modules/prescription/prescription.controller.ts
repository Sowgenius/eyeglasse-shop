import { catchAsync } from '@/utils';
import { sendResponse } from '@/utils/send-response';
import { Request } from 'express';
import { Prescription, PrescriptionUpdate } from './prescription.interface';
import * as prescriptionServices from './prescription.service';

export const createPrescription = catchAsync<Prescription>(async (req: Request, res) => {
  const data = await prescriptionServices.create(req.body, req.jwtPayload.userId);

  return sendResponse(res, {
    status: 201,
    message: 'Prescription created successfully',
    data,
  });
});

export const getPrescriptions = catchAsync(async (req: Request, res) => {
  const data = await prescriptionServices.getAll(req.query, req.jwtPayload);

  return sendResponse(res, {
    message: 'Prescriptions retrieved successfully',
    data,
  });
});

export const getPrescription = catchAsync(async (req: Request, res) => {
  const { prescriptionId } = req.params;
  const data = await prescriptionServices.getById(prescriptionId, req.jwtPayload);

  if (!data) {
    return sendResponse(res, {
      status: 404,
      message: 'Prescription not found',
    });
  }

  return sendResponse(res, {
    message: 'Prescription retrieved successfully',
    data,
  });
});

export const updatePrescription = catchAsync<PrescriptionUpdate>(async (req: Request, res) => {
  const { prescriptionId } = req.params;
  const data = await prescriptionServices.update(prescriptionId, req.body, req.jwtPayload);

  return sendResponse(res, {
    message: 'Prescription updated successfully',
    data,
  });
});

export const deletePrescription = catchAsync(async (req: Request, res) => {
  const { prescriptionId } = req.params;
  await prescriptionServices.remove(prescriptionId, req.jwtPayload);

  return sendResponse(res, {
    message: 'Prescription deleted successfully',
  });
});
