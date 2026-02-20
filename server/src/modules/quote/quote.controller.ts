import { sendEmail, generateQuoteEmail } from '@/lib/email';
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
  const quoteId = req.params.quoteId as string;
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
  const quoteId = req.params.quoteId as string;
  const data = await quoteServices.update(quoteId, req.body, req.jwtPayload);

  return sendResponse(res, {
    message: 'Quote updated successfully',
    data,
  });
});

export const deleteQuote = catchAsync(async (req: Request, res) => {
  const quoteId = req.params.quoteId as string;
  await quoteServices.remove(quoteId, req.jwtPayload);

  return sendResponse(res, {
    message: 'Quote deleted successfully',
  });
});

export const sendQuote = catchAsync(async (req: Request, res) => {
  const quoteId = req.params.quoteId as string;

  // Get quote with customer details first
  const quote = await quoteServices.getById(quoteId, req.jwtPayload);

  if (!quote) {
    return sendResponse(res, {
      status: 404,
      message: 'Quote not found',
    });
  }

  if (!quote.customer?.email) {
    return sendResponse(res, {
      status: 400,
      message: 'Customer email not found. Cannot send quote.',
    });
  }

  const data = await quoteServices.update(
    quoteId,
    { status: 'SENT' },
    req.jwtPayload
  );

  // Send email notification
  try {
    await sendEmail({
      to: quote.customer.email,
      subject: `Votre devis ${quote.quoteNumber} - Optician Pro`,
      html: generateQuoteEmail(
        quote.quoteNumber,
        Number(quote.total),
        quote.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ),
    });
  } catch (error) {
    // Log error but don't fail the request - quote is still marked as sent
    console.error('Failed to send quote email:', error);
  }

  return sendResponse(res, {
    message: 'Quote sent successfully',
    data,
  });
});
