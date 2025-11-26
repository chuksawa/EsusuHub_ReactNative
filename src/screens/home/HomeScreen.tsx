import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  const savings = {
    totalSaved: 1250000,
    monthlyContribution: 50000,
    nextPayout: 'March 15, 2024',
    groupSize: 12,
    position: 3,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'contribution',
      amount: 50000,
      date: 'Feb 10',
      member: 'You',
      group: 'Unity Savings Circle',
    },
    {
      id: 2,
      type: 'payout',
      amount: 600000,
      date: 'Feb 8',
      member: 'Sarah Johnson',
      group: 'Unity Savings Circle',
    },
  ];

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
              <Image
                source={{
                  uri: 'https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait&width=100&height=100',
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                  <Text style={styles.payoutDate}>{savings.nextPayout}</Text>
                </View>
                <View style={styles.payoutAmount}>
                  <Text style={styles.payoutValue}>₦600K</Text>
                  <Text style={styles.payoutSubtext}>Your turn</Text>
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
              {recentActivity.map(activity => (
                <View key={activity.id} style={styles.activityItem}>
                  <View
                    style={[
                      styles.activityIcon,
                      {
                        backgroundColor:
                          activity.type === 'contribution'
                            ? colors.primary[100]
                            : colors.warning + '20',
                      },
                    ]}>
                    <Icon
                      name={
                        activity.type === 'contribution'
                          ? 'arrow-up'
                          : 'arrow-down'
                      }
                      size={20}
                      color={
                        activity.type === 'contribution'
                          ? colors.primary[600]
                          : colors.warning
                      }
                    />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityMember}>{activity.member}</Text>
                    <Text style={styles.activityDate}>{activity.date}</Text>
                  </View>
                  <Text
                    style={[
                      styles.activityAmount,
                      {
                        color:
                          activity.type === 'contribution'
                            ? colors.primary[600]
                            : colors.warning,
                      },
                    ]}>
                    {activity.type === 'contribution' ? '+' : '-'}₦
                    {activity.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </Card>
          </>
        )}

        {activeTab === 'history' && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Payment History</Text>
            {recentActivity.map(activity => (
              <View key={activity.id} style={styles.activityItem}>
                <View
                  style={[
                    styles.activityIcon,
                    {
                      backgroundColor:
                        activity.type === 'contribution'
                          ? colors.primary[100]
                          : colors.warning + '20',
                    },
                  ]}>
                  <Icon
                    name={
                      activity.type === 'contribution' ? 'arrow-up' : 'arrow-down'
                    }
                    size={20}
                    color={
                      activity.type === 'contribution'
                        ? colors.primary[600]
                        : colors.warning
                    }
                  />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityMember}>{activity.member}</Text>
                  <Text style={styles.activityGroup}>{activity.group}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
                <Text
                  style={[
                    styles.activityAmount,
                    {
                      color:
                        activity.type === 'contribution'
                          ? colors.primary[600]
                          : colors.warning,
                    },
                  ]}>
                  {activity.type === 'contribution' ? '+' : '-'}₦
                  {activity.amount.toLocaleString()}
                </Text>
              </View>
            ))}
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
});

