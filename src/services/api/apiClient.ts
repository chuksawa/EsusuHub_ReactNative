import NetInfo from '@react-native-community/netinfo';
import {SecureStorageService} from '../storage/secureStorage';

const API_BASE_URL = __DEV__
  ? 'http://localhost:5166/api' // Development
  : 'https://api.esusuhub.com/api'; // Production

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

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
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
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: any;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
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
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const isConnected = await this.checkNetwork();
    if (!isConnected) {
      throw {
        message: 'No internet connection',
        status: 0,
        code: 'NETWORK_ERROR',
      } as ApiError;
    }

    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers,
      });

      return await this.handleResponse<T>(response);
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
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const isConnected = await this.checkNetwork();
    if (!isConnected) {
      throw {
        message: 'No internet connection',
        status: 0,
        code: 'NETWORK_ERROR',
      } as ApiError;
    }

    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
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
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const isConnected = await this.checkNetwork();
    if (!isConnected) {
      throw {
        message: 'No internet connection',
        status: 0,
        code: 'NETWORK_ERROR',
      } as ApiError;
    }

    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
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
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const isConnected = await this.checkNetwork();
    if (!isConnected) {
      throw {
        message: 'No internet connection',
        status: 0,
        code: 'NETWORK_ERROR',
      } as ApiError;
    }

    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      return await this.handleResponse<T>(response);
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
}

// Singleton instance
export const apiClient = new ApiClient();

