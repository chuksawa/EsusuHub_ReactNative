/**
 * User Store
 * Manages user profile, achievements, and transactions
 */

import {create} from 'zustand';
import {UserProfile, Achievement, UserTransaction} from '../types/user';

interface UserState {
  // State
  profile: UserProfile | null;
  achievements: Achievement[];
  transactions: UserTransaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setTransactions: (transactions: UserTransaction[]) => void;
  addTransaction: (transaction: UserTransaction) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  // Initial state
  profile: null,
  achievements: [],
  transactions: [],
  isLoading: false,
  error: null,
  
  // Actions
  setProfile: (profile) => set({profile}),
  
  setAchievements: (achievements) => set({achievements}),
  
  setTransactions: (transactions) => set({transactions}),
  
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
  
  setLoading: (isLoading) => set({isLoading}),
  
  setError: (error) => set({error}),
  
  clearUser: () =>
    set({
      profile: null,
      achievements: [],
      transactions: [],
      isLoading: false,
      error: null,
    }),
}));

