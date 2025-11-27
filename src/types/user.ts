/**
 * User Types
 */

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface UserTransaction {
  id: string;
  type: 'contribution' | 'payout' | 'payment';
  amount: number;
  currency: string;
  groupId?: string;
  groupName?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

