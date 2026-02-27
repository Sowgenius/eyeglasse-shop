import * as userService from '../../user/user.service';
import * as reportService from '../report.service';

describe('Report Service', () => {
  let testUser: any;

  beforeEach(async () => {
    const userResult = await userService.create({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
    });
    testUser = userResult.user;
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      const result = await reportService.getDashboardStats({ userId: testUser.id, role: 'USER' });

      expect(result).toBeDefined();
      expect(result.totalCustomers).toBeDefined();
      expect(result.totalProducts).toBeDefined();
      expect(result.totalInvoices).toBeDefined();
    });
  });

  describe('getSalesReport', () => {
    it('should return sales report', async () => {
      const result = await reportService.getSalesReport({}, { userId: testUser.id, role: 'USER' });

      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
    });
  });
});
