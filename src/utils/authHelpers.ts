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
    // Clear auth store first (immediate UI update)
    const {logout} = useAuthStore.getState();
    logout();

    // Call logout API (fire and forget - don't block on error)
    try {
      const {authService} = await import('../services');
      await authService.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    }

    // Clear secure storage (all auth-related data)
    await SecureStorageService.clearUserSession();
    
    // Also clear AsyncStorage completely in dev mode to ensure clean logout
    if (__DEV__) {
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        // Only clear auth-related keys, not everything
        await Promise.all([
          AsyncStorage.default.removeItem('userLoggedIn'),
          AsyncStorage.default.removeItem('userId'),
          AsyncStorage.default.removeItem('userEmail'),
          AsyncStorage.default.removeItem('userName'),
          AsyncStorage.default.removeItem('userUsername'),
        ]);
      } catch (error) {
        console.warn('Error clearing AsyncStorage:', error);
      }
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Force logout even if there's an error
    const {logout} = useAuthStore.getState();
    logout();
    // Try to clear storage anyway
    try {
      await SecureStorageService.clearUserSession();
    } catch (clearError) {
      console.error('Error clearing storage:', clearError);
    }
  }
}

/**
 * Force clear all auth data (useful for dev/debugging)
 */
export async function forceLogout(): Promise<void> {
  try {
    // Clear auth store
    const {logout} = useAuthStore.getState();
    logout();
    
    // Clear all storage
    await SecureStorageService.clearUserSession();
    
    // Clear AsyncStorage auth keys
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      await Promise.all([
        AsyncStorage.default.removeItem('userLoggedIn'),
        AsyncStorage.default.removeItem('userId'),
        AsyncStorage.default.removeItem('userEmail'),
        AsyncStorage.default.removeItem('userName'),
        AsyncStorage.default.removeItem('userUsername'),
      ]);
    } catch (error) {
      console.warn('Error clearing AsyncStorage:', error);
    }
    
    console.log('✅ Force logout completed - all auth data cleared');
  } catch (error) {
    console.error('Error during force logout:', error);
  }
}

/**
 * Initialize auth state from storage
 */
export async function initializeAuth(): Promise<void> {
  const {setLoading, setAuth, logout, isAuthenticated} = useAuthStore.getState();
  
  // Don't re-initialize if already authenticated (prevents loops)
  if (isAuthenticated) {
    return;
  }
  
  setLoading(true);

  try {
    const token = await SecureStorageService.getAuthToken();
    const refreshToken = await SecureStorageService.getRefreshToken();
    const userId = await SecureStorageService.getItem('userId');
    const userEmail = await SecureStorageService.getItem('userEmail');
    const userName = await SecureStorageService.getItem('userName');

    if (token && refreshToken && userId) {
      // In dev mode, if token starts with "dev_token", skip API validation
      if (__DEV__ && token.startsWith('dev_token')) {
        // Use stored user data or create mock user
        const mockUser = {
          id: userId,
          email: userEmail || 'dev@esusuhub.com',
          firstName: userName?.split(' ')[0] || 'Dev',
          lastName: userName?.split(' ')[1] || 'User',
          phone: '+1234567890',
          avatarUrl: undefined,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setAuth(mockUser, token, refreshToken);
        return;
      }
      
      // Try to validate token by fetching user
      try {
        const {authService} = await import('../services');
        const user = await authService.getCurrentUser();
        setAuth(user, token, refreshToken);
      } catch (error) {
        // In dev mode, if API fails, use stored data instead of logging out
        if (__DEV__) {
          console.debug('API unavailable in dev mode, using stored auth data');
          const mockUser = {
            id: userId,
            email: userEmail || 'dev@esusuhub.com',
            firstName: userName?.split(' ')[0] || 'Dev',
            lastName: userName?.split(' ')[1] || 'User',
            phone: '+1234567890',
            avatarUrl: undefined,
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setAuth(mockUser, token, refreshToken);
        } else {
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
      }
    } else {
      logout();
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
    // In dev mode, don't logout on error - might be network issue
    if (!__DEV__) {
      logout();
    } else {
      setLoading(false);
    }
  } finally {
    setLoading(false);
  }
}

