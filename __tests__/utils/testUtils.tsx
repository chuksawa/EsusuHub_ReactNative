/**
 * Test Utilities
 * Helper functions and components for testing
 */

import React from 'react';
import {render, RenderOptions} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

/**
 * Custom render function with providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({children}: {children: React.ReactNode}) {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>{children}</NavigationContainer>
      </GestureHandlerRootView>
    );
  }

  return render(ui, {wrapper: Wrapper, ...options});
}

/**
 * Mock API response helper
 */
export function createMockResponse<T>(data: T, status: number = 200) {
  return {
    data,
    status,
    message: 'Success',
  };
}

/**
 * Mock API error helper
 */
export function createMockError(message: string, status: number = 500, code?: string) {
  return {
    message,
    status,
    code,
  };
}

/**
 * Wait for async operations
 */
export function waitForAsync() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Mock navigation
 */
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(),
  getState: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
};

/**
 * Mock route
 */
export function createMockRoute(params: any = {}) {
  return {
    key: 'test-route',
    name: 'Test',
    params,
  };
}

