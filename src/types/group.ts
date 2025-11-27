/**
 * Group Types
 */

export interface Group {
  id: string;
  name: string;
  description?: string;
  monthlyContribution: number;
  currency: string;
  maxMembers: number;
  currentMembers: number;
  cycleDuration: number; // in months
  startDate: string;
  status: 'active' | 'completed' | 'cancelled';
  adminId: string;
  adminName: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  role: 'admin' | 'member';
  position: number;
  totalContributed: number;
  joinedAt: string;
}

export interface GroupActivity {
  id: string;
  type: 'contribution' | 'payout' | 'member_joined' | 'member_left' | 'group_created';
  userId: string;
  userName: string;
  amount?: number;
  description: string;
  createdAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  monthlyContribution: number;
  maxMembers: number;
  cycleDuration: number;
  startDate: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  monthlyContribution?: number;
  maxMembers?: number;
}

export interface GroupConfiguration {
  minContribution: number;
  maxContribution: number;
  minMembers: number;
  maxMembers: number;
  cycleDurations: number[];
}

