import { catchAsync } from '@/utils';
import { sendResponse } from '@/utils/send-response';
import { Request } from 'express';
import * as reportServices from './report.service';

export const getDashboard = catchAsync(async (req: Request, res) => {
  const data = await reportServices.getDashboardStats(req.jwtPayload);

  return sendResponse(res, {
    message: 'Dashboard stats retrieved successfully',
    data,
  });
});

export const getSalesReport = catchAsync(async (req: Request, res) => {
  const data = await reportServices.getSalesReport(req.query, req.jwtPayload);

  return sendResponse(res, {
    message: 'Sales report retrieved successfully',
    data,
  });
});

export const getProductPerformance = catchAsync(async (req: Request, res) => {
  const data = await reportServices.getProductPerformance(req.query, req.jwtPayload);

  return sendResponse(res, {
    message: 'Product performance retrieved successfully',
    data,
  });
});
