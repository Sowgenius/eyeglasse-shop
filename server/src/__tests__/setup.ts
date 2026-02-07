import { prisma } from '@/lib/prisma';

beforeAll(async () => {
  // Clean up test database before all tests
  await prisma.$transaction([
    prisma.payment.deleteMany(),
    prisma.invoiceItem.deleteMany(),
    prisma.quoteItem.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.prescription.deleteMany(),
    prisma.eyeExam.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.stockMovement.deleteMany(),
    prisma.product.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});

afterAll(async () => {
  // Clean up and disconnect after all tests
  await prisma.$transaction([
    prisma.payment.deleteMany(),
    prisma.invoiceItem.deleteMany(),
    prisma.quoteItem.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.prescription.deleteMany(),
    prisma.eyeExam.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.stockMovement.deleteMany(),
    prisma.product.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up before each test to ensure isolation
  await prisma.$transaction([
    prisma.payment.deleteMany(),
    prisma.invoiceItem.deleteMany(),
    prisma.quoteItem.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.prescription.deleteMany(),
    prisma.eyeExam.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.stockMovement.deleteMany(),
    prisma.product.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});
