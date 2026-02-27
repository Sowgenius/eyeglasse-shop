import * as userService from '../../user/user.service';
import * as invoiceService from '../invoice.service';
import * as customerService from '../../customer/customer.service';

describe('Invoice Service', () => {
  let testUser: any;
  let testCustomer: any;

  beforeEach(async () => {
    const userResult = await userService.create({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
    });
    testUser = userResult.user;

    testCustomer = await customerService.create(
      {
        firstName: 'John',
        lastName: 'Doe',
        email: `john${Date.now()}@example.com`,
      },
      testUser.id
    );
  });

  describe('create', () => {
    it('should create an invoice with items', async () => {
      const result = await invoiceService.create(
        {
          customerId: testCustomer.id,
          items: [
            {
              description: 'Test Product',
              quantity: 2,
              unitPrice: 500,
              discount: 0,
            },
          ],
          taxRate: 0,
          dueDate: new Date().toISOString(),
        },
        testUser.id
      );

      expect(result).toBeDefined();
      expect(result.invoiceNumber).toBeDefined();
    });
  });

  describe('getAll', () => {
    it('should return invoices with pagination', async () => {
      await invoiceService.create(
        {
          customerId: testCustomer.id,
          items: [{ description: 'Test', quantity: 1, unitPrice: 100, discount: 0 }],
          taxRate: 0,
          dueDate: new Date().toISOString(),
        },
        testUser.id
      );

      const result = await invoiceService.getAll({ page: 1, limit: 10 }, { userId: testUser.id, role: 'USER' });

      expect(result.data).toBeDefined();
      expect(result.pagination).toBeDefined();
    });
  });
});
