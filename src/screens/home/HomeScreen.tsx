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
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import Button from '../../components/Button';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useAuthStore, useGroupsStore} from '../../stores';
import {groupsService, paymentsService} from '../../services';
import {Payment} from '../../types/payment';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);

  const {user} = useAuthStore();
  const {groups, setGroups, isLoading: groupsLoading} = useGroupsStore();

  // Calculate savings totals from groups
  const calculateSavings = () => {
    if (!groups || groups.length === 0) {
      return {
        totalSaved: 0,
        monthlyContribution: 0,
        nextPayout: null,
        groupSize: 0,
        position: 0,
      };
    }

    const totalSaved = groups.reduce((sum, group) => {
      // Calculate based on monthly contribution and cycle
      const monthsActive = Math.floor(
        (new Date().getTime() - new Date(group.startDate).getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      );
      return sum + group.monthlyContribution * Math.min(monthsActive, group.cycleDuration);
    }, 0);

    const monthlyContribution = groups.reduce(
      (sum, group) => sum + group.monthlyContribution,
      0
    );

    // Find next payout (simplified - would need more logic based on payout schedule)
    const activeGroups = groups.filter(g => g.status === 'active');
    const nextPayout = activeGroups.length > 0 ? activeGroups[0].startDate : null;

    return {
      totalSaved,
      monthlyContribution,
      nextPayout,
      groupSize: groups.reduce((sum, g) => sum + g.currentMembers, 0),
      position: 0, // Would need to calculate based on user's position in groups
    };
  };

  const savings = React.useMemo(() => {
    try {
      return calculateSavings();
    } catch (error) {
      console.error('HomeScreen: Error calculating savings:', error);
      return {
        totalSaved: 0,
        monthlyContribution: 0,
        nextPayout: null,
        groupSize: 0,
        position: 0,
      };
    }
  }, [groups]);

  // Format date helper
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  // Format date for activity (short format)
  const formatActivityDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  };

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      console.log('HomeScreen: Starting to load data...');
      
      // Load groups
      console.log('HomeScreen: Loading groups...');
      const userGroups = await groupsService.getMyGroups();
      console.log('HomeScreen: Groups loaded:', userGroups?.length || 0);
      setGroups(userGroups || []);

      // Load recent payments
      console.log('HomeScreen: Loading payments...');
      const paymentHistory = await paymentsService.getPaymentHistory({
        page: 1,
        pageSize: 10,
      });
      console.log('HomeScreen: Payments loaded:', paymentHistory?.payments?.length || 0);
      setRecentPayments(paymentHistory?.payments || []);
      
      console.log('HomeScreen: Data loading completed successfully');
    } catch (error: any) {
      console.error('HomeScreen: Error loading home data:', error);
      // Only show alert if not a network error in dev mode (services handle mock data)
      if (!__DEV__ || (error.code !== 'NETWORK_ERROR' && error.status !== 0)) {
        Alert.alert(
          'Error',
          error?.message || 'Failed to load data. Please try again.'
        );
      }
      // Set empty arrays on error so UI doesn't break
      setGroups([]);
      setRecentPayments([]);
    } finally {
      console.log('HomeScreen: Setting loading to false');
      setLoading(false);
      setRefreshing(false);
      console.log('HomeScreen: State update called');
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, []);
  
  // Separate effect for timeout - use ref to avoid stale closure
  useEffect(() => {
    if (!loading) return;
    
    // Safety timeout - ensure loading state doesn't get stuck
    const timeout = setTimeout(() => {
      console.warn('HomeScreen: Loading timeout - forcing loading to false');
      setLoading(false);
      setRefreshing(false);
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeout);
  }, [loading]);

  // Show loading state
  console.log('HomeScreen: Render - loading:', loading, 'refreshing:', refreshing, 'groups:', groups.length);
  
  // Force re-render check
  React.useEffect(() => {
    console.log('HomeScreen: useEffect triggered - loading:', loading);
  }, [loading]);
  
  // Always show content after initial load - don't block on loading state
  if (loading && !refreshing && groups.length === 0 && recentPayments.length === 0) {
    console.log('HomeScreen: Rendering loading state');
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.primary[600], colors.secondary[600]]}
          style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoSection}>
              <Image
                source={{
                  uri: 'https://static.readdy.ai/image/c8fa67cf25818f8977dc6c7bfc4f6111/6aaef037c8e44e8eb9ec2616da6136a8.png',
                }}
                style={styles.logo}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.headerTitle}>EsusuHub</Text>
                <Text style={styles.headerSubtitle}>Team up Cash up Climb up!</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  console.log('HomeScreen: Rendering main content. Loading:', loading, 'Groups:', groups.length, 'Payments:', recentPayments.length);

  // Temporary: Simple render to test if component works
  if (__DEV__ && loading === false && groups.length === 0 && recentPayments.length === 0) {
    console.log('HomeScreen: Rendering test view');
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.primary[600], colors.secondary[600]]}
          style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>EsusuHub</Text>
          </View>
        </LinearGradient>
        <View style={styles.content}>
          <Text>Home Screen Loaded Successfully!</Text>
          <Text>Groups: {groups.length}</Text>
          <Text>Payments: {recentPayments.length}</Text>
          <Button title="Test Button" onPress={() => console.log('Button pressed')} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary[600], colors.secondary[600]]}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoSection}>
            <Image
              source={{
                uri: 'https://static.readdy.ai/image/c8fa67cf25818f8977dc6c7bfc4f6111/6aaef037c8e44e8eb9ec2616da6136a8.png',
              }}
              style={styles.logo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.headerTitle}>EsusuHub</Text>
              <Text style={styles.headerSubtitle}>Team up Cash up Climb up!</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications' as any)}>
              <Icon name="bell-outline" size={24} color={colors.text.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile' as any)}>
              {user?.avatarUrl ? (
                <Image source={{uri: user.avatarUrl}} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Icon name="account" size={24} color={colors.text.white} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {activeTab === 'dashboard' && (
          <>
            {/* Balance Card */}
            <LinearGradient
              colors={[colors.primary[500], colors.secondary[500]]}
              style={styles.balanceCard}>
              <View style={styles.balanceHeader}>
                <View>
                  <Text style={styles.balanceLabel}>Total Saved</Text>
                  <Text style={styles.balanceAmount}>
                    ₦{savings.totalSaved.toLocaleString()}
                  </Text>
                </View>
                <Icon name="wallet" size={32} color={colors.text.white} />
              </View>
              <View style={styles.balanceStats}>
                <View>
                  <Text style={styles.balanceStatLabel}>Monthly</Text>
                  <Text style={styles.balanceStatValue}>
                    ₦{savings.monthlyContribution.toLocaleString()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.balanceStatLabel}>Position</Text>
                  <Text style={styles.balanceStatValue}>
                    {savings.position} of {savings.groupSize}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Next Payout */}
            <Card style={styles.card}>
              <View style={styles.payoutRow}>
                <View style={styles.payoutIcon}>
                  <Icon
                    name="calendar-check"
                    size={24}
                    color={colors.primary[600]}
                  />
                </View>
                <View style={styles.payoutInfo}>
                  <Text style={styles.payoutLabel}>Next Payout</Text>
                  <Text style={styles.payoutDate}>
                    {savings.nextPayout ? formatDate(savings.nextPayout) : 'N/A'}
                  </Text>
                </View>
                <View style={styles.payoutAmount}>
                  {savings.nextPayout && (
                    <>
                      <Text style={styles.payoutValue}>
                        ₦{savings.monthlyContribution.toLocaleString()}
                      </Text>
                      <Text style={styles.payoutSubtext}>
                        {formatDate(savings.nextPayout)}
                      </Text>
                    </>
                  )}
                  {!savings.nextPayout && (
                    <Text style={styles.payoutSubtext}>No upcoming payout</Text>
                  )}
                </View>
              </View>
            </Card>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => navigation.navigate('Payment' as any)}>
                <View style={[styles.quickActionIcon, {backgroundColor: colors.primary[100]}]}>
                  <Icon name="hand-coin" size={24} color={colors.primary[600]} />
                </View>
                <Text style={styles.quickActionText}>Pay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => navigation.navigate('Groups' as any)}>
                <View style={[styles.quickActionIcon, {backgroundColor: colors.blue[100]}]}>
                  <Icon name="account-group" size={24} color={colors.blue[600]} />
                </View>
                <Text style={styles.quickActionText}>Groups</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => navigation.navigate('Banking' as any)}>
                <View style={[styles.quickActionIcon, {backgroundColor: colors.secondary[100]}]}>
                  <Icon name="bank" size={24} color={colors.secondary[600]} />
                </View>
                <Text style={styles.quickActionText}>Banking</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction}>
                <View style={[styles.quickActionIcon, {backgroundColor: colors.gray[100]}]}>
                  <Icon name="dots-horizontal" size={24} color={colors.gray[600]} />
                </View>
                <Text style={styles.quickActionText}>More</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Activity */}
            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {recentPayments.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon name="inbox" size={48} color={colors.gray[400]} />
                  <Text style={styles.emptyStateText}>No recent activity</Text>
                </View>
              ) : (
                recentPayments.map(payment => (
                  <View key={payment.id} style={styles.activityItem}>
                    <View
                      style={[
                        styles.activityIcon,
                        {
                          backgroundColor:
                            payment.status === 'completed'
                              ? colors.primary[100]
                              : payment.status === 'failed'
                              ? colors.error + '20'
                              : colors.warning + '20',
                        },
                      ]}>
                      <Icon
                        name={
                          payment.status === 'completed'
                            ? 'check-circle'
                            : payment.status === 'failed'
                            ? 'close-circle'
                            : 'clock-outline'
                        }
                        size={20}
                        color={
                          payment.status === 'completed'
                            ? colors.primary[600]
                            : payment.status === 'failed'
                            ? colors.error
                            : colors.warning
                        }
                      />
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityMember}>{payment.groupName}</Text>
                      <Text style={styles.activityDate}>
                        {formatActivityDate(payment.createdAt)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.activityAmount,
                        {
                          color:
                            payment.status === 'completed'
                              ? colors.primary[600]
                              : payment.status === 'failed'
                              ? colors.error
                              : colors.warning,
                        },
                      ]}>
                      ₦{payment.amount.toLocaleString()}
                    </Text>
                  </View>
                ))
              )}
            </Card>
          </>
        )}

        {activeTab === 'history' && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Payment History</Text>
            {recentPayments.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="history" size={48} color={colors.gray[400]} />
                <Text style={styles.emptyStateText}>No payment history</Text>
              </View>
            ) : (
              recentPayments.map(payment => (
                <View key={payment.id} style={styles.activityItem}>
                  <View
                    style={[
                      styles.activityIcon,
                      {
                        backgroundColor:
                          payment.status === 'completed'
                            ? colors.primary[100]
                            : payment.status === 'failed'
                            ? colors.error + '20'
                            : colors.warning + '20',
                      },
                    ]}>
                    <Icon
                      name={
                        payment.status === 'completed'
                          ? 'check-circle'
                          : payment.status === 'failed'
                          ? 'close-circle'
                          : 'clock-outline'
                      }
                      size={20}
                      color={
                        payment.status === 'completed'
                          ? colors.primary[600]
                          : payment.status === 'failed'
                          ? colors.error
                          : colors.warning
                      }
                    />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityMember}>{payment.groupName}</Text>
                    <Text style={styles.activityGroup}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Text>
                    <Text style={styles.activityDate}>
                      {formatActivityDate(payment.createdAt)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.activityAmount,
                      {
                        color:
                          payment.status === 'completed'
                            ? colors.primary[600]
                            : payment.status === 'failed'
                            ? colors.error
                            : colors.warning,
                      },
                    ]}>
                    ₦{payment.amount.toLocaleString()}
                  </Text>
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
  header: {
    paddingTop: 50,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.white,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.white,
    opacity: 0.9,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  balanceCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  balanceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.white,
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.white,
  },
  balanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceStatLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.white,
    opacity: 0.9,
  },
  balanceStatValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.white,
  },
  card: {
    marginBottom: spacing.md,
  },
  payoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  payoutInfo: {
    flex: 1,
  },
  payoutLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  payoutDate: {
    fontSize: typography.fontSize.md,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
  },
  payoutAmount: {
    alignItems: 'flex-end',
  },
  payoutValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  payoutSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickActionText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityMember: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  activityGroup: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
  },
  activityDate: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  activityAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
});

