/**
 * Groups Service Tests
 */

import {groupsService} from '../../src/services/groups/groupsService';
import {apiClient} from '../../src/services/api/apiClient';
import {createMockResponse, createMockError} from '../utils/testUtils';

jest.mock('../../src/services/api/apiClient');

describe('GroupsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMyGroups', () => {
    it('should fetch user groups', async () => {
      const mockGroups = [
        {
          id: '1',
          name: 'Test Group',
          monthlyContribution: 50000,
          currency: 'NGN',
          maxMembers: 12,
          currentMembers: 5,
          cycleDuration: 12,
          startDate: new Date().toISOString(),
          status: 'active' as const,
          adminId: 'admin-1',
          adminName: 'Admin User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const mockResponse = createMockResponse(mockGroups);
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await groupsService.getMyGroups();

      expect(apiClient.get).toHaveBeenCalledWith('/groups/my-groups');
      expect(result).toEqual(mockGroups);
      expect(result.length).toBe(1);
    });

    it('should handle empty groups list', async () => {
      const mockResponse = createMockResponse([]);
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await groupsService.getMyGroups();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('getGroupById', () => {
    it('should fetch group by ID', async () => {
      const mockGroup = {
        id: '1',
        name: 'Test Group',
        monthlyContribution: 50000,
        currency: 'NGN',
        maxMembers: 12,
        currentMembers: 5,
        cycleDuration: 12,
        startDate: new Date().toISOString(),
        status: 'active' as const,
        adminId: 'admin-1',
        adminName: 'Admin User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockResponse = createMockResponse(mockGroup);
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await groupsService.getGroupById('1');

      expect(apiClient.get).toHaveBeenCalledWith('/groups/1');
      expect(result).toEqual(mockGroup);
    });
  });

  describe('createGroup', () => {
    it('should create a new group', async () => {
      const newGroup = {
        name: 'New Group',
        description: 'Test description',
        monthlyContribution: 50000,
        maxMembers: 12,
        cycleDuration: 12,
        startDate: new Date().toISOString(),
      };

      const mockResponse = createMockResponse({
        id: 'new-group-id',
        ...newGroup,
        currency: 'NGN',
        currentMembers: 1,
        status: 'active' as const,
        adminId: 'admin-1',
        adminName: 'Admin User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await groupsService.createGroup(newGroup);

      expect(apiClient.post).toHaveBeenCalledWith('/groups', newGroup);
      expect(result.id).toBe('new-group-id');
      expect(result.name).toBe('New Group');
    });
  });

  describe('joinGroup', () => {
    it('should join a group', async () => {
      const mockResponse = createMockResponse(undefined, 200);
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await groupsService.joinGroup('group-id');

      expect(apiClient.post).toHaveBeenCalledWith('/groups/group-id/join', {});
    });
  });

  describe('leaveGroup', () => {
    it('should leave a group', async () => {
      const mockResponse = createMockResponse(undefined, 200);
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await groupsService.leaveGroup('group-id');

      expect(apiClient.post).toHaveBeenCalledWith('/groups/group-id/leave', {});
    });
  });
});

