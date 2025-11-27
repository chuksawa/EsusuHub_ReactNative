/**
 * Auth Store Tests
 */

import {renderHook, act} from '@testing-library/react-hooks';
import {useAuthStore} from '../../src/stores/authStore';

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const {result} = renderHook(() => useAuthStore());
    act(() => {
      result.current.clearAuth();
    });
  });

  it('should initialize with default state', () => {
    const {result} = renderHook(() => useAuthStore());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    expect(result.current.isLoading).toBe(true);
  });

  it('should set auth state', () => {
    const {result} = renderHook(() => useAuthStore());

    const user = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    act(() => {
      result.current.setAuth(user, 'test-token', 'test-refresh-token');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(user);
    expect(result.current.token).toBe('test-token');
    expect(result.current.refreshToken).toBe('test-refresh-token');
  });

  it('should update user', () => {
    const {result} = renderHook(() => useAuthStore());

    const user = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    act(() => {
      result.current.setAuth(user, 'token', 'refresh-token');
    });

    const updatedUser = {...user, firstName: 'Updated'};

    act(() => {
      result.current.setUser(updatedUser);
    });

    expect(result.current.user?.firstName).toBe('Updated');
  });

  it('should update token', () => {
    const {result} = renderHook(() => useAuthStore());

    act(() => {
      result.current.setToken('new-token');
    });

    expect(result.current.token).toBe('new-token');
  });

  it('should logout', () => {
    const {result} = renderHook(() => useAuthStore());

    const user = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    act(() => {
      result.current.setAuth(user, 'token', 'refresh-token');
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
  });

  it('should clear auth', () => {
    const {result} = renderHook(() => useAuthStore());

    const user = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    act(() => {
      result.current.setAuth(user, 'token', 'refresh-token');
    });

    act(() => {
      result.current.clearAuth();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
  });
});

