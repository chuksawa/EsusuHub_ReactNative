import AsyncStorage from '@react-native-async-storage/async-storage';
import SecureKeyStore from 'react-native-secure-key-store';

const STORAGE_KEYS = {
  USER_LOGGED_IN: 'userLoggedIn',
  USER_ID: 'userId',
  USER_EMAIL: 'userEmail',
  USER_NAME: 'userName',
  USER_USERNAME: 'userUsername',
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
};

/**
 * Secure storage service for sensitive data
 */
export class SecureStorageService {
  /**
   * Store sensitive data securely
   */
  static async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await SecureKeyStore.set(key, value);
    } catch (error) {
      console.error(`Error storing secure item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Retrieve sensitive data securely
   */
  static async getSecureItem(key: string): Promise<string | null> {
    try {
      const value = await SecureKeyStore.get(key);
      return value;
    } catch (error) {
      console.error(`Error retrieving secure item ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove sensitive data
   */
  static async removeSecureItem(key: string): Promise<void> {
    try {
      await SecureKeyStore.remove(key);
    } catch (error) {
      console.error(`Error removing secure item ${key}:`, error);
    }
  }

  /**
   * Store non-sensitive data
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error storing item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Retrieve non-sensitive data
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error retrieving item ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove non-sensitive data
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  /**
   * Clear all storage
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      // Note: SecureKeyStore doesn't have a clear all method
      // You would need to remove items individually
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Convenience methods for auth tokens
  static async setAuthToken(token: string): Promise<void> {
    await this.setSecureItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  static async getAuthToken(): Promise<string | null> {
    return await this.getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  static async setUserSession(userData: {
    id?: string;
    email?: string;
    name?: string;
    username?: string;
    token?: string;
  }): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_LOGGED_IN, 'true');
    if (userData.id) await this.setItem(STORAGE_KEYS.USER_ID, userData.id);
    if (userData.email) await this.setItem(STORAGE_KEYS.USER_EMAIL, userData.email);
    if (userData.name) await this.setItem(STORAGE_KEYS.USER_NAME, userData.name);
    if (userData.username) await this.setItem(STORAGE_KEYS.USER_USERNAME, userData.username);
    if (userData.token) await this.setAuthToken(userData.token);
  }

  static async clearUserSession(): Promise<void> {
    await Promise.all([
      this.removeItem(STORAGE_KEYS.USER_LOGGED_IN),
      this.removeItem(STORAGE_KEYS.USER_ID),
      this.removeItem(STORAGE_KEYS.USER_EMAIL),
      this.removeItem(STORAGE_KEYS.USER_NAME),
      this.removeItem(STORAGE_KEYS.USER_USERNAME),
      this.removeSecureItem(STORAGE_KEYS.AUTH_TOKEN),
      this.removeSecureItem(STORAGE_KEYS.REFRESH_TOKEN),
    ]);
  }

  static async isUserLoggedIn(): Promise<boolean> {
    const loggedIn = await this.getItem(STORAGE_KEYS.USER_LOGGED_IN);
    return loggedIn === 'true';
  }
}

