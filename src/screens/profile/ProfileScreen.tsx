import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {imageUploadService} from '../../services/image/imageUploadService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {useAuthStore, useUserStore} from '../../stores';
import {userService} from '../../services';
import {logoutUser} from '../../utils/authHelpers';
import {Achievement, UserTransaction} from '../../types/user';

export default function ProfileScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'transactions'>(
    'profile'
  );

  const {user, setUser, logout} = useAuthStore();
  const {profile, achievements, transactions, setProfile, setAchievements, setTransactions} =
    useUserStore();

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [userProfile, userAchievements, userTransactions] = await Promise.all([
        userService.getProfile(),
        userService.getAchievements(),
        userService.getTransactions({page: 1, pageSize: 20}),
      ]);

      setProfile(userProfile);
      setAchievements(userAchievements);
      setTransactions(userTransactions.data || []);
    } catch (error: any) {
      console.error('Error loading profile data:', error);
      
      // Don't show alert for network errors in dev mode - just log
      if (__DEV__ && (error.code === 'NETWORK_ERROR' || error.status === 0)) {
        console.warn('ProfileScreen: Network error - backend may not be reachable');
        // In dev mode, we can continue with existing profile data if available
        if (profile) {
          console.log('ProfileScreen: Using existing profile data');
          return;
        }
      }
      
      // Only show alert for non-network errors or in production
      if (!__DEV__ || (error.code !== 'NETWORK_ERROR' && error.status !== 0)) {
        Alert.alert(
          'Error', 
          error?.message || 'Failed to load profile data. Please check your connection and try again.'
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
  };

  const handleAvatarUpload = async () => {
    try {
      setUploadingAvatar(true);
      
      // Show image source selection dialog
      const asset = await imageUploadService.showImageSourceDialog({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      });

      if (!asset) {
        setUploadingAvatar(false);
        return;
      }

      // Validate image
      const validation = imageUploadService.validateImage(asset, 5);
      if (!validation.valid) {
        Alert.alert('Error', validation.error || 'Invalid image');
        setUploadingAvatar(false);
        return;
      }

      // Upload image
      const result = await imageUploadService.uploadImage(asset);
      
      // Ensure we have a full URL (backend should return it, but convert if needed)
      let avatarUrl = result.url;
      if (avatarUrl && !avatarUrl.startsWith('http')) {
        const config = await import('../../config/env');
        const baseUrl = config.config.API_BASE_URL.replace('/api', '');
        avatarUrl = `${baseUrl}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
      }
      
      // Update profile with new avatar URL
      const updatedProfile = {...profile!, avatarUrl};
      setProfile(updatedProfile);
      
      // Update auth store user
      if (user) {
        setUser({...user, avatarUrl});
      }
      
      // Also refresh profile data to get the latest from backend
      await loadProfileData();

      Alert.alert('Success', 'Avatar updated successfully!');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Error', error?.message || 'Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
              // Navigation will update automatically via AppNavigator's isAuthenticated check
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
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
        {/* Profile Header */}
        <Card style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={profile?.avatarUrl}
              name={profile ? `${profile.firstName} ${profile.lastName}` : undefined}
              size={100}
            />
            <TouchableOpacity
              style={styles.avatarEditButton}
              onPress={handleAvatarUpload}
              disabled={uploadingAvatar}>
              {uploadingAvatar ? (
                <ActivityIndicator size="small" color={colors.text.white} />
              ) : (
                <Icon name="camera" size={20} color={colors.text.white} />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>
            {profile?.firstName} {profile?.lastName}
          </Text>
          <Text style={styles.email}>{profile?.email}</Text>
          {profile?.phone && <Text style={styles.phone}>{profile.phone}</Text>}

          {!profile?.emailVerified && (
            <View style={styles.verificationBadge}>
              <Icon name="alert-circle" size={16} color={colors.warning} />
              <Text style={styles.verificationText}>Email not verified</Text>
            </View>
          )}
        </Card>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
            onPress={() => setActiveTab('profile')}>
            <Text
              style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'achievements' && styles.activeTabText,
              ]}>
              Achievements ({achievements.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
            onPress={() => setActiveTab('transactions')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'transactions' && styles.activeTabText,
              ]}>
              Transactions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <Card style={styles.card}>
            <View style={styles.infoItem}>
              <Icon name="email" size={20} color={colors.primary[600]} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profile?.email}</Text>
              </View>
            </View>
            {profile?.phone && (
              <View style={styles.infoItem}>
                <Icon name="phone" size={20} color={colors.blue[600]} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{profile.phone}</Text>
                </View>
              </View>
            )}
            <View style={styles.infoItem}>
              <Icon name="calendar" size={20} color={colors.secondary[600]} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {profile ? formatDate(profile.createdAt) : 'N/A'}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {activeTab === 'achievements' && (
          <Card style={styles.card}>
            {achievements.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="trophy-outline" size={64} color={colors.gray[400]} />
                <Text style={styles.emptyText}>No achievements yet</Text>
                <Text style={styles.emptySubtext}>
                  Complete actions to unlock achievements
                </Text>
              </View>
            ) : (
              achievements.map(achievement => (
                <View key={achievement.id} style={styles.achievementItem}>
                  <View style={styles.achievementIcon}>
                    <Icon name="trophy" size={32} color={colors.warning} />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                    <Text style={styles.achievementDate}>
                      Unlocked {formatDate(achievement.unlockedAt)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </Card>
        )}

        {activeTab === 'transactions' && (
          <Card style={styles.card}>
            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="history" size={64} color={colors.gray[400]} />
                <Text style={styles.emptyText}>No transactions yet</Text>
              </View>
            ) : (
              transactions.map(transaction => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View
                    style={[
                      styles.transactionIcon,
                      {
                        backgroundColor:
                          transaction.type === 'contribution'
                            ? colors.primary[100]
                            : transaction.type === 'payout'
                            ? colors.warning + '20'
                            : colors.blue[100],
                      },
                    ]}>
                    <Icon
                      name={
                        transaction.type === 'contribution'
                          ? 'arrow-up'
                          : transaction.type === 'payout'
                          ? 'arrow-down'
                          : 'swap-horizontal'
                      }
                      size={20}
                      color={
                        transaction.type === 'contribution'
                          ? colors.primary[600]
                          : transaction.type === 'payout'
                          ? colors.warning
                          : colors.blue[600]
                      }
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionType}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Text>
                    {transaction.groupName && (
                      <Text style={styles.transactionGroup}>{transaction.groupName}</Text>
                    )}
                    <Text style={styles.transactionDate}>
                      {formatDate(transaction.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.transactionAmount}>
                    <Text
                      style={[
                        styles.transactionAmountText,
                        {
                          color:
                            transaction.type === 'contribution'
                              ? colors.primary[600]
                              : transaction.type === 'payout'
                              ? colors.warning
                              : colors.text.primary,
                        },
                      ]}>
                      {transaction.type === 'contribution' ? '+' : '-'}₦
                      {transaction.amount.toLocaleString()}
                    </Text>
                    <Text
                      style={[
                        styles.transactionStatus,
                        {
                          color:
                            transaction.status === 'completed'
                              ? colors.success
                              : transaction.status === 'failed'
                              ? colors.error
                              : colors.warning,
                        },
                      ]}>
                      {transaction.status}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </Card>
        )}

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutButton}
        />
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
  headerCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.text.white,
  },
  name: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  phone: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.warning + '20',
    borderRadius: spacing.sm,
  },
  verificationText: {
    fontSize: typography.fontSize.sm,
    color: colors.warning,
    marginLeft: spacing.xs,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.text.white,
    borderRadius: spacing.md,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: spacing.sm,
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
  emptyText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  achievementItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  achievementIcon: {
    marginRight: spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  achievementDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  achievementDate: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  transactionGroup: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  transactionDate: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  transactionStatus: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'capitalize',
  },
  logoutButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});
