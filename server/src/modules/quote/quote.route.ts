import { verifyToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validate-request';
import { Router } from 'express';
import {
  createQuote,
  deleteQuote,
  getQuote,
  getQuotes,
  sendQuote,
  updateQuote,
} from './quote.controller';
import { quoteSchema, quoteUpdateSchema } from './quote.validation';

const router = Router();

router.post(
  '/',
  [verifyToken(), validateRequest(quoteSchema)],
  createQuote
);

router.get(
  '/',
  [verifyToken()],
  getQuotes
);

router.get(
  '/:quoteId',
  [verifyToken()],
  getQuote
);

router.patch(
  '/:quoteId',
  [verifyToken(), validateRequest(quoteUpdateSchema)],
  updateQuote
);

router.post(
  '/:quoteId/send',
  [verifyToken()],
  sendQuote
);

router.delete(
  '/:quoteId',
  [verifyToken()],
  deleteQuote
);

export const QuoteRoutes = router;
