/**
 * Auth Service Tests
 */

import {authService} from '../../src/services/auth/authService';
import {apiClient} from '../../src/services/api/apiClient';
import {createMockResponse, createMockError} from '../utils/testUtils';

// Mock API client
jest.mock('../../src/services/api/apiClient');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = createMockResponse({
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        expiresIn: 3600,
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.token).toBe('test-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should handle login error', async () => {
      const mockError = createMockError('Invalid credentials', 401);
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrong-password',
        })
      ).rejects.toEqual(mockError);
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = createMockResponse({
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        expiresIn: 3600,
        user: {
          id: '1',
          email: 'new@example.com',
          firstName: 'New',
          lastName: 'User',
          emailVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.register({
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        phone: '+1234567890',
        password: 'password123',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        phone: '+1234567890',
        password: 'password123',
      });
      expect(result.token).toBe('test-token');
      expect(result.user.email).toBe('new@example.com');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = createMockResponse({
        token: 'new-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600,
      });

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.refreshToken({
        refreshToken: 'old-refresh-token',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh-token', {
        refreshToken: 'old-refresh-token',
      });
      expect(result.token).toBe('new-token');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockResponse = createMockResponse(mockUser);
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.getCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });
  });
});

