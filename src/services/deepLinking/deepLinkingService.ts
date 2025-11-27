/**
 * Deep Linking Service
 * Handles deep links and universal links
 */

import {Linking} from 'react-native';
import {logger} from '../../utils/logger';

export interface DeepLinkData {
  screen: string;
  params?: Record<string, any>;
}

class DeepLinkingService {
  private listeners: Array<(data: DeepLinkData) => void> = [];
  private initialUrl: string | null = null;

  /**
   * Initialize deep linking
   */
  async initialize(): Promise<void> {
    // Get initial URL if app was opened via deep link
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      this.initialUrl = initialUrl;
      logger.info('App opened with deep link', {url: initialUrl});
      this.handleDeepLink(initialUrl);
    }

    // Listen for deep links while app is running
    Linking.addEventListener('url', (event: {url: string}) => {
      logger.info('Deep link received', {url: event.url});
      this.handleDeepLink(event.url);
    });
  }

  /**
   * Handle deep link URL
   */
  private handleDeepLink(url: string): void {
    try {
      const parsed = this.parseDeepLink(url);
      if (parsed) {
        this.notifyListeners(parsed);
      }
    } catch (error) {
      logger.error('Error handling deep link', error);
    }
  }

  /**
   * Parse deep link URL
   */
  private parseDeepLink(url: string): DeepLinkData | null {
    try {
      // Remove scheme prefix
      const cleanUrl = url.replace(/esusuhub:\/\//, '').replace(/https?:\/\/.*?\/+/, '');

      // Parse path and params
      const [path, queryString] = cleanUrl.split('?');
      const params: Record<string, any> = {};

      if (queryString) {
        queryString.split('&').forEach(param => {
          const [key, value] = param.split('=');
          if (key && value) {
            params[decodeURIComponent(key)] = decodeURIComponent(value);
          }
        });
      }

      // Map path to screen
      const screen = this.mapPathToScreen(path);

      return {
        screen,
        params: Object.keys(params).length > 0 ? params : undefined,
      };
    } catch (error) {
      logger.error('Error parsing deep link', error);
      return null;
    }
  }

  /**
   * Map URL path to screen name
   */
  private mapPathToScreen(path: string): string {
    const pathMap: Record<string, string> = {
      '': 'Home',
      'home': 'Home',
      'groups': 'Groups',
      'group': 'GroupDetail',
      'groups/create': 'CreateGroup',
      'payment': 'Payment',
      'profile': 'Profile',
      'notifications': 'Notifications',
      'login': 'Login',
      'register': 'Register',
      'verify-email': 'VerifyEmail',
      'reset-password': 'ResetPassword',
    };

    return pathMap[path.toLowerCase()] || 'Home';
  }

  /**
   * Add listener for deep links
   */
  addListener(callback: (data: DeepLinkData) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(data: DeepLinkData): void {
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        logger.error('Error in deep link listener', error);
      }
    });
  }

  /**
   * Get initial URL
   */
  getInitialUrl(): string | null {
    return this.initialUrl;
  }

  /**
   * Build deep link URL
   */
  buildDeepLink(screen: string, params?: Record<string, any>): string {
    const screenPath = this.mapScreenToPath(screen);
    let url = `esusuhub://${screenPath}`;

    if (params && Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      url += `?${queryString}`;
    }

    return url;
  }

  /**
   * Map screen name to URL path
   */
  private mapScreenToPath(screen: string): string {
    const screenMap: Record<string, string> = {
      'Home': 'home',
      'Groups': 'groups',
      'GroupDetail': 'group',
      'CreateGroup': 'groups/create',
      'Payment': 'payment',
      'Profile': 'profile',
      'Notifications': 'notifications',
      'Login': 'login',
      'Register': 'register',
      'VerifyEmail': 'verify-email',
      'ResetPassword': 'reset-password',
    };

    return screenMap[screen] || 'home';
  }
}

export const deepLinkingService = new DeepLinkingService();

