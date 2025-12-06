import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {paymentsService} from '../../services';
import {Payment} from '../../types/payment';

export default function HistoryScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);

  const loadPaymentHistory = useCallback(async () => {
    try {
      setLoading(true);
      const paymentHistory = await paymentsService.getPaymentHistory({
        page: 1,
        pageSize: 50,
      });
      setPayments(paymentHistory?.payments || []);
    } catch (error: any) {
      console.error('Error loading payment history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPaymentHistory();
    }, [loadPaymentHistory]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadPaymentHistory();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && payments.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Loading payment history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {payments.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="history" size={48} color={colors.gray[400]} />
              <Text style={styles.emptyStateText}>No payment history</Text>
              <Text style={styles.emptyStateSubtext}>
                Your payment history will appear here once you make payments
              </Text>
            </View>
          ) : (
            payments.map(payment => (
              <View key={payment.id} style={styles.paymentItem}>
                <View
                  style={[
                    styles.paymentIcon,
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
                    size={24}
                    color={
                      payment.status === 'completed'
                        ? colors.primary[600]
                        : payment.status === 'failed'
                        ? colors.error
                        : colors.warning
                    }
                  />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentGroupName}>{payment.groupName}</Text>
                  <Text style={styles.paymentStatus}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Text>
                  <Text style={styles.paymentDate}>{formatDate(payment.createdAt)}</Text>
                  {payment.transactionReference && (
                    <Text style={styles.paymentReference}>Ref: {payment.transactionReference}</Text>
                  )}
                </View>
                <View style={styles.paymentAmount}>
                  <Text
                    style={[
                      styles.paymentAmountText,
                      {
                        color:
                          payment.status === 'completed'
                            ? colors.primary[600]
                            : payment.status === 'failed'
                            ? colors.error
                            : colors.warning,
                      },
                    ]}>
                    ₦{payment.amount.toLocaleString('en-NG', {minimumFractionDigits: 2})}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>
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
    flex: 1,
    padding: spacing.md,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentGroupName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  paymentStatus: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
    textTransform: 'capitalize',
  },
  paymentDate: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  paymentReference: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    fontFamily: 'monospace',
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  paymentAmountText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});

