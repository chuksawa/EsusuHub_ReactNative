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
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import Button from '../../components/Button';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useGroupsStore} from '../../stores';
import {groupsService} from '../../services';
import {Group} from '../../types/group';

type GroupsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function GroupsScreen() {
  const navigation = useNavigation<GroupsScreenNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const {groups, setGroups, isLoading, setLoading: setStoreLoading, error} =
    useGroupsStore();

  const loadGroups = async () => {
    try {
      setLoading(true);
      setStoreLoading(true);
      const userGroups = await groupsService.getMyGroups();
      setGroups(userGroups);
    } catch (error: any) {
      console.error('Error loading groups:', error);
      Alert.alert('Error', error?.message || 'Failed to load groups. Please try again.');
    } finally {
      setLoading(false);
      setStoreLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroups();
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleGroupPress = (groupId: string) => {
    navigation.navigate('GroupDetail', {groupId});
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.header}>
          <Text style={styles.title}>My Groups</Text>
          <Button
            title="Create Group"
            onPress={handleCreateGroup}
            size="small"
            icon={<Icon name="plus" size={16} color={colors.text.white} />}
          />
        </View>

        {groups.length === 0 ? (
          <Card style={styles.emptyCard}>
            <View style={styles.emptyState}>
              <Icon name="account-group-outline" size={64} color={colors.gray[400]} />
              <Text style={styles.emptyTitle}>No Groups Yet</Text>
              <Text style={styles.emptyText}>
                Create your first savings group to get started
              </Text>
              <Button
                title="Create Group"
                onPress={handleCreateGroup}
                style={styles.emptyButton}
              />
            </View>
          </Card>
        ) : (
          groups.map(group => (
            <TouchableOpacity
              key={group.id}
              onPress={() => handleGroupPress(group.id)}
              activeOpacity={0.7}>
              <Card style={styles.groupCard}>
                <View style={styles.groupHeader}>
                  <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    {group.description && (
                      <Text style={styles.groupDescription} numberOfLines={2}>
                        {group.description}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          group.status === 'active'
                            ? colors.success + '20'
                            : group.status === 'completed'
                            ? colors.blue[100]
                            : colors.error + '20',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            group.status === 'active'
                              ? colors.success
                              : group.status === 'completed'
                              ? colors.blue[600]
                              : colors.error,
                        },
                      ]}>
                      {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.groupDetails}>
                  <View style={styles.detailItem}>
                    <Icon
                      name="currency-ngn"
                      size={16}
                      color={colors.primary[600]}
                    />
                    <Text style={styles.detailLabel}>Monthly:</Text>
                    <Text style={styles.detailValue}>
                      ₦{group.monthlyContribution.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="account-group" size={16} color={colors.blue[600]} />
                    <Text style={styles.detailLabel}>Members:</Text>
                    <Text style={styles.detailValue}>
                      {group.currentMembers}/{group.maxMembers}
                    </Text>
                  </View>
                </View>

                <View style={styles.groupFooter}>
                  <View style={styles.footerItem}>
                    <Icon name="calendar-start" size={14} color={colors.text.secondary} />
                    <Text style={styles.footerText}>
                      Started {formatDate(group.startDate)}
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={20} color={colors.gray[400]} />
                </View>
              </Card>
            </TouchableOpacity>
          ))
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  groupCard: {
    marginBottom: spacing.md,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  groupInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  groupName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  groupDescription: {
    fontSize: typography.fontSize.sm,
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
  groupDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  emptyCard: {
    marginTop: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    minWidth: 200,
  },
});
