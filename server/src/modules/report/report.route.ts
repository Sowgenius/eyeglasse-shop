import { verifyToken } from '@/middlewares/auth';
import { Router } from 'express';
import {
  getDashboard,
  getProductPerformance,
  getSalesReport,
  getSalesHistory,
} from './report.controller';

const router = Router();

router.get(
  '/dashboard',
  [verifyToken()],
  getDashboard
);

router.get(
  '/sales',
  [verifyToken()],
  getSalesReport
);

// Alias for /sales-history (used by frontend)
router.get(
  '/sales-history',
  [verifyToken()],
  getSalesHistory
);

// Sales history with grouping
router.get(
  '/sales-chart',
  [verifyToken()],
  getSalesHistory
);

router.get(
  '/products',
  [verifyToken()],
  getProductPerformance
);

export const ReportRoutes = router;
