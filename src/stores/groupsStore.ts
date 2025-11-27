/**
 * Groups Store
 * Manages groups list, current group, and group-related state
 */

import {create} from 'zustand';
import {Group, GroupMember, GroupActivity} from '../types/group';

interface GroupsState {
  // State
  groups: Group[];
  currentGroup: Group | null;
  currentGroupMembers: GroupMember[];
  currentGroupActivity: GroupActivity[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  removeGroup: (groupId: string) => void;
  setCurrentGroup: (group: Group | null) => void;
  setCurrentGroupMembers: (members: GroupMember[]) => void;
  setCurrentGroupActivity: (activity: GroupActivity[]) => void;
  addActivity: (activity: GroupActivity) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearGroups: () => void;
}

export const useGroupsStore = create<GroupsState>((set) => ({
  // Initial state
  groups: [],
  currentGroup: null,
  currentGroupMembers: [],
  currentGroupActivity: [],
  isLoading: false,
  error: null,
  
  // Actions
  setGroups: (groups) => set({groups}),
  
  addGroup: (group) =>
    set((state) => ({
      groups: [group, ...state.groups],
    })),
  
  updateGroup: (groupId, updates) =>
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId ? {...g, ...updates} : g
      ),
      currentGroup:
        state.currentGroup?.id === groupId
          ? {...state.currentGroup, ...updates}
          : state.currentGroup,
    })),
  
  removeGroup: (groupId) =>
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== groupId),
      currentGroup:
        state.currentGroup?.id === groupId ? null : state.currentGroup,
    })),
  
  setCurrentGroup: (group) => set({currentGroup: group}),
  
  setCurrentGroupMembers: (members) => set({currentGroupMembers: members}),
  
  setCurrentGroupActivity: (activity) => set({currentGroupActivity: activity}),
  
  addActivity: (activity) =>
    set((state) => ({
      currentGroupActivity: [activity, ...state.currentGroupActivity],
    })),
  
  setLoading: (isLoading) => set({isLoading}),
  
  setError: (error) => set({error}),
  
  clearGroups: () =>
    set({
      groups: [],
      currentGroup: null,
      currentGroupMembers: [],
      currentGroupActivity: [],
      isLoading: false,
      error: null,
    }),
}));

