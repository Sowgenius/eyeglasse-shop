import { Router } from 'express';
import { CustomerRoutes } from './modules/customer/customer.route';
import { ProductRoutes } from './modules/product/product.route';
import { QuoteRoutes } from './modules/quote/quote.route';
import { InvoiceRoutes } from './modules/invoice/invoice.route';
import { PrescriptionRoutes } from './modules/prescription/prescription.route';
import { ReportRoutes } from './modules/report/report.route';
import { UserRoutes } from './modules/user/user.route';
import { InstallmentRoutes } from './modules/installment/installment.route';
import { TransactionRoutes } from './modules/transaction/transaction.route';
import { SalesRoutes } from './modules/sales/sales.route';
import { prisma } from './lib/prisma';

const router = Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Database connection failed',
    });
  }
});

router.use('/', UserRoutes);
router.use('/customers', CustomerRoutes);
router.use('/products', ProductRoutes);
router.use('/quotes', QuoteRoutes);
router.use('/invoices', InvoiceRoutes);
router.use('/prescriptions', PrescriptionRoutes);
router.use('/reports', ReportRoutes);
router.use('/installments', InstallmentRoutes);
router.use('/transactions', TransactionRoutes);
router.use('/sales', SalesRoutes);

export default router;
