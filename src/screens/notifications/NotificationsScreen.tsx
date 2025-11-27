import React, {useState, useEffect} from 'react';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import Button from '../../components/Button';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {useNotificationsStore} from '../../stores';
import {notificationsService} from '../../services';
import {Notification} from '../../types/notification';

export default function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    notifications,
    unreadCount,
    setNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    setLoading: setStoreLoading,
  } = useNotificationsStore();

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setStoreLoading(true);
      const response = await notificationsService.getNotifications({
        page: 1,
        pageSize: 50,
      });
      setNotifications(response.data || []);
    } catch (error: any) {
      console.error('Error loading notifications:', error);
      Alert.alert('Error', error?.message || 'Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
      setStoreLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      markAsRead(notificationId);
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      Alert.alert('Error', 'Failed to mark notification as read.');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      markAllAsRead();
      Alert.alert('Success', 'All notifications marked as read.');
    } catch (error: any) {
      console.error('Error marking all as read:', error);
      Alert.alert('Error', 'Failed to mark all notifications as read.');
    }
  };

  const handleDelete = async (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationsService.deleteNotification(notificationId);
              removeNotification(notificationId);
            } catch (error: any) {
              console.error('Error deleting notification:', error);
              Alert.alert('Error', 'Failed to delete notification.');
            }
          },
        },
      ]
    );
  };

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'payment':
        return 'credit-card';
      case 'group':
        return 'account-group';
      case 'achievement':
        return 'trophy';
      case 'system':
        return 'bell';
      default:
        return 'bell-outline';
    }
  };

  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'payment':
        return colors.primary[600];
      case 'group':
        return colors.blue[600];
      case 'achievement':
        return colors.warning;
      case 'system':
        return colors.secondary[600];
      default:
        return colors.gray[600];
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
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
      {/* Header with Mark All Read */}
      {notifications.length > 0 && unreadCount > 0 && (
        <View style={styles.header}>
          <Button
            title={`Mark All Read (${unreadCount})`}
            onPress={handleMarkAllAsRead}
            size="small"
            variant="outline"
            style={styles.markAllButton}
          />
        </View>
      )}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {notifications.length === 0 ? (
          <Card style={styles.emptyCard}>
            <View style={styles.emptyState}>
              <Icon name="bell-off-outline" size={64} color={colors.gray[400]} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptyText}>
                You're all caught up! New notifications will appear here.
              </Text>
            </View>
          </Card>
        ) : (
          notifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => {
                if (!notification.read) {
                  handleMarkAsRead(notification.id);
                }
              }}
              activeOpacity={0.7}>
              <Card
                style={[
                  styles.notificationCard,
                  !notification.read && styles.unreadNotification,
                ]}>
                <View style={styles.notificationContent}>
                  <View
                    style={[
                      styles.notificationIcon,
                      {backgroundColor: getNotificationColor(notification.type) + '20'},
                    ]}>
                    <Icon
                      name={getNotificationIcon(notification.type)}
                      size={24}
                      color={getNotificationColor(notification.type)}
                    />
                  </View>

                  <View style={styles.notificationInfo}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      {!notification.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <Text style={styles.notificationDate}>
                      {formatDate(notification.createdAt)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDelete(notification.id)}
                    style={styles.deleteButton}>
                    <Icon name="close" size={20} color={colors.gray[400]} />
                  </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.text.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  markAllButton: {
    alignSelf: 'flex-end',
  },
  content: {
    padding: spacing.md,
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
  },
  notificationCard: {
    marginBottom: spacing.sm,
  },
  unreadNotification: {
    backgroundColor: colors.primary[50],
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[600],
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  notificationTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary[600],
    marginLeft: spacing.xs,
  },
  notificationMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  notificationDate: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  deleteButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
});
