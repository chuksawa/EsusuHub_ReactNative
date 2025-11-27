/**
 * Notification Types
 */

export interface Notification {
  id: string;
  type: 'payment' | 'group' | 'system' | 'achievement';
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  paymentNotifications: boolean;
  groupNotifications: boolean;
  systemNotifications: boolean;
}

