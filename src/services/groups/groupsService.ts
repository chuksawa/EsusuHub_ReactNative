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
    const response = await apiClient.get<GroupMember[]>(
      `/groups/${groupId}/members`
    );
    return response.data;
  }

  /**
   * Get group activity
   */
  async getGroupActivity(groupId: string): Promise<GroupActivity[]> {
    const response = await apiClient.get<GroupActivity[]>(
      `/groups/${groupId}/activity`
    );
    return response.data;
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

