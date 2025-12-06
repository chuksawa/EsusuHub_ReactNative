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
    try {
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
    } catch (error: any) {
      // In development mode, return mock data if API fails
      if (__DEV__ && (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR' || error.status === 0)) {
        return this.getMockNotifications(params);
      }
      throw error;
    }
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

  /**
   * Get mock notifications for development
   */
  private getMockNotifications(params?: {
    page?: number;
    pageSize?: number;
    unreadOnly?: boolean;
  }): PaginatedResponse<Notification> {
    const now = new Date();
    const mockNotifications: Notification[] = [
      {
        id: 'notif-1',
        type: 'payment',
        title: 'Payment Received',
        message: 'Your payment of ₦50,000 to Family Savings Circle has been confirmed',
        read: false,
        data: { paymentId: 'payment-1', groupId: 'group-1' },
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-2',
        type: 'group',
        title: 'Group Invitation',
        message: 'You have been invited to join "Business Investment Pool"',
        read: false,
        data: { groupId: 'group-4' },
        createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-3',
        type: 'payment',
        title: 'Payment Due Reminder',
        message: 'Your monthly contribution of ₦30,000 to Vacation Fund Group is due in 3 days',
        read: true,
        data: { groupId: 'group-2', amount: 30000 },
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-4',
        type: 'payment',
        title: 'Payout Ready',
        message: 'Your payout of ₦500,000 from Family Savings Circle is ready for collection',
        read: false,
        data: { payoutId: 'payout-1', groupId: 'group-1', amount: 500000 },
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-5',
        type: 'system',
        title: 'Account Activity',
        message: 'A new deposit of ₦450,000 has been made to your Premium Savings Account',
        read: true,
        data: { transactionId: 'txn-1', accountId: 'mock-account-1' },
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-6',
        type: 'system',
        title: 'System Update',
        message: 'New features are now available! Check out the improved banking dashboard',
        read: true,
        data: {},
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-7',
        type: 'payment',
        title: 'Payment Failed',
        message: 'Your payment of ₦25,000 to Emergency Fund could not be processed. Please try again',
        read: false,
        data: { paymentId: 'payment-8', groupId: 'group-3' },
        createdAt: new Date(now.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-8',
        type: 'group',
        title: 'Group Member Joined',
        message: 'A new member has joined your Family Savings Circle group',
        read: true,
        data: { groupId: 'group-1' },
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-9',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'Congratulations! You\'ve made 10 successful payments. Keep it up!',
        read: false,
        data: { achievementId: 'achievement-10-payments' },
        createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-10',
        type: 'payment',
        title: 'Payment Processing',
        message: 'Your payment of ₦30,000 to Vacation Fund Group is being processed',
        read: true,
        data: { paymentId: 'payment-5', groupId: 'group-2' },
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Filter by unreadOnly if provided
    let filteredNotifications = params?.unreadOnly
      ? mockNotifications.filter(n => !n.read)
      : mockNotifications;

    // Sort by createdAt (newest first)
    filteredNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      data: filteredNotifications,
      total: filteredNotifications.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || 20,
    };
  }
}

export const notificationsService = new NotificationsService();

