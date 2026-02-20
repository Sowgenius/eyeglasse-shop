import * as handle from '@helpers/handle-errors';
import { AppError } from '@utils';
import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from 'interface/errors';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

let errorResponse: ErrorResponse = {
  success: false,
  status: 500,
  message: 'Internal server error',
  error: {
    sources: [],
    stack: undefined,
  },
};

export function globalCatch(
  error:
    | ZodError
    | Prisma.PrismaClientKnownRequestError
    | AppError
    | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Reset error response for each request
  errorResponse = {
    success: false,
    status: 500,
    message: 'Internal server error',
    error: {
      sources: [],
      stack: undefined,
    },
  };

  if (error instanceof ZodError) {
    const zError = handle.zodError(error);
    errorResponse = { ...errorResponse, ...zError };
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma errors
    if (error.code === 'P2002') {
      // Unique constraint violation
      errorResponse = {
        ...errorResponse,
        status: 409,
        message: 'Duplicate entry',
        error: {
          sources: [{ path: 'database', message: 'Record already exists' }],
          stack: error.stack,
        },
      };
    } else if (error.code === 'P2025') {
      // Record not found
      errorResponse = {
        ...errorResponse,
        status: 404,
        message: 'Record not found',
        error: {
          sources: [{ path: 'database', message: 'The requested record was not found' }],
          stack: error.stack,
        },
      };
    } else {
      errorResponse = {
        ...errorResponse,
        status: 400,
        message: 'Database error',
        error: {
          sources: [{ path: 'database', message: error.message }],
          stack: error.stack,
        },
      };
    }
  } else if (error instanceof AppError) {
    const appError = handle.appError(error);
    errorResponse = { ...errorResponse, ...appError };
  } else if (error instanceof Error) {
    const serverError = handle.serverError(error);
    errorResponse = { ...errorResponse, ...serverError };
  }

  const { status, ...response } = errorResponse;

  return res.status(status).json(response);
}
