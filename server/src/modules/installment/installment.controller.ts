import { catchAsync } from '@/utils';
import { sendResponse } from '@/utils/send-response';
import { Request } from 'express';
import {
  CreateInstallmentPlan,
  MakePayment,
  UpdateInstallmentPlan,
} from './installment.interface';
import * as installmentService from './installment.service';

export const createPlan = catchAsync<CreateInstallmentPlan>(
  async (req: Request, res) => {
    const data = await installmentService.createPlan(
      req.body,
      req.jwtPayload.userId
    );

    return sendResponse(res, {
      status: 201,
      message: 'Installment plan created successfully',
      data,
    });
  }
);

export const getPlans = catchAsync(async (req: Request, res) => {
  const data = await installmentService.getAll(req.query, req.jwtPayload);

  return sendResponse(res, {
    message: 'Installment plans retrieved successfully',
    data,
  });
});

export const getPlan = catchAsync(async (req: Request, res) => {
  const planId = req.params.planId as string;
  const data = await installmentService.getById(planId, req.jwtPayload);

  if (!data) {
    return sendResponse(res, {
      status: 404,
      message: 'Installment plan not found',
    });
  }

  return sendResponse(res, {
    message: 'Installment plan retrieved successfully',
    data,
  });
});

export const makePayment = catchAsync<MakePayment>(async (req: Request, res) => {
  const paymentId = req.params.paymentId as string;
  const data = await installmentService.makePayment(
    paymentId,
    req.body,
    req.jwtPayload.userId
  );

  return sendResponse(res, {
    message: 'Payment recorded successfully',
    data,
  });
});

export const getOverduePayments = catchAsync(async (req: Request, res) => {
  const data = await installmentService.getOverduePayments(req.jwtPayload);

  return sendResponse(res, {
    message: 'Overdue payments retrieved successfully',
    data,
  });
});

export const cancelPlan = catchAsync(async (req: Request, res) => {
  const planId = req.params.planId as string;
  const data = await installmentService.cancelPlan(planId, req.jwtPayload);

  return sendResponse(res, {
    message: 'Installment plan cancelled successfully',
    data,
  });
});

export const updatePlan = catchAsync<UpdateInstallmentPlan>(
  async (req: Request, res) => {
    const planId = req.params.planId as string;
    const data = await installmentService.updatePlan(
      planId,
      req.body,
      req.jwtPayload
    );

    return sendResponse(res, {
      message: 'Installment plan updated successfully',
      data,
    });
  }
);
