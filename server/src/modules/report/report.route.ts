import { verifyToken } from '@/middlewares/auth';
import { Router } from 'express';
import {
  getDashboard,
  getProductPerformance,
  getSalesReport,
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

router.get(
  '/products',
  [verifyToken()],
  getProductPerformance
);

export const ReportRoutes = router;
