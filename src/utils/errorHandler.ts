/**
 * Global Error Handler
 * Centralized error handling and logging
 */

import {ApiError} from '../types/api';

export interface ErrorLog {
  message: string;
  code?: string;
  status?: number;
  timestamp: string;
  stack?: string;
  context?: any;
}

class ErrorHandler {
  private errorLogs: ErrorLog[] = [];
  private maxLogs = 100;

  /**
   * Log an error
   */
  logError(error: Error | ApiError | string, context?: any): void {
    const errorLog: ErrorLog = {
      message: typeof error === 'string' ? error : error.message || 'Unknown error',
      code: typeof error === 'object' && 'code' in error ? error.code : undefined,
      status: typeof error === 'object' && 'status' in error ? error.status : undefined,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
      context,
    };

    this.errorLogs.push(errorLog);

    // Keep only the last maxLogs entries
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs.shift();
    }

    // Log to console in development
    if (__DEV__) {
      console.error('Error logged:', errorLog);
    }

    // In production, you might want to send to error reporting service
    // Example: Sentry.captureException(error, {extra: context});
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error: Error | ApiError | string): string {
    if (typeof error === 'string') {
      return error;
    }

    const apiError = error as ApiError;

    // Network errors
    if (apiError.code === 'NETWORK_ERROR' || apiError.status === 0) {
      return 'No internet connection. Please check your network and try again.';
    }

    // HTTP status codes
    switch (apiError.status) {
      case 400:
        return apiError.message || 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. This item may already exist.';
      case 422:
        return apiError.message || 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
      case 502:
      case 503:
        return 'Server error. Please try again later.';
      default:
        return apiError.message || 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryable(error: Error | ApiError): boolean {
    const apiError = error as ApiError;

    // Network errors are retryable
    if (apiError.code === 'NETWORK_ERROR' || apiError.status === 0) {
      return true;
    }

    // Server errors are retryable
    if (apiError.status && apiError.status >= 500) {
      return true;
    }

    // Rate limiting is retryable after delay
    if (apiError.status === 429) {
      return true;
    }

    return false;
  }

  /**
   * Get retry delay in milliseconds
   */
  getRetryDelay(error: Error | ApiError, attempt: number): number {
    const apiError = error as ApiError;

    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    const baseDelay = 1000;
    const maxDelay = 30000;
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);

    // Rate limiting: use Retry-After header if available
    if (apiError.status === 429 && apiError.details?.retryAfter) {
      return apiError.details.retryAfter * 1000;
    }

    return delay;
  }

  /**
   * Get error logs
   */
  getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  /**
   * Clear error logs
   */
  clearLogs(): void {
    this.errorLogs = [];
  }
}

export const errorHandler = new ErrorHandler();

