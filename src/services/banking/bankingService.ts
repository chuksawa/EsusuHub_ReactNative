/**
 * Banking Service
 * Handles all banking-related API calls
 */

import {apiClient} from '../api/apiClient';
import {
  BankAccount,
  BankAccountApplication,
  BankTransaction,
  CreateAccountApplicationRequest,
  DepositRequest,
  WithdrawRequest,
  TransactionHistoryResponse,
} from '../../types/banking';

class BankingService {
  /**
   * Get all bank accounts for the current user
   */
  async getAccounts(): Promise<BankAccount[]> {
    try {
      const response = await apiClient.get<BankAccount[]>('/banking/accounts');
      // If API returns empty array in dev mode, use mock data
      if (__DEV__ && (!response.data || response.data.length === 0)) {
        return this.getMockAccounts();
      }
      return response.data;
    } catch (error: any) {
      if (__DEV__ && (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR' || error.status === 0)) {
        console.debug('API unavailable or timed out, using mock data for development');
        return this.getMockAccounts();
      }
      throw error;
    }
  }

  /**
   * Get a specific bank account by ID
   */
  async getAccountById(accountId: string): Promise<BankAccount> {
    const response = await apiClient.get<BankAccount>(`/banking/accounts/${accountId}`);
    return response.data;
  }

  /**
   * Get all account applications for the current user
   */
  async getApplications(): Promise<BankAccountApplication[]> {
    try {
      const response = await apiClient.get<BankAccountApplication[]>('/banking/accounts/applications');
      // If API returns empty array in dev mode, use mock data
      if (__DEV__ && (!response.data || response.data.length === 0)) {
        return this.getMockApplications();
      }
      return response.data;
    } catch (error: any) {
      if (__DEV__ && (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR' || error.status === 0)) {
        console.debug('API unavailable or timed out, using mock data for development');
        return this.getMockApplications();
      }
      throw error;
    }
  }

  /**
   * Create a new bank account application
   */
  async applyForAccount(data: CreateAccountApplicationRequest): Promise<BankAccountApplication> {
    const response = await apiClient.post<BankAccountApplication>('/banking/accounts/apply', data);
    return response.data;
  }

  /**
   * Get transaction history
   */
  async getTransactions(params?: {
    accountId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<TransactionHistoryResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.accountId) queryParams.append('accountId', params.accountId);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

      const endpoint = `/banking/transactions${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      const response = await apiClient.get<TransactionHistoryResponse>(endpoint);
      // If API returns empty transactions in dev mode, use mock data
      if (__DEV__ && (!response.data.transactions || response.data.transactions.length === 0)) {
        return this.getMockTransactions(params);
      }
      return response.data;
    } catch (error: any) {
      if (__DEV__ && (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR' || error.status === 0)) {
        console.debug('API unavailable or timed out, using mock data for development');
        return this.getMockTransactions(params);
      }
      throw error;
    }
  }

  /**
   * Create a deposit transaction
   */
  async deposit(data: DepositRequest): Promise<BankTransaction> {
    const response = await apiClient.post<BankTransaction>('/banking/transactions/deposit', data);
    return response.data;
  }

  /**
   * Create a withdrawal transaction
   */
  async withdraw(data: WithdrawRequest): Promise<BankTransaction> {
    const response = await apiClient.post<BankTransaction>('/banking/transactions/withdraw', data);
    return response.data;
  }

  /**
   * Mock data for development
   */
  private getMockAccounts(): BankAccount[] {
    const now = new Date();
    return [
      {
        id: 'mock-account-1',
        accountNumber: '2034567890',
        accountType: 'savings',
        accountName: 'Premium Savings Account',
        balance: 2450000,
        availableBalance: 2450000,
        currency: 'NGN',
        interestRate: 5.5,
        minimumBalance: 1000,
        status: 'active',
        openedDate: '2023-01-15',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2023-01-15T00:00:00Z',
      },
      {
        id: 'mock-account-2',
        accountNumber: '3045678901',
        accountType: 'current',
        accountName: 'Business Current Account',
        balance: 1850000,
        availableBalance: 1850000,
        currency: 'NGN',
        interestRate: 0,
        minimumBalance: 5000,
        status: 'active',
        openedDate: '2023-03-20',
        createdAt: '2023-03-20T00:00:00Z',
        updatedAt: '2023-03-20T00:00:00Z',
      },
      {
        id: 'mock-account-3',
        accountNumber: '4056789012',
        accountType: 'fixed_deposit',
        accountName: 'Fixed Deposit Account',
        balance: 5000000,
        availableBalance: 0, // Fixed deposits are locked
        currency: 'NGN',
        interestRate: 12.0,
        minimumBalance: 100000,
        status: 'active',
        openedDate: '2023-06-10',
        maturityDate: '2024-06-10',
        createdAt: '2023-06-10T00:00:00Z',
        updatedAt: '2023-06-10T00:00:00Z',
      },
    ];
  }

  private getMockApplications(): BankAccountApplication[] {
    const now = new Date();
    return [
      {
        id: 'mock-app-1',
        accountType: 'fixed_deposit',
        status: 'approved',
        employmentStatus: 'Employed',
        employerName: 'Tech Solutions Ltd',
        monthlyIncome: 500000,
        purposeOfAccount: 'Long-term savings and investment',
        initialDeposit: 1000000,
        preferredBranch: 'Victoria Island',
        applicationDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        approvalDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-app-2',
        accountType: 'savings',
        status: 'under_review',
        employmentStatus: 'Self-employed',
        monthlyIncome: 300000,
        purposeOfAccount: 'Emergency fund',
        initialDeposit: 50000,
        preferredBranch: 'Lekki',
        applicationDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  private getMockTransactions(params?: {
    accountId?: string;
    page?: number;
    pageSize?: number;
  }): TransactionHistoryResponse {
    const now = new Date();
    const transactions: BankTransaction[] = [
      {
        id: 'mock-txn-1',
        accountId: params?.accountId || 'mock-account-1',
        accountNumber: '2034567890',
        accountName: 'Premium Savings Account',
        transactionType: 'deposit',
        amount: 450000,
        balanceAfter: 2450000,
        description: 'Salary Payment - February 2024',
        referenceNumber: 'DEP-20240215-001',
        status: 'completed',
        transactionDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        valueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-txn-2',
        accountId: params?.accountId || 'mock-account-1',
        accountNumber: '2034567890',
        accountName: 'Premium Savings Account',
        transactionType: 'withdrawal',
        amount: 50000,
        balanceAfter: 2000000,
        description: 'ATM Withdrawal - Victoria Island',
        referenceNumber: 'WDL-20240214-002',
        status: 'completed',
        transactionDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        valueDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-txn-3',
        accountId: params?.accountId || 'mock-account-2',
        accountNumber: '3045678901',
        accountName: 'Business Current Account',
        transactionType: 'deposit',
        amount: 200000,
        balanceAfter: 1850000,
        description: 'Transfer from Savings Account',
        referenceNumber: 'DEP-20240213-003',
        status: 'completed',
        transactionDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        valueDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-txn-4',
        accountId: params?.accountId || 'mock-account-1',
        accountNumber: '2034567890',
        accountName: 'Premium Savings Account',
        transactionType: 'interest',
        amount: 11229,
        balanceAfter: 2011229,
        description: 'Monthly Interest Payment',
        referenceNumber: 'INT-20240201-004',
        status: 'completed',
        transactionDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        valueDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-txn-5',
        accountId: params?.accountId || 'mock-account-2',
        accountNumber: '3045678901',
        accountName: 'Business Current Account',
        transactionType: 'transfer',
        amount: 75000,
        balanceAfter: 1775000,
        description: 'Transfer to John Doe - 0123456789',
        referenceNumber: 'TRF-20240210-005',
        recipientAccount: '0123456789',
        recipientBank: 'Access Bank',
        status: 'completed',
        transactionDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        valueDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-txn-6',
        accountId: params?.accountId || 'mock-account-1',
        accountNumber: '2034567890',
        accountName: 'Premium Savings Account',
        transactionType: 'deposit',
        amount: 100000,
        balanceAfter: 2111229,
        description: 'Mobile Transfer - From Jane Smith',
        referenceNumber: 'DEP-20240208-006',
        status: 'completed',
        transactionDate: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        valueDate: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Filter by accountId if provided
    const filteredTransactions = params?.accountId
      ? transactions.filter(t => t.accountId === params.accountId)
      : transactions;

    return {
      transactions: filteredTransactions,
      total: filteredTransactions.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || 20,
    };
  }
}

export const bankingService = new BankingService();

