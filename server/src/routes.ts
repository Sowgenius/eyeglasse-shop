import { Router } from 'express';
import { CustomerRoutes } from './modules/customer/customer.route';
import { ProductRoutes } from './modules/product/product.route';
import { QuoteRoutes } from './modules/quote/quote.route';
import { InvoiceRoutes } from './modules/invoice/invoice.route';
import { PrescriptionRoutes } from './modules/prescription/prescription.route';
import { ReportRoutes } from './modules/report/report.route';
import { UserRoutes } from './modules/user/user.route';

const router = Router();

router.use('/', UserRoutes);
router.use('/customers', CustomerRoutes);
router.use('/products', ProductRoutes);
router.use('/quotes', QuoteRoutes);
router.use('/invoices', InvoiceRoutes);
router.use('/prescriptions', PrescriptionRoutes);
router.use('/reports', ReportRoutes);

export default router;
