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
    const response = await apiClient.get<Group[]>('/groups/my-groups');
    return response.data;
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

