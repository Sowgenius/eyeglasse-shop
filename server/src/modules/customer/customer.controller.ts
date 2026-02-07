import { catchAsync } from '@/utils';
import { sendResponse } from '@/utils/send-response';
import { Request } from 'express';
import { Customer, CustomerUpdate, Query } from './customer.interface';
import * as customerServices from './customer.service';

export const createCustomer = catchAsync<Customer>(async (req: Request, res) => {
  const data = await customerServices.create(req.body, req.jwtPayload.userId);

  return sendResponse(res, {
    status: 201,
    message: 'Customer created successfully',
    data,
  });
});

export const getCustomers = catchAsync(async (req: Request, res) => {
  const query = req.query as unknown as Query;
  const data = await customerServices.getAll(query, req.jwtPayload);

  return sendResponse(res, {
    message: 'Customers retrieved successfully',
    data,
  });
});

export const getCustomer = catchAsync(async (req: Request, res) => {
  const { customerId } = req.params;
  const data = await customerServices.getById(customerId, req.jwtPayload);

  if (!data) {
    return sendResponse(res, {
      status: 404,
      message: 'Customer not found',
    });
  }

  return sendResponse(res, {
    message: 'Customer retrieved successfully',
    data,
  });
});

export const updateCustomer = catchAsync<CustomerUpdate>(async (req: Request, res) => {
  const { customerId } = req.params;
  const data = await customerServices.update(customerId, req.body, req.jwtPayload);

  return sendResponse(res, {
    message: 'Customer updated successfully',
    data,
  });
});

export const deleteCustomer = catchAsync(async (req: Request, res) => {
  const { customerId } = req.params;
  await customerServices.remove(customerId, req.jwtPayload);

  return sendResponse(res, {
    message: 'Customer deleted successfully',
  });
});
