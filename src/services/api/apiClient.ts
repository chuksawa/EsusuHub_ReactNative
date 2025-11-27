import NetInfo from '@react-native-community/netinfo';
import {SecureStorageService} from '../storage/secureStorage';
import config from '../../config/env';
import {refreshAccessToken} from '../../utils/tokenManager';
import {cacheService} from '../cache/cacheService';
import {offlineService} from '../offline/offlineService';
import {logger} from '../../utils/logger';
import {errorHandler} from '../../utils/errorHandler';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || config.API_BASE_URL;
  }

  /**
   * Check network connectivity
   */
  private async checkNetwork(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }

  /**
   * Get authentication headers
   */
  private async getHeaders(): Promise<HeadersInit> {
    const token = await SecureStorageService.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(
    response: Response,
    retryCount: number = 0
  ): Promise<ApiResponse<T>> {
    let data: any;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && retryCount === 0) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry the request with new token
        // Note: This is a simplified retry - in production, you'd want to retry the original request
        throw {
          message: 'Token refreshed, please retry',
          status: 401,
          code: 'TOKEN_REFRESHED',
          shouldRetry: true,
        } as ApiError;
      }
    }

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || data.error || 'Request failed',
        status: response.status,
        code: data.code,
        details: data,
      };
      throw error;
    }

    return {
      data,
      status: response.status,
      message: data.message,
    };
  }

  /**
   * GET request with automatic token refresh and caching
   */
  async get<T>(
    endpoint: string,
    retry: boolean = true,
    useCache: boolean = true
  ): Promise<ApiResponse<T>> {
    const cacheKey = `GET:${endpoint}`;

    // Try cache first if offline or cache enabled
    const isConnected = await this.checkNetwork();
    if (useCache) {
      const cached = await cacheService.get<ApiResponse<T>>(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for ${endpoint}`);
        return cached;
      }
    }

    if (!isConnected) {
      // Return cached data if available, even if expired
      const cached = await cacheService.get<ApiResponse<T>>(cacheKey);
      if (cached) {
        logger.info(`Using stale cache for ${endpoint} (offline)`);
        return cached;
      }
      throw {
        message: 'No internet connection',
        status: 0,
        code: 'NETWORK_ERROR',
      } as ApiError;
    }

    try {
      const headers = await this.getHeaders();
      let response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers,
      });

      // Handle 401 with token refresh
      if (response.status === 401 && retry) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry with new token
          const newHeaders = await this.getHeaders();
          response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: newHeaders,
          });
        }
      }

      const result = await this.handleResponse<T>(response);

      // Cache successful responses
      if (useCache && response.ok) {
        await cacheService.set(cacheKey, result, 5 * 60 * 1000); // 5 minutes
      }

      return result;
    } catch (error: any) {
      // Return cached data on error if available
      if (useCache) {
        const cached = await cacheService.get<ApiResponse<T>>(cacheKey);
        if (cached) {
          logger.info(`Using cached data after error for ${endpoint}`);
          return cached;
        }
      }

      if (error.status && error.message) {
        throw error;
      }
      throw {
        message: error.message || 'Network error occurred',
        status: 0,
        code: 'NETWORK_ERROR',
      } as ApiError;
    }
  }

  /**
   * POST request with automatic token refresh and offline queue
   */
  async post<T>(endpoint: string, data?: any, retry: boolean = true): Promise<ApiResponse<T>> {
    const isConnected = await this.checkNetwork();
    
    // Queue for offline if not connected (except auth endpoints)
    if (!isConnected && !endpoint.includes('/auth/')) {
      const actionId = await offlineService.queueAction('POST', endpoint, data);
      throw {
        message: 'Request queued for when connection is restored',
        status: 0,
        code: 'QUEUED',
        actionId,
      } as ApiError;
    }

    if (!isConnected) {
      throw {
        message: 'No internet connection',
        status: 0,
        code: 'NETWORK_ERROR',
      } as ApiError;
    }

    try {
      const headers = await this.getHeaders();
      let response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      // Handle 401 with token refresh (except for auth endpoints)
      if (response.status === 401 && retry && !endpoint.includes('/auth/')) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry with new token
          const newHeaders = await this.getHeaders();
          response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: newHeaders,
            body: data ? JSON.stringify(data) : undefined,
          });
        }
      }

      const result = await this.handleResponse<T>(response);
      
      // Invalidate related cache entries
      await this.invalidateCache(endpoint);
      
      return result;
    } catch (error: any) {
      // Queue for retry if retryable and offline
      if (!isConnected && errorHandler.isRetryable(error) && !endpoint.includes('/auth/')) {
        await offlineService.queueAction('POST', endpoint, data);
      }
      
      if (error.status && error.message) {
        throw error;
      }
      throw {
        message: error.message || 'Network error occurred',
        status: 0,
        code: 'NETWORK_ERROR',
      } as ApiError;
    }
  }

  /**
   * PUT request with automatic token refresh and offline queue
   */
  async put<T>(endpoint: string, data?: any, retry: boolean = true): Promise<ApiResponse<T>> {
    const isConnected = await this.checkNetwork();
    
    if (!isConnected) {
      await offlineService.queueAction('PUT', endpoint, data);
      throw {
        message: 'Request queued for when connection is restored',
        status: 0,
        code: 'QUEUED',
      } as ApiError;
    }

    try {
      const headers = await this.getHeaders();
      let response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      // Handle 401 with token refresh
      if (response.status === 401 && retry) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry with new token
          const newHeaders = await this.getHeaders();
          response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: newHeaders,
            body: data ? JSON.stringify(data) : undefined,
          });
        }
      }

      const result = await this.handleResponse<T>(response);
      await this.invalidateCache(endpoint);
      return result;
    } catch (error: any) {
      if (error.status && error.message) {
        throw error;
      }
      throw {
        message: error.message || 'Network error occurred',
        status: 0,
        code: 'NETWORK_ERROR',
      } as ApiError;
    }
  }

  /**
   * DELETE request with automatic token refresh and offline queue
   */
  async delete<T>(endpoint: string, retry: boolean = true): Promise<ApiResponse<T>> {
    const isConnected = await this.checkNetwork();
    
    if (!isConnected) {
      await offlineService.queueAction('DELETE', endpoint);
      throw {
        message: 'Request queued for when connection is restored',
        status: 0,
        code: 'QUEUED',
      } as ApiError;
    }

    try {
      const headers = await this.getHeaders();
      let response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      // Handle 401 with token refresh
      if (response.status === 401 && retry) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry with new token
          const newHeaders = await this.getHeaders();
          response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: newHeaders,
          });
        }
      }

      const result = await this.handleResponse<T>(response);
      await this.invalidateCache(endpoint);
      return result;
    } catch (error: any) {
      if (error.status && error.message) {
        throw error;
      }
      throw {
        message: error.message || 'Network error occurred',
        status: 0,
        code: 'NETWORK_ERROR',
      } as ApiError;
    }
  }

  /**
   * Invalidate cache entries related to an endpoint
   */
  private async invalidateCache(endpoint: string): Promise<void> {
    try {
      // Get all cache keys
      const keys = await require('@react-native-async-storage/async-storage').default.getAllKeys();
      const cacheKeys = keys.filter((key: string) => key.startsWith('@cache:'));
      
      // Invalidate related cache entries
      for (const key of cacheKeys) {
        if (key.includes(endpoint.split('/')[1])) {
          // Remove cache entry
          const originalKey = key.replace('@cache:', '');
          await cacheService.remove(originalKey);
        }
      }
    } catch (error) {
      logger.error('Error invalidating cache', error);
    }
  }
}

// Singleton instance
export const apiClient = new ApiClient();

