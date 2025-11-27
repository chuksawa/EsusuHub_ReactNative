/**
 * Notifications Service
 * Handles all notification-related API calls
 */

import {apiClient} from '../api/apiClient';
import {
  Notification,
  NotificationSettings,
} from '../../types/notification';
import {PaginatedResponse} from '../../types/api';

class NotificationsService {
  /**
   * Get notifications
   */
  async getNotifications(params?: {
    page?: number;
    pageSize?: number;
    unreadOnly?: boolean;
  }): Promise<PaginatedResponse<Notification>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());
    if (params?.unreadOnly) queryParams.append('unreadOnly', 'true');

    const endpoint = `/notifications${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    const response = await apiClient.get<PaginatedResponse<Notification>>(
      endpoint
    );
    return response.data;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.put(`/notifications/${notificationId}/read`, {});
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.put('/notifications/read-all', {});
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  }

  /**
   * Get notification settings
   */
  async getSettings(): Promise<NotificationSettings> {
    const response = await apiClient.get<NotificationSettings>(
      '/notifications/settings'
    );
    return response.data;
  }

  /**
   * Update notification settings
   */
  async updateSettings(
    settings: NotificationSettings
  ): Promise<NotificationSettings> {
    const response = await apiClient.put<NotificationSettings>(
      '/notifications/settings',
      settings
    );
    return response.data;
  }
}

export const notificationsService = new NotificationsService();

