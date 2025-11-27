/**
 * Payments Store
 * Manages payment methods, accounts, and payment history
 */

import {create} from 'zustand';
import {PaymentMethod, PaymentAccount, Payment} from '../types/payment';

interface PaymentsState {
  // State
  paymentMethods: PaymentMethod[];
  paymentAccounts: PaymentAccount[];
  paymentHistory: Payment[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  setPaymentAccounts: (accounts: PaymentAccount[]) => void;
  setPaymentHistory: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (paymentId: string, updates: Partial<Payment>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPayments: () => void;
}

export const usePaymentsStore = create<PaymentsState>((set) => ({
  // Initial state
  paymentMethods: [],
  paymentAccounts: [],
  paymentHistory: [],
  isLoading: false,
  error: null,
  
  // Actions
  setPaymentMethods: (methods) => set({paymentMethods: methods}),
  
  setPaymentAccounts: (accounts) => set({paymentAccounts: accounts}),
  
  setPaymentHistory: (payments) => set({paymentHistory: payments}),
  
  addPayment: (payment) =>
    set((state) => ({
      paymentHistory: [payment, ...state.paymentHistory],
    })),
  
  updatePayment: (paymentId, updates) =>
    set((state) => ({
      paymentHistory: state.paymentHistory.map((p) =>
        p.id === paymentId ? {...p, ...updates} : p
      ),
    })),
  
  setLoading: (isLoading) => set({isLoading}),
  
  setError: (error) => set({error}),
  
  clearPayments: () =>
    set({
      paymentMethods: [],
      paymentAccounts: [],
      paymentHistory: [],
      isLoading: false,
      error: null,
    }),
}));

