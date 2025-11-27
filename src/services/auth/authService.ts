/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import {apiClient} from '../api/apiClient';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  User,
} from '../../types/auth';
import {ApiResponse} from '../../types/api';

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    data: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      '/auth/refresh-token',
      data
    );
    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout', {});
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post('/auth/forgot-password', data);
  }

  /**
   * Reset password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post('/auth/reset-password', data);
  }

  /**
   * Verify email
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<void> {
    await apiClient.post('/auth/verify-email', data);
  }

  /**
   * Resend verification email
   */
  async resendVerification(data: ResendVerificationRequest): Promise<void> {
    await apiClient.post('/auth/resend-verification', data);
  }
}

export const authService = new AuthService();

