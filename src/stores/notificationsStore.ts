/**
 * Notifications Store
 * Manages user notifications and notification settings
 */

import {create} from 'zustand';
import {Notification, NotificationSettings} from '../types/notification';

interface NotificationsState {
  // State
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  setSettings: (settings: NotificationSettings) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  settings: null,
  isLoading: false,
  error: null,
  
  // Actions
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
  
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.read
        ? state.unreadCount
        : state.unreadCount + 1,
    })),
  
  markAsRead: (notificationId) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === notificationId ? {...n, read: true} : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),
  
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({...n, read: true})),
      unreadCount: 0,
    })),
  
  removeNotification: (notificationId) =>
    set((state) => {
      const notification = state.notifications.find(
        (n) => n.id === notificationId
      );
      return {
        notifications: state.notifications.filter(
          (n) => n.id !== notificationId
        ),
        unreadCount: notification?.read
          ? state.unreadCount
          : Math.max(0, state.unreadCount - 1),
      };
    }),
  
  setSettings: (settings) => set({settings}),
  
  setLoading: (isLoading) => set({isLoading}),
  
  setError: (error) => set({error}),
  
  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
      settings: null,
      isLoading: false,
      error: null,
    }),
}));

