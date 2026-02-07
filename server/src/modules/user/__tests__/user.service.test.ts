import { AppError } from '@/utils';
import * as userService from '../user.service';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

describe('User Service', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const result = await userService.create(mockUser);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(mockUser.email);
      expect(result.user.name).toBe(mockUser.name);
      expect(result.user.password).not.toBe(mockUser.password); // Should be hashed
      expect(result.token).toBeDefined();

      // Verify user in database
      const dbUser = await prisma.user.findUnique({
        where: { email: mockUser.email },
      });
      expect(dbUser).toBeDefined();
    });

    it('should throw error for duplicate email', async () => {
      await userService.create(mockUser);

      await expect(userService.create(mockUser)).rejects.toThrow();
    });

    it('should assign USER role by default', async () => {
      const result = await userService.create(mockUser);

      expect(result.user.role).toBe('USER');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await userService.create(mockUser);
    });

    it('should login with valid credentials', async () => {
      const result = await userService.login({
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(mockUser.email);
      expect(result.token).toBeDefined();

      // Verify JWT token
      const decoded = jwt.decode(result.token) as any;
      expect(decoded.userId).toBe(result.user.id);
      expect(decoded.role).toBe('USER');
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        userService.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(AppError);
    });

    it('should throw error for wrong password', async () => {
      await expect(
        userService.login({
          email: mockUser.email,
          password: 'wrongpassword',
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe('getUser', () => {
    let createdUser: any;

    beforeEach(async () => {
      const result = await userService.create(mockUser);
      createdUser = result.user;
    });

    it('should get user by jwt payload', async () => {
      const result = await userService.getUser({
        userId: createdUser.id,
        role: createdUser.role,
      });

      expect(result.id).toBe(createdUser.id);
      expect(result.email).toBe(mockUser.email);
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        userService.getUser({
          userId: 'non-existent-id',
          role: 'USER',
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe('deleteAccount', () => {
    let createdUser: any;

    beforeEach(async () => {
      const result = await userService.create(mockUser);
      createdUser = result.user;
    });

    it('should delete user and all related data', async () => {
      const result = await userService.deleteAccount(
        { password: mockUser.password },
        createdUser.id
      );

      expect(result.id).toBe(createdUser.id);

      // Verify user is deleted
      const dbUser = await prisma.user.findUnique({
        where: { id: createdUser.id },
      });
      expect(dbUser).toBeNull();
    });

    it('should throw error for wrong password', async () => {
      await expect(
        userService.deleteAccount(
          { password: 'wrongpassword' },
          createdUser.id
        )
      ).rejects.toThrow(AppError);
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        userService.deleteAccount(
          { password: mockUser.password },
          'non-existent-id'
        )
      ).rejects.toThrow(AppError);
    });
  });
});
