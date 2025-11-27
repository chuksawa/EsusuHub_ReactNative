/**
 * Authentication Store
 * Manages authentication state, tokens, and user session
 */

import {create} from 'zustand';
import {User} from '../types/auth';

interface AuthState {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  
  // Actions
  setAuth: (user: User, token: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  refreshToken: null,
  
  // Actions
  setAuth: (user, token, refreshToken) =>
    set({
      isAuthenticated: true,
      user,
      token,
      refreshToken,
      isLoading: false,
    }),
  
  setUser: (user) => set({user}),
  
  setToken: (token) => set({token}),
  
  setRefreshToken: (refreshToken) => set({refreshToken}),
  
  setLoading: (isLoading) => set({isLoading}),
  
  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
    }),
  
  clearAuth: () =>
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
    }),
}));

