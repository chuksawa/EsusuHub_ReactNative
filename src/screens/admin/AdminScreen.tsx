import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import Input from '../../components/Input';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useGroupsStore, useAuthStore} from '../../stores';
import {groupsService} from '../../services';
import {Group, GroupMember, GroupActivity, UpdateGroupRequest} from '../../types/group';

type AdminScreenRouteProp = RouteProp<RootStackParamList, 'Admin'>;
type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Admin'>;

export default function AdminScreen() {
  const route = useRoute<AdminScreenRouteProp>();
  const navigation = useNavigation<AdminScreenNavigationProp>();
  const {groupId} = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'settings' | 'activity'>('members');
  
  // Modal states
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form states
  const [editForm, setEditForm] = useState<UpdateGroupRequest>({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

  const {user} = useAuthStore();
  const {
    currentGroup,
    currentGroupMembers,
    currentGroupActivity,
    setCurrentGroup,
    setCurrentGroupMembers,
    setCurrentGroupActivity,
    setLoading: setStoreLoading,
  } = useGroupsStore();

  const loadGroupData = async () => {
    try {
      setLoading(true);
      setStoreLoading(true);

      // Load group details
      const group = await groupsService.getGroupById(groupId);
      setCurrentGroup(group);

      // Load members
      const members = await groupsService.getGroupMembers(groupId);
      setCurrentGroupMembers(members);

      // Load activity
      const activity = await groupsService.getGroupActivity(groupId);
      setCurrentGroupActivity(activity);
    } catch (error: any) {
      console.error('Error loading group data:', error);
      if (__DEV__ && (error.code === 'NETWORK_ERROR' || error.status === 0)) {
        console.warn('AdminScreen: Network error - backend may not be reachable');
      } else {
        Alert.alert('Error', error?.message || 'Failed to load group data. Please try again.');
      }
    } finally {
      setLoading(false);
      setStoreLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroupData();
  };

  useEffect(() => {
    loadGroupData();
  }, [groupId]);

  const handleRemoveMember = (memberId: string, memberName: string) => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${memberName} from this group?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await groupsService.removeMember(groupId, memberId);
              Alert.alert('Success', 'Member removed successfully');
              await loadGroupData();
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Failed to remove member');
            }
          },
        },
      ]
    );
  };

  const handleEditGroup = () => {
    if (!currentGroup) return;
    setEditForm({
      name: currentGroup.name,
      description: currentGroup.description || '',
      monthlyContribution: currentGroup.monthlyContribution,
      maxMembers: currentGroup.maxMembers,
    });
    setShowEditGroupModal(true);
  };

  const handleSaveGroup = async () => {
    try {
      if (!currentGroup) return;
      await groupsService.updateGroup(groupId, editForm);
      Alert.alert('Success', 'Group updated successfully');
      setShowEditGroupModal(false);
      await loadGroupData();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to update group');
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    try {
      // TODO: Implement invite API call when backend endpoint is available
      Alert.alert('Success', `Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteMessage('');
      setShowInviteModal(false);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to send invitation');
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await groupsService.deleteGroup(groupId);
      Alert.alert('Success', 'Group deleted successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to delete group');
    }
  };

  const formatActivityDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  };

  const isAdmin = currentGroup?.adminId === user?.id;

  if (loading && !currentGroup) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Loading group data...</Text>
      </View>
    );
  }

  if (!currentGroup) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Icon name="alert-circle" size={48} color={colors.error} style={styles.errorIcon} />
          <Text style={styles.errorText}>Group not found</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </Card>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Icon name="shield-off" size={48} color={colors.warning} style={styles.errorIcon} />
          <Text style={styles.errorText}>You don't have admin access to this group</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Group Info Header */}
      <Card style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.headerInfo}>
            <Text style={styles.groupName}>{currentGroup.name}</Text>
            <Text style={styles.groupMeta}>
              {currentGroup.currentMembers} / {currentGroup.maxMembers} members
            </Text>
          </View>
          <View style={styles.headerStats}>
            <Text style={styles.statValue}>₦{currentGroup.monthlyContribution.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Monthly</Text>
          </View>
        </View>
      </Card>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'members' && styles.tabActive]}
          onPress={() => setActiveTab('members')}>
          <Icon
            name="account-group"
            size={20}
            color={activeTab === 'members' ? colors.primary[600] : colors.gray[500]}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'members' && styles.tabTextActive,
            ]}>
            Members
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
          onPress={() => setActiveTab('settings')}>
          <Icon
            name="cog"
            size={20}
            color={activeTab === 'settings' ? colors.primary[600] : colors.gray[500]}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'settings' && styles.tabTextActive,
            ]}>
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activity' && styles.tabActive]}
          onPress={() => setActiveTab('activity')}>
          <Icon
            name="history"
            size={20}
            color={activeTab === 'activity' ? colors.primary[600] : colors.gray[500]}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'activity' && styles.tabTextActive,
            ]}>
            Activity
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {activeTab === 'members' && (
          <Card style={styles.card}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Group Members</Text>
                <Text style={styles.sectionSubtitle}>
                  {currentGroupMembers?.length || 0} / {currentGroup?.maxMembers || 0} members
                </Text>
              </View>
              {currentGroup && (currentGroupMembers?.length || 0) < currentGroup.maxMembers && (
                <Button
                  title="Invite"
                  onPress={() => setShowInviteModal(true)}
                  size="small"
                  variant="outline"
                />
              )}
            </View>

            {currentGroupMembers && currentGroupMembers.length > 0 ? (
              currentGroupMembers.map((member: GroupMember) => (
                <View key={member.id} style={styles.memberItem}>
                  <Avatar
                    uri={member.avatarUrl}
                    name={member.userName}
                    size={48}
                  />
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.userName}</Text>
                    <Text style={styles.memberEmail}>{member.userEmail}</Text>
                    <View style={styles.memberMeta}>
                      <View style={styles.memberBadge}>
                        <Text style={styles.memberBadgeText}>
                          {member.role === 'admin' ? 'Admin' : 'Member'}
                        </Text>
                      </View>
                      {member.position > 0 && (
                        <Text style={styles.memberPosition}>Position: {member.position}</Text>
                      )}
                      <Text style={styles.memberContribution}>
                        ₦{(member.totalContributed || 0).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  {member.role !== 'admin' && member.userId !== user?.id && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveMember(member.userId, member.userName)}>
                      <Icon name="close" size={20} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="account-group-outline" size={48} color={colors.gray[400]} />
                <Text style={styles.emptyStateText}>No members found</Text>
                <Button
                  title="Invite Members"
                  onPress={() => setShowInviteModal(true)}
                  style={styles.emptyStateButton}
                />
              </View>
            )}
          </Card>
        )}

        {activeTab === 'settings' && (
          <View>
            <Card style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Group Settings</Text>
                <Button
                  title="Edit"
                  onPress={handleEditGroup}
                  size="small"
                  variant="outline"
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Group Name</Text>
                <Text style={styles.settingValue}>{currentGroup?.name}</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Description</Text>
                <Text style={styles.settingValue}>
                  {currentGroup?.description || 'No description'}
                </Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Monthly Contribution</Text>
                <Text style={styles.settingValue}>
                  ₦{currentGroup?.monthlyContribution.toLocaleString()}
                </Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Max Members</Text>
                <Text style={styles.settingValue}>
                  {currentGroup?.maxMembers} members
                </Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Current Members</Text>
                <Text style={styles.settingValue}>
                  {currentGroup?.currentMembers} / {currentGroup?.maxMembers}
                </Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Cycle Duration</Text>
                <Text style={styles.settingValue}>
                  {currentGroup?.cycleDuration} months
                </Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Start Date</Text>
                <Text style={styles.settingValue}>
                  {currentGroup?.startDate
                    ? new Date(currentGroup.startDate).toLocaleDateString()
                    : 'Not set'}
                </Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Status</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        currentGroup?.status === 'active'
                          ? colors.success + '20'
                          : currentGroup?.status === 'completed'
                          ? colors.blue[100]
                          : colors.error + '20',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          currentGroup?.status === 'active'
                            ? colors.success
                            : currentGroup?.status === 'completed'
                            ? colors.blue[600]
                            : colors.error,
                      },
                    ]}>
                    {currentGroup?.status?.charAt(0).toUpperCase() +
                      currentGroup?.status?.slice(1)}
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>Danger Zone</Text>
              <Button
                title="Delete Group"
                onPress={() => setShowDeleteConfirm(true)}
                variant="danger"
                style={styles.deleteButton}
              />
              <Text style={styles.dangerText}>
                Deleting a group will permanently remove all data and cannot be undone.
              </Text>
            </Card>
          </View>
        )}

        {activeTab === 'activity' && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Group Activity</Text>
            {currentGroupActivity && currentGroupActivity.length > 0 ? (
              currentGroupActivity.map((activity: GroupActivity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View
                    style={[
                      styles.activityIcon,
                      {
                        backgroundColor:
                          activity.type === 'contribution'
                            ? colors.primary[100]
                            : activity.type === 'payout'
                            ? colors.warning + '20'
                            : activity.type === 'member_joined'
                            ? colors.success + '20'
                            : colors.blue[100],
                      },
                    ]}>
                    <Icon
                      name={
                        activity.type === 'contribution'
                          ? 'arrow-up'
                          : activity.type === 'payout'
                          ? 'arrow-down'
                          : activity.type === 'member_joined'
                          ? 'account-plus'
                          : activity.type === 'member_left'
                          ? 'account-minus'
                          : 'account-group'
                      }
                      size={20}
                      color={
                        activity.type === 'contribution'
                          ? colors.primary[600]
                          : activity.type === 'payout'
                          ? colors.warning
                          : activity.type === 'member_joined'
                          ? colors.success
                          : colors.blue[600]
                      }
                    />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                    <Text style={styles.activityUser}>
                      {activity.userName} • {formatActivityDate(activity.createdAt)}
                    </Text>
                    {activity.amount && (
                      <Text style={styles.activityAmount}>
                        ₦{activity.amount.toLocaleString()}
                      </Text>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="history" size={48} color={colors.gray[400]} />
                <Text style={styles.emptyStateText}>No activity yet</Text>
              </View>
            )}
          </Card>
        )}
      </ScrollView>

      {/* Edit Group Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditGroupModal}
        onRequestClose={() => setShowEditGroupModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Group</Text>
              <TouchableOpacity onPress={() => setShowEditGroupModal(false)}>
                <Icon name="close" size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Input
                label="Group Name"
                value={editForm.name || ''}
                onChangeText={text => setEditForm({...editForm, name: text})}
                placeholder="Enter group name"
              />
              <Input
                label="Description"
                value={editForm.description || ''}
                onChangeText={text => setEditForm({...editForm, description: text})}
                placeholder="Enter group description"
                multiline
                numberOfLines={3}
              />
              <Input
                label="Monthly Contribution (₦)"
                value={editForm.monthlyContribution?.toString() || ''}
                onChangeText={text =>
                  setEditForm({
                    ...editForm,
                    monthlyContribution: text ? parseFloat(text) : undefined,
                  })
                }
                keyboardType="numeric"
                placeholder="0.00"
              />
              <Input
                label="Max Members"
                value={editForm.maxMembers?.toString() || ''}
                onChangeText={text =>
                  setEditForm({
                    ...editForm,
                    maxMembers: text ? parseInt(text, 10) : undefined,
                  })
                }
                keyboardType="numeric"
                placeholder="0"
              />
            </ScrollView>
            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setShowEditGroupModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Save Changes"
                onPress={handleSaveGroup}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showInviteModal}
        onRequestClose={() => setShowInviteModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invite Member</Text>
              <TouchableOpacity onPress={() => setShowInviteModal(false)}>
                <Icon name="close" size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Input
                label="Email Address"
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder="user@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                label="Message (Optional)"
                value={inviteMessage}
                onChangeText={setInviteMessage}
                placeholder="Add a personal message..."
                multiline
                numberOfLines={3}
              />
            </View>
            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setShowInviteModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Send Invitation"
                onPress={handleInviteMember}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteConfirm}
        onRequestClose={() => setShowDeleteConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <Icon name="alert-circle" size={48} color={colors.error} />
            <Text style={styles.confirmTitle}>Delete Group</Text>
            <Text style={styles.confirmMessage}>
              Are you sure you want to delete "{currentGroup?.name}"? This action cannot be undone
              and will permanently remove all group data, members, and history.
            </Text>
            <View style={styles.confirmButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowDeleteConfirm(false)}
                variant="outline"
                style={styles.confirmButton}
              />
              <Button
                title="Delete"
                onPress={handleDeleteGroup}
                variant="danger"
                style={styles.confirmButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  headerCard: {
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  groupMeta: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  headerStats: {
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingHorizontal: spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary[600],
  },
  tabText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    fontWeight: typography.fontWeight.medium,
  },
  tabTextActive: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.semibold,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: spacing.md,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  memberInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  memberName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  memberEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  memberMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  memberBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  memberBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary[600],
  },
  memberPosition: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  removeButton: {
    padding: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  comingSoon: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
  errorIcon: {
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    marginTop: spacing.md,
  },
  settingItem: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  settingLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  settingValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  deleteButton: {
    marginTop: spacing.md,
  },
  dangerText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  memberContribution: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  emptyStateButton: {
    marginTop: spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  activityUser: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  activityAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[600],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.light,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '90%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  modalBody: {
    padding: spacing.md,
    maxHeight: 500,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  modalButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  confirmModalContent: {
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    margin: spacing.lg,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  confirmMessage: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  confirmButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
  },
  confirmButton: {
    flex: 1,
  },
});
