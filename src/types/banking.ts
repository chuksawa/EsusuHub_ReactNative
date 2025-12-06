/**
 * Banking Types
 * Type definitions for banking-related data
 */

export type BankAccountType = 'savings' | 'current' | 'fixed_deposit';
export type BankAccountStatus = 'active' | 'frozen' | 'closed' | 'pending_approval';
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'fee' | 'interest';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

export interface BankAccount {
  id: string;
  accountNumber: string;
  accountType: BankAccountType;
  accountName: string;
  balance: number;
  availableBalance: number;
  currency: string;
  interestRate: number;
  minimumBalance: number;
  status: BankAccountStatus;
  openedDate: string;
  maturityDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccountApplication {
  id: string;
  accountType: BankAccountType;
  employmentStatus?: string;
  employerName?: string;
  monthlyIncome?: number;
  purposeOfAccount?: string;
  initialDeposit?: number;
  preferredBranch?: string;
  status: ApplicationStatus;
  applicationDate: string;
  reviewDate?: string;
  approvalDate?: string;
  reviewerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankTransaction {
  id: string;
  accountId: string;
  accountNumber?: string;
  accountName?: string;
  transactionType: TransactionType;
  amount: number;
  balanceAfter: number;
  description?: string;
  referenceNumber?: string;
  recipientAccount?: string;
  recipientBank?: string;
  status: TransactionStatus;
  transactionDate: string;
  valueDate?: string;
  createdAt: string;
}

export interface CreateAccountApplicationRequest {
  accountType: BankAccountType;
  employmentStatus?: string;
  employerName?: string;
  monthlyIncome?: number;
  purposeOfAccount?: string;
  initialDeposit?: number;
  preferredBranch?: string;
}

export interface DepositRequest {
  accountId: string;
  amount: number;
  description?: string;
}

export interface WithdrawRequest {
  accountId: string;
  amount: number;
  description?: string;
}

export interface TransactionHistoryResponse {
  transactions: BankTransaction[];
  total: number;
  page: number;
  pageSize: number;
}

