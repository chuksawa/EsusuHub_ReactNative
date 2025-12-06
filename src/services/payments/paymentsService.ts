/**
 * Payments Service
 * Handles all payment-related API calls
 */

import {apiClient} from '../api/apiClient';
import {
  PaymentMethod,
  PaymentAccount,
  PaymentRequest,
  Payment,
  PaymentHistory,
} from '../../types/payment';
import {PaginatedResponse} from '../../types/api';

class PaymentsService {
  /**
   * Get payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiClient.get<PaymentMethod[]>('/payments/methods');
    return response.data;
  }

  /**
   * Get payment accounts
   */
  async getPaymentAccounts(): Promise<PaymentAccount[]> {
    const response = await apiClient.get<PaymentAccount[]>('/payments/accounts');
    return response.data;
  }

  /**
   * Process payment
   */
  async processPayment(data: PaymentRequest): Promise<Payment> {
    const response = await apiClient.post<Payment>('/payments', data);
    return response.data;
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(params?: {
    page?: number;
    pageSize?: number;
    groupId?: string;
  }): Promise<PaymentHistory> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize)
        queryParams.append('pageSize', params.pageSize.toString());
      if (params?.groupId) queryParams.append('groupId', params.groupId);

      const endpoint = `/payments/history${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      const response = await apiClient.get<PaymentHistory>(endpoint);
      return response.data;
    } catch (error: any) {
      // In development mode, return mock data if API fails (network error, timeout, or unavailable)
      if (__DEV__ && (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR' || error.status === 0)) {
        // Silently use mock data - no need to warn, this is expected in dev
        return this.getMockPaymentHistory(params);
      }
      throw error;
    }
  }

  /**
   * Get mock payment history for development
   */
  private getMockPaymentHistory(params?: {
    page?: number;
    pageSize?: number;
    groupId?: string;
  }): PaymentHistory {
    const now = new Date();
    const mockPayments: Payment[] = [
      {
        id: 'payment-1',
        groupId: 'group-1',
        groupName: 'Family Savings Circle',
        userId: 'dev-user-123',
        amount: 50000,
        currency: 'NGN',
        status: 'completed',
        paymentMethod: 'bank_transfer',
        transactionReference: 'TXN-20240215-001',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'payment-2',
        groupId: 'group-2',
        groupName: 'Vacation Fund Group',
        userId: 'dev-user-123',
        amount: 30000,
        currency: 'NGN',
        status: 'completed',
        paymentMethod: 'card',
        transactionReference: 'TXN-20240214-002',
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'payment-3',
        groupId: 'group-1',
        groupName: 'Family Savings Circle',
        userId: 'dev-user-123',
        amount: 50000,
        currency: 'NGN',
        status: 'completed',
        paymentMethod: 'mobile_money',
        transactionReference: 'TXN-20240210-003',
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'payment-4',
        groupId: 'group-3',
        groupName: 'Emergency Fund',
        userId: 'dev-user-123',
        amount: 25000,
        currency: 'NGN',
        status: 'completed',
        paymentMethod: 'bank_transfer',
        transactionReference: 'TXN-20240205-004',
        createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'payment-5',
        groupId: 'group-2',
        groupName: 'Vacation Fund Group',
        userId: 'dev-user-123',
        amount: 30000,
        currency: 'NGN',
        status: 'pending',
        paymentMethod: 'card',
        transactionReference: 'TXN-20240216-005',
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'payment-6',
        groupId: 'group-1',
        groupName: 'Family Savings Circle',
        userId: 'dev-user-123',
        amount: 50000,
        currency: 'NGN',
        status: 'completed',
        paymentMethod: 'bank_transfer',
        transactionReference: 'TXN-20240128-006',
        createdAt: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'payment-7',
        groupId: 'group-4',
        groupName: 'Business Investment Pool',
        userId: 'dev-user-123',
        amount: 100000,
        currency: 'NGN',
        status: 'completed',
        paymentMethod: 'bank_transfer',
        transactionReference: 'TXN-20240120-007',
        createdAt: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'payment-8',
        groupId: 'group-3',
        groupName: 'Emergency Fund',
        userId: 'dev-user-123',
        amount: 25000,
        currency: 'NGN',
        status: 'failed',
        paymentMethod: 'card',
        transactionReference: 'TXN-20240115-008',
        createdAt: new Date(now.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Filter by groupId if provided
    const filteredPayments = params?.groupId
      ? mockPayments.filter(p => p.groupId === params.groupId)
      : mockPayments;

    return {
      payments: filteredPayments,
      total: filteredPayments.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
    };
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string): Promise<Payment> {
    const response = await apiClient.get<Payment>(`/payments/${paymentId}`);
    return response.data;
  }
}

export const paymentsService = new PaymentsService();

