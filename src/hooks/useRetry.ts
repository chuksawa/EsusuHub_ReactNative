/**
 * useRetry Hook
 * Provides retry functionality for async operations
 */

import {useState, useCallback} from 'react';
import {errorHandler} from '../utils/errorHandler';

interface UseRetryOptions {
  maxRetries?: number;
  onRetry?: (attempt: number) => void;
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
}

export function useRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: UseRetryOptions = {}
) {
  const {maxRetries = 3, onRetry, onSuccess, onFailure} = options;
  const [attempt, setAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const execute = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      let lastError: Error | null = null;

      for (let i = 0; i <= maxRetries; i++) {
        try {
          setAttempt(i);
          if (i > 0) {
            setIsRetrying(true);
            if (onRetry) {
              onRetry(i);
            }

            // Wait before retry with exponential backoff
            if (lastError) {
              const delay = errorHandler.getRetryDelay(lastError, i);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }

          const result = await fn(...args);
          
          if (i > 0) {
            setIsRetrying(false);
            if (onSuccess) {
              onSuccess();
            }
          }

          return result;
        } catch (error: any) {
          lastError = error;
          errorHandler.logError(error);

          // Don't retry if error is not retryable
          if (!errorHandler.isRetryable(error)) {
            if (onFailure) {
              onFailure(error);
            }
            throw error;
          }

          // Last attempt failed
          if (i === maxRetries) {
            setIsRetrying(false);
            if (onFailure) {
              onFailure(error);
            }
            throw error;
          }
        }
      }

      throw lastError || new Error('Max retries exceeded');
    },
    [fn, maxRetries, onRetry, onSuccess, onFailure]
  );

  return {
    execute,
    attempt,
    isRetrying,
  };
}

