import { ErrorResponse } from '@/interface/errors';
import { env } from '@config';
import { AppError } from '@utils';
import { ZodError } from 'zod';

function getStack(stack: string | undefined) {
  return env.isDevelopment ? stack : undefined;
}

export function appError(error: AppError): ErrorResponse {
  return {
    status: error.status,
    message: error.message,
    error: {
      sources: [],
      stack: getStack(error.stack),
    },
  };
}

export function serverError(error: Error): ErrorResponse {
  return {
    status: 500,
    message: 'Internal Server Error',
    error: {
      sources: [],
      stack: getStack(error.stack),
    },
  };
}

export function zodError(error: ZodError): ErrorResponse {
  const sources = error.issues.map((issue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  return {
    status: 403,
    message: 'Validation error',
    error: {
      sources,
      stack: getStack(error.stack),
    },
  };
}

export function duplicateError(error: any): ErrorResponse {
  const { keyValue } = error;
  const sources = Object.keys(keyValue).map((path) => {
    return {
      path,
      message: `${keyValue[path]} already exists`,
    };
  });

  return {
    status: 409,
    message: 'Duplicate key error',
    error: {
      sources,
      stack: getStack(error.stack),
    },
  };
}
