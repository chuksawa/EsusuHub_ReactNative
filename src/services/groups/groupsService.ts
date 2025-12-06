/**
 * Groups Service
 * Handles all group-related API calls
 */

import {apiClient} from '../api/apiClient';
import {
  Group,
  GroupMember,
  GroupActivity,
  CreateGroupRequest,
  UpdateGroupRequest,
  GroupConfiguration,
} from '../../types/group';
import {PaginatedResponse} from '../../types/api';

class GroupsService {
  /**
   * Get all groups
   */
  async getGroups(params?: {
    myGroupsOnly?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<Group[]> {
    const queryParams = new URLSearchParams();
    if (params?.myGroupsOnly)
      queryParams.append('myGroupsOnly', 'true');
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());

    const endpoint = `/groups${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    const response = await apiClient.get<Group[]>(endpoint);
    return response.data;
  }

  /**
   * Get user's groups
   */
  async getMyGroups(): Promise<Group[]> {
    try {
      const response = await apiClient.get<Group[]>('/groups/my-groups');
      return response.data;
    } catch (error: any) {
      // In development mode, return mock data if API fails (network error, timeout, or unavailable)
      if (__DEV__ && (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR' || error.status === 0)) {
        // Silently use mock data - no need to warn, this is expected in dev
        return this.getMockGroups();
      }
      throw error;
    }
  }

  /**
   * Get mock groups for development
   */
  private getMockGroups(): Group[] {
    return [
      {
        id: 'group-1',
        name: 'Family Savings',
        description: 'Monthly family contribution group',
        monthlyContribution: 50000,
        currency: 'NGN',
        maxMembers: 12,
        currentMembers: 8,
        cycleDuration: 12,
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        adminId: 'dev-user-123',
        adminName: 'Dev User',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'group-2',
        name: 'Vacation Fund',
        description: 'Saving for summer vacation',
        monthlyContribution: 30000,
        currency: 'NGN',
        maxMembers: 10,
        currentMembers: 6,
        cycleDuration: 6,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        adminId: 'dev-user-123',
        adminName: 'Dev User',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Get group by ID
   */
  async getGroupById(groupId: string): Promise<Group> {
    const response = await apiClient.get<Group>(`/groups/${groupId}`);
    return response.data;
  }

  /**
   * Create new group
   */
  async createGroup(data: CreateGroupRequest): Promise<Group> {
    const response = await apiClient.post<Group>('/groups', data);
    return response.data;
  }

  /**
   * Update group
   */
  async updateGroup(
    groupId: string,
    data: UpdateGroupRequest
  ): Promise<Group> {
    const response = await apiClient.put<Group>(`/groups/${groupId}`, data);
    return response.data;
  }

  /**
   * Delete group
   */
  async deleteGroup(groupId: string): Promise<void> {
    await apiClient.delete(`/groups/${groupId}`);
  }

  /**
   * Get group members
   */
  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    try {
      const response = await apiClient.get<GroupMember[]>(
        `/groups/${groupId}/members`
      );
      // If API returns empty array in dev mode, use mock data
      if (__DEV__ && (!response.data || response.data.length === 0)) {
        return this.getMockGroupMembers(groupId);
      }
      return response.data;
    } catch (error: any) {
      // In development mode, return mock data if API fails
      if (__DEV__ && (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR' || error.status === 0)) {
        console.debug('API unavailable or timed out, using mock data for development');
        return this.getMockGroupMembers(groupId);
      }
      throw error;
    }
  }

  /**
   * Get group activity
   */
  async getGroupActivity(groupId: string): Promise<GroupActivity[]> {
    try {
      const response = await apiClient.get<GroupActivity[]>(
        `/groups/${groupId}/activity`
      );
      // If API returns empty array in dev mode, use mock data
      if (__DEV__ && (!response.data || response.data.length === 0)) {
        return this.getMockGroupActivity(groupId);
      }
      return response.data;
    } catch (error: any) {
      // In development mode, return mock data if API fails
      if (__DEV__ && (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR' || error.status === 0)) {
        console.debug('API unavailable or timed out, using mock data for development');
        return this.getMockGroupActivity(groupId);
      }
      throw error;
    }
  }

  /**
   * Get mock group members for development
   */
  private getMockGroupMembers(groupId: string): GroupMember[] {
    const now = new Date();
    return [
      {
        id: 'member-1',
        userId: 'dev-user-123',
        userName: 'John Doe',
        userEmail: 'john.doe@example.com',
        avatarUrl: undefined,
        role: 'admin',
        position: 1,
        totalContributed: 500000,
        joinedAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'member-2',
        userId: 'user-2',
        userName: 'Jane Smith',
        userEmail: 'jane.smith@example.com',
        avatarUrl: undefined,
        role: 'member',
        position: 2,
        totalContributed: 450000,
        joinedAt: new Date(now.getTime() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'member-3',
        userId: 'user-3',
        userName: 'Michael Johnson',
        userEmail: 'michael.j@example.com',
        avatarUrl: undefined,
        role: 'member',
        position: 3,
        totalContributed: 400000,
        joinedAt: new Date(now.getTime() - 80 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'member-4',
        userId: 'user-4',
        userName: 'Sarah Williams',
        userEmail: 'sarah.w@example.com',
        avatarUrl: undefined,
        role: 'member',
        position: 4,
        totalContributed: 350000,
        joinedAt: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'member-5',
        userId: 'user-5',
        userName: 'David Brown',
        userEmail: 'david.brown@example.com',
        avatarUrl: undefined,
        role: 'member',
        position: 5,
        totalContributed: 300000,
        joinedAt: new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'member-6',
        userId: 'user-6',
        userName: 'Emily Davis',
        userEmail: 'emily.davis@example.com',
        avatarUrl: undefined,
        role: 'member',
        position: 6,
        totalContributed: 250000,
        joinedAt: new Date(now.getTime() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  /**
   * Get mock group activity for development
   */
  private getMockGroupActivity(groupId: string): GroupActivity[] {
    const now = new Date();
    return [
      {
        id: 'activity-1',
        type: 'contribution',
        userId: 'user-2',
        userName: 'Jane Smith',
        amount: 50000,
        description: 'Made monthly contribution',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'activity-2',
        type: 'member_joined',
        userId: 'user-6',
        userName: 'Emily Davis',
        description: 'Joined the group',
        createdAt: new Date(now.getTime() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'activity-3',
        type: 'contribution',
        userId: 'user-3',
        userName: 'Michael Johnson',
        amount: 50000,
        description: 'Made monthly contribution',
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'activity-4',
        type: 'payout',
        userId: 'user-1',
        userName: 'John Doe',
        amount: 500000,
        description: 'Received payout',
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  /**
   * Join group
   */
  async joinGroup(groupId: string): Promise<void> {
    await apiClient.post(`/groups/${groupId}/join`, {});
  }

  /**
   * Leave group
   */
  async leaveGroup(groupId: string): Promise<void> {
    await apiClient.post(`/groups/${groupId}/leave`, {});
  }

  /**
   * Remove member from group (admin only)
   */
  async removeMember(groupId: string, userId: string): Promise<void> {
    await apiClient.delete(`/groups/${groupId}/members/${userId}`);
  }

  /**
   * Get group configuration options
   */
  async getGroupConfiguration(): Promise<GroupConfiguration> {
    const response = await apiClient.get<GroupConfiguration>(
      '/groups/configuration'
    );
    return response.data;
  }
}

export const groupsService = new GroupsService();

