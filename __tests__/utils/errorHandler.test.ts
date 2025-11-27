/**
 * Error Handler Tests
 */

import {errorHandler} from '../../src/utils/errorHandler';
import {ApiError} from '../../src/types/api';

describe('ErrorHandler', () => {
  beforeEach(() => {
    errorHandler.clearLogs();
  });

  describe('logError', () => {
    it('should log error with message', () => {
      errorHandler.logError('Test error');
      const logs = errorHandler.getErrorLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].message).toBe('Test error');
    });

    it('should log Error object', () => {
      const error = new Error('Test error');
      errorHandler.logError(error);
      const logs = errorHandler.getErrorLogs();
      expect(logs[0].message).toBe('Test error');
      expect(logs[0].stack).toBeDefined();
    });

    it('should log ApiError with status', () => {
      const apiError: ApiError = {
        message: 'API error',
        status: 404,
        code: 'NOT_FOUND',
      };
      errorHandler.logError(apiError);
      const logs = errorHandler.getErrorLogs();
      expect(logs[0].status).toBe(404);
      expect(logs[0].code).toBe('NOT_FOUND');
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return user-friendly message for network error', () => {
      const error: ApiError = {
        message: 'Network error',
        status: 0,
        code: 'NETWORK_ERROR',
      };
      const message = errorHandler.getUserFriendlyMessage(error);
      expect(message).toContain('internet connection');
    });

    it('should return user-friendly message for 401', () => {
      const error: ApiError = {
        message: 'Unauthorized',
        status: 401,
      };
      const message = errorHandler.getUserFriendlyMessage(error);
      expect(message).toContain('session has expired');
    });

    it('should return user-friendly message for 404', () => {
      const error: ApiError = {
        message: 'Not found',
        status: 404,
      };
      const message = errorHandler.getUserFriendlyMessage(error);
      expect(message).toContain('not found');
    });

    it('should return user-friendly message for 500', () => {
      const error: ApiError = {
        message: 'Server error',
        status: 500,
      };
      const message = errorHandler.getUserFriendlyMessage(error);
      expect(message).toContain('Server error');
    });
  });

  describe('isRetryable', () => {
    it('should return true for network errors', () => {
      const error: ApiError = {
        message: 'Network error',
        status: 0,
        code: 'NETWORK_ERROR',
      };
      expect(errorHandler.isRetryable(error)).toBe(true);
    });

    it('should return true for server errors', () => {
      const error: ApiError = {
        message: 'Server error',
        status: 500,
      };
      expect(errorHandler.isRetryable(error)).toBe(true);
    });

    it('should return true for rate limiting', () => {
      const error: ApiError = {
        message: 'Too many requests',
        status: 429,
      };
      expect(errorHandler.isRetryable(error)).toBe(true);
    });

    it('should return false for client errors', () => {
      const error: ApiError = {
        message: 'Bad request',
        status: 400,
      };
      expect(errorHandler.isRetryable(error)).toBe(false);
    });
  });

  describe('getRetryDelay', () => {
    it('should calculate exponential backoff', () => {
      const error: ApiError = {
        message: 'Network error',
        status: 0,
        code: 'NETWORK_ERROR',
      };
      const delay1 = errorHandler.getRetryDelay(error, 1);
      const delay2 = errorHandler.getRetryDelay(error, 2);
      const delay3 = errorHandler.getRetryDelay(error, 3);

      expect(delay1).toBe(1000);
      expect(delay2).toBe(2000);
      expect(delay3).toBe(4000);
    });

    it('should cap delay at max', () => {
      const error: ApiError = {
        message: 'Network error',
        status: 0,
        code: 'NETWORK_ERROR',
      };
      const delay = errorHandler.getRetryDelay(error, 10);
      expect(delay).toBeLessThanOrEqual(30000);
    });
  });
});

