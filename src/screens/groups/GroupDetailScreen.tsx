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
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useGroupsStore, useAuthStore} from '../../stores';
import {groupsService} from '../../services';
import {Group, GroupMember, GroupActivity} from '../../types/group';

type GroupDetailScreenRouteProp = RouteProp<RootStackParamList, 'GroupDetail'>;
type GroupDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GroupDetail'
>;

export default function GroupDetailScreen() {
  const route = useRoute<GroupDetailScreenRouteProp>();
  const navigation = useNavigation<GroupDetailScreenNavigationProp>();
  const {groupId} = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'activity'>('info');

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
      Alert.alert('Error', error?.message || 'Failed to load group data. Please try again.');
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

  const handleJoinGroup = async () => {
    try {
      await groupsService.joinGroup(groupId);
      Alert.alert('Success', 'You have successfully joined the group!');
      await loadGroupData();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to join group. Please try again.');
    }
  };

  const handleLeaveGroup = async () => {
    Alert.alert(
      'Leave Group',
      'Are you sure you want to leave this group?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await groupsService.leaveGroup(groupId);
              Alert.alert('Success', 'You have left the group.');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Failed to leave group. Please try again.');
            }
          },
        },
      ]
    );
  };

  const isMember = currentGroupMembers.some(m => m.userId === user?.id);
  const isAdmin = currentGroup?.adminId === user?.id;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatActivityDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      </View>
    );
  }

  if (!currentGroup) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="alert-circle-outline" size={64} color={colors.gray[400]} />
          <Text style={styles.emptyText}>Group not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Group Header */}
        <Card style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerInfo}>
              <Text style={styles.groupName}>{currentGroup.name}</Text>
              {currentGroup.description && (
                <Text style={styles.groupDescription}>{currentGroup.description}</Text>
              )}
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    currentGroup.status === 'active'
                      ? colors.success + '20'
                      : currentGroup.status === 'completed'
                      ? colors.blue[100]
                      : colors.error + '20',
                },
              ]}>
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      currentGroup.status === 'active'
                        ? colors.success
                        : currentGroup.status === 'completed'
                        ? colors.blue[600]
                        : colors.error,
                  },
                ]}>
                {currentGroup.status.charAt(0).toUpperCase() + currentGroup.status.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Monthly Contribution</Text>
              <Text style={styles.statValue}>
                ₦{currentGroup.monthlyContribution.toLocaleString()}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Members</Text>
              <Text style={styles.statValue}>
                {currentGroup.currentMembers}/{currentGroup.maxMembers}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Cycle Duration</Text>
              <Text style={styles.statValue}>{currentGroup.cycleDuration} months</Text>
            </View>
          </View>

          {!isMember && currentGroup.status === 'active' && (
            <Button
              title="Join Group"
              onPress={handleJoinGroup}
              style={styles.actionButton}
            />
          )}

          {isMember && !isAdmin && (
            <Button
              title="Leave Group"
              onPress={handleLeaveGroup}
              variant="outline"
              style={styles.actionButton}
            />
          )}

          {isAdmin && (
            <View style={styles.adminActions}>
              <Button
                title="Manage Group"
                onPress={() => navigation.navigate('Admin', {groupId})}
                style={styles.actionButton}
              />
            </View>
          )}
        </Card>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'info' && styles.activeTab]}
            onPress={() => setActiveTab('info')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'info' && styles.activeTabText,
              ]}>
              Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'members' && styles.activeTab]}
            onPress={() => setActiveTab('members')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'members' && styles.activeTabText,
              ]}>
              Members ({currentGroupMembers.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
            onPress={() => setActiveTab('activity')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'activity' && styles.activeTabText,
              ]}>
              Activity
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <Card style={styles.card}>
            <View style={styles.infoItem}>
              <Icon name="calendar-start" size={20} color={colors.primary[600]} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Start Date</Text>
                <Text style={styles.infoValue}>{formatDate(currentGroup.startDate)}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Icon name="account" size={20} color={colors.blue[600]} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Group Admin</Text>
                <Text style={styles.infoValue}>{currentGroup.adminName}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Icon name="currency-ngn" size={20} color={colors.secondary[600]} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Currency</Text>
                <Text style={styles.infoValue}>{currentGroup.currency}</Text>
              </View>
            </View>
          </Card>
        )}

        {activeTab === 'members' && (
          <Card style={styles.card}>
            {currentGroupMembers.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="account-group-outline" size={48} color={colors.gray[400]} />
                <Text style={styles.emptyText}>No members yet</Text>
              </View>
            ) : (
              currentGroupMembers.map(member => (
                <View key={member.id} style={styles.memberItem}>
                  <View style={styles.memberAvatar}>
                    <Avatar
                      uri={member.avatarUrl}
                      name={member.userName}
                      size={40}
                    />
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.userName}</Text>
                    <Text style={styles.memberEmail}>{member.userEmail}</Text>
                    {member.role === 'admin' && (
                      <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>Admin</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.memberStats}>
                    <Text style={styles.memberPosition}>#{member.position}</Text>
                    <Text style={styles.memberContribution}>
                      ₦{member.totalContributed.toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </Card>
        )}

        {activeTab === 'activity' && (
          <Card style={styles.card}>
            {currentGroupActivity.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="history" size={48} color={colors.gray[400]} />
                <Text style={styles.emptyText}>No activity yet</Text>
              </View>
            ) : (
              currentGroupActivity.map(activity => (
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
                            : colors.blue[100],
                      },
                    ]}>
                    <Icon
                      name={
                        activity.type === 'contribution'
                          ? 'arrow-up'
                          : activity.type === 'payout'
                          ? 'arrow-down'
                          : 'account-plus'
                      }
                      size={20}
                      color={
                        activity.type === 'contribution'
                          ? colors.primary[600]
                          : activity.type === 'payout'
                          ? colors.warning
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
            )}
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  content: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  headerCard: {
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  groupName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  groupDescription: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  actionButton: {
    marginTop: spacing.md,
  },
  adminActions: {
    marginTop: spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.text.white,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  activeTab: {
    backgroundColor: colors.primary[600],
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.text.white,
    fontWeight: typography.fontWeight.semibold,
  },
  card: {
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  memberAvatar: {
    marginRight: spacing.md,
  },
  memberInfo: {
    flex: 1,
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
  },
  roleBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.semibold,
  },
  memberStats: {
    alignItems: 'flex-end',
  },
  memberPosition: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  memberContribution: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
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
});
