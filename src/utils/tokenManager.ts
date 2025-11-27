/**
 * Token Manager
 * Handles token refresh and expiration
 */

import {SecureStorageService} from '../services/storage/secureStorage';
import {authService} from '../services';
import {useAuthStore} from '../stores/authStore';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Refresh the access token using the refresh token
 */
export async function refreshAccessToken(): Promise<string | null> {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = await SecureStorageService.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken({refreshToken});
      
      // Store new tokens
      await SecureStorageService.setAuthToken(response.token);
      await SecureStorageService.setRefreshToken(response.refreshToken);
      
      // Update auth store
      const {setToken, setRefreshToken} = useAuthStore.getState();
      setToken(response.token);
      setRefreshToken(response.refreshToken);
      
      return response.token;
    } catch (error) {
      // Refresh failed - clear auth state
      await handleTokenRefreshFailure();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Handle token refresh failure - logout user
 */
async function handleTokenRefreshFailure(): Promise<void> {
  const {logout} = useAuthStore.getState();
  await SecureStorageService.clearUserSession();
  logout();
}

/**
 * Check if token is expired (basic check - can be enhanced with JWT decoding)
 */
export function isTokenExpired(token: string): boolean {
  try {
    // Basic check - in production, decode JWT and check exp claim
    // For now, we'll rely on 401 responses to trigger refresh
    return false;
  } catch {
    return true;
  }
}

