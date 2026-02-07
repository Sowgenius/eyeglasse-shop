import { catchAsync } from '@/utils';
import { sendResponse } from '@/utils/send-response';
import { Request } from 'express';
import { Quote, QuoteUpdate } from './quote.interface';
import * as quoteServices from './quote.service';

export const createQuote = catchAsync<Quote>(async (req: Request, res) => {
  const data = await quoteServices.create(req.body, req.jwtPayload.userId);

  return sendResponse(res, {
    status: 201,
    message: 'Quote created successfully',
    data,
  });
});

export const getQuotes = catchAsync(async (req: Request, res) => {
  const data = await quoteServices.getAll(req.query, req.jwtPayload);

  return sendResponse(res, {
    message: 'Quotes retrieved successfully',
    data,
  });
});

export const getQuote = catchAsync(async (req: Request, res) => {
  const { quoteId } = req.params;
  const data = await quoteServices.getById(quoteId, req.jwtPayload);

  if (!data) {
    return sendResponse(res, {
      status: 404,
      message: 'Quote not found',
    });
  }

  return sendResponse(res, {
    message: 'Quote retrieved successfully',
    data,
  });
});

export const updateQuote = catchAsync<QuoteUpdate>(async (req: Request, res) => {
  const { quoteId } = req.params;
  const data = await quoteServices.update(quoteId, req.body, req.jwtPayload);

  return sendResponse(res, {
    message: 'Quote updated successfully',
    data,
  });
});

export const deleteQuote = catchAsync(async (req: Request, res) => {
  const { quoteId } = req.params;
  await quoteServices.remove(quoteId, req.jwtPayload);

  return sendResponse(res, {
    message: 'Quote deleted successfully',
  });
});

export const sendQuote = catchAsync(async (req: Request, res) => {
  const { quoteId } = req.params;
  const data = await quoteServices.update(
    quoteId,
    { status: 'SENT' },
    req.jwtPayload
  );

  // TODO: Send email notification

  return sendResponse(res, {
    message: 'Quote sent successfully',
    data,
  });
});
