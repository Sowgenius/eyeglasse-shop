import { catchAsync } from '@/utils';
import { sendResponse } from '@/utils/send-response';
import { Request } from 'express';
import { Invoice, InvoiceUpdate, Payment } from './invoice.interface';
import * as invoiceServices from './invoice.service';

export const createInvoice = catchAsync<Invoice>(async (req: Request, res) => {
  const data = await invoiceServices.create(req.body, req.jwtPayload.userId);

  return sendResponse(res, {
    status: 201,
    message: 'Invoice created successfully',
    data,
  });
});

export const getInvoices = catchAsync(async (req: Request, res) => {
  const data = await invoiceServices.getAll(req.query, req.jwtPayload);

  return sendResponse(res, {
    message: 'Invoices retrieved successfully',
    data,
  });
});

export const getInvoice = catchAsync(async (req: Request, res) => {
  const { invoiceId } = req.params;
  const data = await invoiceServices.getById(invoiceId, req.jwtPayload);

  if (!data) {
    return sendResponse(res, {
      status: 404,
      message: 'Invoice not found',
    });
  }

  return sendResponse(res, {
    message: 'Invoice retrieved successfully',
    data,
  });
});

export const updateInvoice = catchAsync<InvoiceUpdate>(async (req: Request, res) => {
  const { invoiceId } = req.params;
  const data = await invoiceServices.update(invoiceId, req.body, req.jwtPayload);

  return sendResponse(res, {
    message: 'Invoice updated successfully',
    data,
  });
});

export const deleteInvoice = catchAsync(async (req: Request, res) => {
  const { invoiceId } = req.params;
  await invoiceServices.remove(invoiceId, req.jwtPayload);

  return sendResponse(res, {
    message: 'Invoice cancelled successfully',
  });
});

export const addPaymentToInvoice = catchAsync<Payment>(async (req: Request, res) => {
  const { invoiceId } = req.params;
  const data = await invoiceServices.addPayment(invoiceId, req.body, req.jwtPayload.userId);

  return sendResponse(res, {
    message: 'Payment added successfully',
    data,
  });
});

export const getOverdue = catchAsync(async (req: Request, res) => {
  const data = await invoiceServices.getOverdueInvoices(req.jwtPayload);

  return sendResponse(res, {
    message: 'Overdue invoices retrieved successfully',
    data,
  });
});
