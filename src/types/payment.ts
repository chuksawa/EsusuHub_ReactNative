/**
 * Payment Types
 */

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'mobile_money';
  name: string;
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface PaymentAccount {
  id: string;
  type: 'bank_account' | 'mobile_money';
  accountName: string;
  accountNumber: string;
  bankName?: string;
  isDefault: boolean;
}

export interface PaymentRequest {
  groupId: string;
  amount: number;
  paymentMethodId: string;
  description?: string;
}

export interface Payment {
  id: string;
  groupId: string;
  groupName: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  transactionReference: string;
  createdAt: string;
  completedAt?: string;
}

export interface PaymentHistory {
  payments: Payment[];
  total: number;
  page: number;
  pageSize: number;
}

