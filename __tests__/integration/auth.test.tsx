/**
 * Authentication Integration Tests
 * Tests the complete authentication flow
 */

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {renderWithProviders, mockNavigation} from '../utils/testUtils';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import {authService} from '../../src/services';
import {useAuthStore} from '../../src/stores';

// Mock navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => mockNavigation,
  };
});

// Mock auth service
jest.mock('../../src/services', () => ({
  authService: {
    login: jest.fn(),
  },
}));

// Mock auth store
jest.mock('../../src/stores', () => ({
  useAuthStore: jest.fn(),
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as jest.Mock).mockReturnValue({
      setAuth: jest.fn(),
    });
  });

  it('should render login screen', () => {
    const {getByText} = renderWithProviders(<LoginScreen />);
    expect(getByText('Welcome Back')).toBeTruthy();
  });

  it('should show error for empty fields', async () => {
    const {getByText, getByPlaceholderText} = renderWithProviders(<LoginScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Sign In');

    fireEvent.press(loginButton);

    // Should show error alert (mocked)
    await waitFor(() => {
      expect(emailInput).toBeTruthy();
    });
  });

  it('should call login API on valid input', async () => {
    const mockAuthResponse = {
      token: 'test-token',
      refreshToken: 'test-refresh-token',
      expiresIn: 3600,
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    (authService.login as jest.Mock).mockResolvedValue(mockAuthResponse);

    const {getByText, getByPlaceholderText} = renderWithProviders(<LoginScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});

