import * as userService from '../../user/user.service';
import * as prescriptionService from '../prescription.service';
import * as customerService from '../../customer/customer.service';

describe('Prescription Service', () => {
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
    it('should create a prescription', async () => {
      const result = await prescriptionService.create(
        {
          customerId: testCustomer.id,
          prescriptionDate: new Date().toISOString(),
          odSph: '-1.00',
          osSph: '-1.50',
        },
        testUser.id
      );

      expect(result).toBeDefined();
      expect(result.odSph).toBe('-1.00');
    });
  });

  describe('getAll', () => {
    it('should return prescriptions with pagination', async () => {
      await prescriptionService.create(
        {
          customerId: testCustomer.id,
          prescriptionDate: new Date().toISOString(),
          odSph: '-1.00',
        },
        testUser.id
      );

      const result = await prescriptionService.getAll({ page: 1, limit: 10 }, { userId: testUser.id, role: 'USER' });

      expect(result.data).toBeDefined();
    });
  });
});
