import { prisma } from '@/lib/prisma';
import * as customerService from '../customer.service';
import * as userService from '../../user/user.service';

describe('Customer Service', () => {
  let testUser: any;
  let managerUser: any;

  beforeEach(async () => {
    // Create test users
    const userResult = await userService.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    testUser = userResult.user;

    const managerResult = await userService.create({
      name: 'Manager User',
      email: 'manager@example.com',
      password: 'password123',
    });
    managerUser = managerResult.user;
    
    // Update manager role
    await prisma.user.update({
      where: { id: managerUser.id },
      data: { role: 'MANAGER' },
    });
    managerUser.role = 'MANAGER';
  });

  const mockCustomer = {
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie@example.com',
    phone: '+33 6 12 34 56 78',
    address: '15 Rue de la Paix',
    city: 'Paris',
    postalCode: '75002',
    birthDate: '1985-03-15',
    notes: 'Client régulier',
    insuranceProvider: 'Mutuelle Générale',
    insuranceNumber: 'MG123456',
  };

  describe('create', () => {
    it('should create a new customer', async () => {
      const result = await customerService.create(mockCustomer, testUser.id);

      expect(result).toBeDefined();
      expect(result.firstName).toBe(mockCustomer.firstName);
      expect(result.lastName).toBe(mockCustomer.lastName);
      expect(result.email).toBe(mockCustomer.email);
      expect(result.userId).toBe(testUser.id);
      expect(result.birthDate).toBeInstanceOf(Date);
    });

    it('should create customer without optional fields', async () => {
      const minimalCustomer = {
        firstName: 'Jean',
        lastName: 'Martin',
      };

      const result = await customerService.create(minimalCustomer, testUser.id);

      expect(result.firstName).toBe(minimalCustomer.firstName);
      expect(result.lastName).toBe(minimalCustomer.lastName);
      expect(result.email).toBeNull();
    });
  });

  describe('getAll', () => {
    beforeEach(async () => {
      // Create multiple customers
      await customerService.create(mockCustomer, testUser.id);
      await customerService.create(
        {
          firstName: 'Pierre',
          lastName: 'Durand',
          email: 'pierre@example.com',
        },
        testUser.id
      );
      await customerService.create(
        {
          firstName: 'Sophie',
          lastName: 'Martin',
          email: 'sophie@example.com',
        },
        managerUser.id
      );
    });

    it('should get all customers for manager', async () => {
      const result = await customerService.getAll(
        { page: '1', limit: '10' },
        { userId: managerUser.id, role: 'MANAGER' }
      );

      expect(result.data).toHaveLength(3);
      expect(result.pagination.total).toBe(3);
    });

    it('should get only own customers for regular user', async () => {
      const result = await customerService.getAll(
        { page: '1', limit: '10' },
        { userId: testUser.id, role: 'USER' }
      );

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should search customers by name', async () => {
      const result = await customerService.getAll(
        { search: 'Marie', page: '1', limit: '10' },
        { userId: testUser.id, role: 'USER' }
      );

      expect(result.data).toHaveLength(1);
      expect(result.data[0].firstName).toBe('Marie');
    });

    it('should paginate results', async () => {
      const result = await customerService.getAll(
        { page: '1', limit: '1' },
        { userId: managerUser.id, role: 'MANAGER' }
      );

      expect(result.data).toHaveLength(1);
      expect(result.pagination.totalPages).toBe(3);
    });
  });

  describe('getById', () => {
    let createdCustomer: any;

    beforeEach(async () => {
      createdCustomer = await customerService.create(mockCustomer, testUser.id);
    });

    it('should get customer by id', async () => {
      const result = await customerService.getById(
        createdCustomer.id,
        { userId: testUser.id, role: 'USER' }
      );

      expect(result).toBeDefined();
      expect(result?.id).toBe(createdCustomer.id);
      expect(result?.firstName).toBe(mockCustomer.firstName);
    });

    it('should return null for non-existent customer', async () => {
      const result = await customerService.getById(
        'non-existent-id',
        { userId: testUser.id, role: 'USER' }
      );

      expect(result).toBeNull();
    });

    it('should include invoices and prescriptions', async () => {
      // Create a prescription for the customer
      await prisma.prescription.create({
        data: {
          customerId: createdCustomer.id,
          userId: testUser.id,
          prescriptionDate: new Date(),
          odSph: '-2.50',
        },
      });

      const result = await customerService.getById(
        createdCustomer.id,
        { userId: testUser.id, role: 'USER' }
      );

      expect(result?.prescriptions).toBeDefined();
      expect(result?.prescriptions.length).toBeGreaterThan(0);
    });
  });

  describe('update', () => {
    let createdCustomer: any;

    beforeEach(async () => {
      createdCustomer = await customerService.create(mockCustomer, testUser.id);
    });

    it('should update customer data', async () => {
      const updates = {
        firstName: 'Marie-Claire',
        phone: '+33 7 98 76 54 32',
      };

      const result = await customerService.update(
        createdCustomer.id,
        updates,
        { userId: testUser.id, role: 'USER' }
      );

      expect(result.firstName).toBe(updates.firstName);
      expect(result.phone).toBe(updates.phone);
      expect(result.lastName).toBe(mockCustomer.lastName); // Unchanged
    });

    it('should update birth date', async () => {
      const updates = {
        birthDate: '1990-01-01',
      };

      const result = await customerService.update(
        createdCustomer.id,
        updates,
        { userId: testUser.id, role: 'USER' }
      );

      expect(result.birthDate).toBeInstanceOf(Date);
    });
  });

  describe('remove', () => {
    let createdCustomer: any;

    beforeEach(async () => {
      createdCustomer = await customerService.create(mockCustomer, testUser.id);
    });

    it('should delete customer', async () => {
      await customerService.remove(
        createdCustomer.id,
        { userId: testUser.id, role: 'USER' }
      );

      const result = await prisma.customer.findUnique({
        where: { id: createdCustomer.id },
      });

      expect(result).toBeNull();
    });

    it('should allow manager to delete any customer', async () => {
      await customerService.remove(
        createdCustomer.id,
        { userId: managerUser.id, role: 'MANAGER' }
      );

      const result = await prisma.customer.findUnique({
        where: { id: createdCustomer.id },
      });

      expect(result).toBeNull();
    });
  });
});
