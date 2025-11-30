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
      // In development mode, return mock data if API fails
      if (__DEV__ && (error.code === 'NETWORK_ERROR' || error.status === 0)) {
        console.warn('API unavailable, using mock payment data for development');
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
    const mockPayments: Payment[] = [
      {
        id: 'payment-1',
        groupId: 'group-1',
        groupName: 'Family Savings',
        userId: 'dev-user-123',
        amount: 50000,
        currency: 'NGN',
        status: 'completed',
        paymentMethod: 'bank_transfer',
        transactionReference: 'TXN-' + Date.now() + '-1',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'payment-2',
        groupId: 'group-2',
        groupName: 'Vacation Fund',
        userId: 'dev-user-123',
        amount: 30000,
        currency: 'NGN',
        status: 'completed',
        paymentMethod: 'card',
        transactionReference: 'TXN-' + Date.now() + '-2',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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

