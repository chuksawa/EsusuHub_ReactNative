/**
 * Authentication Helpers
 * Utility functions for authentication flow
 */

import {SecureStorageService} from '../services/storage/secureStorage';
import {useAuthStore} from '../stores';

/**
 * Logout user and clear all auth data
 */
export async function logoutUser(): Promise<void> {
  try {
    // Call logout API (fire and forget - don't block on error)
    try {
      const {authService} = await import('../services');
      await authService.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    }

    // Clear secure storage
    await SecureStorageService.clearUserSession();

    // Clear auth store
    const {logout} = useAuthStore.getState();
    logout();
  } catch (error) {
    console.error('Error during logout:', error);
    // Force logout even if there's an error
    const {logout} = useAuthStore.getState();
    logout();
  }
}

/**
 * Initialize auth state from storage
 */
export async function initializeAuth(): Promise<void> {
  const {setLoading, setAuth, logout} = useAuthStore.getState();
  setLoading(true);

  try {
    const token = await SecureStorageService.getAuthToken();
    const refreshToken = await SecureStorageService.getRefreshToken();
    const userId = await SecureStorageService.getItem('userId');
    const userEmail = await SecureStorageService.getItem('userEmail');
    const userName = await SecureStorageService.getItem('userName');

    if (token && refreshToken && userId) {
      // Try to validate token by fetching user
      try {
        const {authService} = await import('../services');
        const user = await authService.getCurrentUser();
        setAuth(user, token, refreshToken);
      } catch (error) {
        // Token might be expired - try refresh
        const {refreshAccessToken} = await import('./tokenManager');
        const newToken = await refreshAccessToken();
        if (newToken) {
          const {authService} = await import('../services');
          const user = await authService.getCurrentUser();
          setAuth(user, newToken, refreshToken);
        } else {
          // Refresh failed - clear auth
          await SecureStorageService.clearUserSession();
          logout();
        }
      }
    } else {
      logout();
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
    logout();
  } finally {
    setLoading(false);
  }
}

