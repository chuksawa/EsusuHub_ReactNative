/**
 * User Service
 * Handles all user-related API calls
 */

import {apiClient} from '../api/apiClient';
import {
  UserProfile,
  UpdateUserRequest,
  Achievement,
  UserTransaction,
} from '../../types/user';
import {PaginatedResponse} from '../../types/api';

class UserService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/users/me');
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateUserRequest): Promise<UserProfile> {
    const response = await apiClient.put<UserProfile>('/users/me', data);
    return response.data;
  }

  /**
   * Get user achievements
   */
  async getAchievements(): Promise<Achievement[]> {
    const response = await apiClient.get<Achievement[]>('/users/me/achievements');
    return response.data;
  }

  /**
   * Get user transactions
   */
  async getTransactions(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<UserTransaction>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());

    const endpoint = `/users/me/transactions${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    const response = await apiClient.get<PaginatedResponse<UserTransaction>>(
      endpoint
    );
    return response.data;
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(uri: string): Promise<{avatarUrl: string}> {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);

    // Note: apiClient needs to handle FormData differently
    // For now, using fetch directly
    const {SecureStorageService} = await import('../storage/secureStorage');
    const config = await import('../../config/env');
    const token = await SecureStorageService.getAuthToken();
    
    const response = await fetch(`${config.config.API_BASE_URL}/users/me/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({message: 'Failed to upload avatar'}));
      throw new Error(error.message || 'Failed to upload avatar');
    }

    const data = await response.json();
    return data;
  }

  /**
   * Search users
   */
  async searchUsers(query: string): Promise<UserProfile[]> {
    const response = await apiClient.get<UserProfile[]>(
      `/users/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  }
}

export const userService = new UserService();

