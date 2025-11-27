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

