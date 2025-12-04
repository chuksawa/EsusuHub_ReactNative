/**
 * Push Notification Service
 * Handles push notification registration, permissions, and display
 */

import PushNotification from 'react-native-push-notification';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {logger} from '../../utils/logger';
import {apiClient} from '../api/apiClient';

class PushNotificationService {
  private isInitialized = false;
  private deviceToken: string | null = null;

  /**
   * Initialize push notifications
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Request permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        // Permissions not granted - this is expected and fine
        // Push notifications are optional, app will work without them
        return;
      }

      // Configure push notification channel (Android)
      this.configureNotificationChannel();

      // Create notification channel
      PushNotification.configure({
        onRegister: async (token: {token: string; os: string}) => {
          this.deviceToken = token.token;
          logger.info('Push notification token registered', {token: token.token});
          await this.registerDeviceToken(token.token);
        },

        onNotification: (notification: any) => {
          logger.info('Push notification received', notification);
          
          // Handle notification tap
          if (notification.userInteraction) {
            this.handleNotificationTap(notification);
          }

          // Show local notification if app is in foreground
          if (notification.foreground) {
            PushNotification.localNotification({
              title: notification.title,
              message: notification.message || notification.body,
              playSound: true,
              soundName: 'default',
            });
          }
        },

        onAction: (notification: any) => {
          logger.info('Push notification action', notification);
        },

        onRegistrationError: (err: Error) => {
          logger.error('Push notification registration error', err);
        },

        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        popInitialNotification: true,
        requestPermissions: Platform.OS === 'ios',
      });

      this.isInitialized = true;
      logger.info('Push notifications initialized');
    } catch (error) {
      logger.error('Error initializing push notifications', error);
    }
  }

  /**
   * Request notification permissions
   */
  private async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const apiLevel = await DeviceInfo.getApiLevel();
        
        if (apiLevel >= 33) {
          // Android 13+ uses granular permissions
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          ]);
          return granted[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] === 'granted';
        }
        return true; // Android < 13 doesn't need runtime permission
      } catch (error) {
        logger.error('Error requesting Android permissions', error);
        return false;
      }
    } else {
      // iOS permissions are requested via PushNotification.configure
      return true;
    }
  }

  /**
   * Configure notification channel (Android)
   */
  private configureNotificationChannel(): void {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'esusuhub-default',
          channelName: 'EsusuHub Notifications',
          channelDescription: 'Notifications for EsusuHub app',
          playSound: true,
          soundName: 'default',
          importance: 4, // High importance
          vibrate: true,
        },
        (created: boolean) => {
          logger.info('Notification channel created', {created});
        }
      );
    }
  }

  /**
   * Register device token with backend
   */
  private async registerDeviceToken(token: string): Promise<void> {
    try {
      const deviceInfo = {
        token,
        platform: Platform.OS,
        deviceId: await DeviceInfo.getUniqueId(),
        deviceName: await DeviceInfo.getDeviceName(),
        appVersion: await DeviceInfo.getVersion(),
      };

      await apiClient.post('/notifications/register-device', deviceInfo);
      logger.info('Device token registered with backend');
    } catch (error) {
      logger.error('Error registering device token', error);
    }
  }

  /**
   * Handle notification tap
   */
  private handleNotificationTap(notification: any): void {
    const data = notification.data || notification.userInfo;
    
    if (data?.screen) {
      // Navigate to specific screen
      // This will be handled by deep linking
      logger.info('Notification tap - navigate to', data.screen);
    }
  }

  /**
   * Get device token
   */
  getDeviceToken(): string | null {
    return this.deviceToken;
  }

  /**
   * Schedule local notification
   */
  scheduleLocalNotification(
    title: string,
    message: string,
    data?: any,
    date?: Date
  ): void {
    PushNotification.localNotificationSchedule({
      title,
      message,
      date: date || new Date(Date.now() + 1000), // 1 second from now
      userInfo: data,
      playSound: true,
      soundName: 'default',
      channelId: 'esusuhub-default',
    });
  }

  /**
   * Cancel all local notifications
   */
  cancelAllNotifications(): void {
    PushNotification.cancelAllLocalNotifications();
  }

  /**
   * Cancel specific notification
   */
  cancelNotification(id: string): void {
    PushNotification.cancelLocalNotifications({id});
  }

  /**
   * Get delivered notifications
   */
  async getDeliveredNotifications(): Promise<any[]> {
    return new Promise((resolve) => {
      PushNotification.getDeliveredNotifications((notifications: any[]) => {
        resolve(notifications);
      });
    });
  }

  /**
   * Remove delivered notification
   */
  removeDeliveredNotification(id: string): void {
    PushNotification.removeDeliveredNotification(id);
  }

  /**
   * Set application badge count
   */
  setBadgeCount(count: number): void {
    PushNotification.setApplicationIconBadgeNumber(count);
  }

  /**
   * Clear badge count
   */
  clearBadge(): void {
    PushNotification.setApplicationIconBadgeNumber(0);
  }
}

export const pushNotificationService = new PushNotificationService();

