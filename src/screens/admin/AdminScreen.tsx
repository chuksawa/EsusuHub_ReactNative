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
import {Group, GroupMember} from '../../types/group';

type AdminScreenRouteProp = RouteProp<RootStackParamList, 'Admin'>;
type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Admin'>;

export default function AdminScreen() {
  const route = useRoute<AdminScreenRouteProp>();
  const navigation = useNavigation<AdminScreenNavigationProp>();
  const {groupId} = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'settings' | 'activity'>('members');

  const {user} = useAuthStore();
  const {
    currentGroup,
    currentGroupMembers,
    setCurrentGroup,
    setCurrentGroupMembers,
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
              <Text style={styles.sectionTitle}>Group Members</Text>
              <Text style={styles.sectionSubtitle}>
                {currentGroupMembers?.length || 0} members
              </Text>
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
              </View>
            )}
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Group Settings</Text>
            <Text style={styles.comingSoon}>Settings management coming soon</Text>
          </Card>
        )}

        {activeTab === 'activity' && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Group Activity</Text>
            <Text style={styles.comingSoon}>Activity log coming soon</Text>
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
});
