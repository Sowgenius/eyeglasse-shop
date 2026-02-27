import { prisma } from '@/lib/prisma';

beforeAll(async () => {
  await prisma.$transaction([
    prisma.installmentPayment.deleteMany(),
    prisma.installmentPlan.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.invoiceItem.deleteMany(),
    prisma.quoteItem.deleteMany(),
    prisma.stockMovement.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.prescription.deleteMany(),
    prisma.eyeExam.deleteMany(),
    prisma.product.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$transaction([
    prisma.installmentPayment.deleteMany(),
    prisma.installmentPlan.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.invoiceItem.deleteMany(),
    prisma.quoteItem.deleteMany(),
    prisma.stockMovement.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.prescription.deleteMany(),
    prisma.eyeExam.deleteMany(),
    prisma.product.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.$transaction([
    prisma.installmentPayment.deleteMany(),
    prisma.installmentPlan.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.invoiceItem.deleteMany(),
    prisma.quoteItem.deleteMany(),
    prisma.stockMovement.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.prescription.deleteMany(),
    prisma.eyeExam.deleteMany(),
    prisma.product.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});
