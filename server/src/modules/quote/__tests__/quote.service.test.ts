import * as userService from '../../user/user.service';
import * as quoteService from '../quote.service';

describe('Quote Service', () => {
  let testUser: any;
  let testCustomer: any;

  beforeEach(async () => {
    const userResult = await userService.create({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
    });
    testUser = userResult.user;

    testCustomer = await require('../../customer/customer.service').create(
      {
        firstName: 'John',
        lastName: 'Doe',
        email: `john${Date.now()}@example.com`,
      },
      testUser.id
    );
  });

  describe('create', () => {
    it('should create a quote with items', async () => {
      const result = await quoteService.create(
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
        },
        testUser.id
      );

      expect(result).toBeDefined();
      expect(result.quoteNumber).toBeDefined();
    });
  });

  describe('getAll', () => {
    it('should return quotes with pagination', async () => {
      await quoteService.create(
        {
          customerId: testCustomer.id,
          items: [{ description: 'Test', quantity: 1, unitPrice: 100, discount: 0 }],
          taxRate: 0,
        },
        testUser.id
      );

      const result = await quoteService.getAll({ page: 1, limit: 10 }, { userId: testUser.id, role: 'USER' });

      expect(result.data).toBeDefined();
      expect(result.pagination).toBeDefined();
    });
  });
});
