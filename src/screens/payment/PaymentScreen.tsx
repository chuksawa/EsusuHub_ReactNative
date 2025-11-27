import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useGroupsStore, usePaymentsStore} from '../../stores';
import {paymentsService, groupsService} from '../../services';
import {PaymentMethod, PaymentAccount} from '../../types/payment';
import {Group} from '../../types/group';
import config from '../../config/env';

type PaymentScreenRouteProp = RouteProp<RootStackParamList, 'Payment'>;
type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Payment'>;

function PaymentForm() {
  const route = useRoute<PaymentScreenRouteProp>();
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const [loading, setLoading] = useState(false);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);

  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const {addPayment} = usePaymentsStore();

  // Initialize with route params if available
  useEffect(() => {
    if (route.params?.groupId) {
      setSelectedGroup(route.params.groupId);
    }
    if (route.params?.monthlyContribution) {
      setAmount(route.params.monthlyContribution.toString());
    }
  }, [route.params]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setMethodsLoading(true);
      setGroupsLoading(true);

      // Load payment methods and accounts
      const [methods, accounts, userGroups] = await Promise.all([
        paymentsService.getPaymentMethods(),
        paymentsService.getPaymentAccounts(),
        groupsService.getMyGroups(),
      ]);

      setPaymentMethods(methods);
      setPaymentAccounts(accounts);
      setGroups(userGroups);

      // Set default payment method
      const defaultMethod = methods.find(m => m.isDefault) || methods[0];
      if (defaultMethod) {
        setSelectedMethod(defaultMethod.id);
      }
    } catch (error: any) {
      console.error('Error loading payment data:', error);
      Alert.alert('Error', error?.message || 'Failed to load payment data. Please try again.');
    } finally {
      setMethodsLoading(false);
      setGroupsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!selectedGroup) {
      Alert.alert('Error', 'Please select a group');
      return false;
    }

    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return false;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }

    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const selectedGroupData = groups.find(g => g.id === selectedGroup);
      const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);

      if (!selectedGroupData || !selectedMethodData) {
        throw new Error('Invalid selection');
      }

      // For Stripe card payments
      if (selectedMethodData.type === 'card') {
        // Initialize payment sheet
        const {error: initError} = await initPaymentSheet({
          merchantDisplayName: 'EsusuHub',
          paymentIntentClientSecret: '', // This would come from your backend
          // For now, we'll use the direct API approach
        });

        if (initError) {
          throw new Error(initError.message);
        }

        // Process payment through API (backend handles Stripe)
        const payment = await paymentsService.processPayment({
          groupId: selectedGroup,
          amount: parseFloat(amount),
          paymentMethodId: selectedMethod,
          description: description || `Payment for ${selectedGroupData.name}`,
        });

        addPayment(payment);

        Alert.alert(
          'Success',
          'Payment processed successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        // For other payment methods (bank transfer, mobile money)
        const payment = await paymentsService.processPayment({
          groupId: selectedGroup,
          amount: parseFloat(amount),
          paymentMethodId: selectedMethod,
          description: description || `Payment for ${selectedGroupData.name}`,
        });

        addPayment(payment);

        Alert.alert(
          'Success',
          'Payment request submitted successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', error?.message || 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (methodsLoading || groupsLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.card}>
        <Text style={styles.title}>Make Payment</Text>
        <Text style={styles.subtitle}>Select group and payment details</Text>

        {/* Group Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Group *</Text>
          {groups.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No groups available</Text>
            </View>
          ) : (
            groups.map(group => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.optionCard,
                  selectedGroup === group.id && styles.selectedOption,
                ]}
                onPress={() => setSelectedGroup(group.id)}>
                <View style={styles.optionContent}>
                  <Icon
                    name="account-group"
                    size={24}
                    color={
                      selectedGroup === group.id
                        ? colors.primary[600]
                        : colors.gray[400]
                    }
                  />
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>{group.name}</Text>
                    <Text style={styles.optionSubtitle}>
                      Monthly: ₦{group.monthlyContribution.toLocaleString()}
                    </Text>
                  </View>
                  {selectedGroup === group.id && (
                    <Icon name="check-circle" size={24} color={colors.primary[600]} />
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Amount */}
        <Input
          label="Amount (₦) *"
          placeholder="Enter payment amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          leftIcon="currency-ngn"
        />

        {/* Description */}
        <Input
          label="Description"
          placeholder="Payment description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={2}
          leftIcon="text"
        />

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Payment Method *</Text>
          {paymentMethods.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No payment methods available</Text>
              <Button
                title="Add Payment Method"
                onPress={() => Alert.alert('Info', 'Add payment method feature coming soon')}
                variant="outline"
                size="small"
                style={styles.addButton}
              />
            </View>
          ) : (
            paymentMethods.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.optionCard,
                  selectedMethod === method.id && styles.selectedOption,
                ]}
                onPress={() => setSelectedMethod(method.id)}>
                <View style={styles.optionContent}>
                  <Icon
                    name={
                      method.type === 'card'
                        ? 'credit-card'
                        : method.type === 'bank_transfer'
                        ? 'bank'
                        : 'cellphone'
                    }
                    size={24}
                    color={
                      selectedMethod === method.id
                        ? colors.primary[600]
                        : colors.gray[400]
                    }
                  />
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>{method.name}</Text>
                    {method.last4 && (
                      <Text style={styles.optionSubtitle}>
                        **** {method.last4}
                      </Text>
                    )}
                  </View>
                  {selectedMethod === method.id && (
                    <Icon name="check-circle" size={24} color={colors.primary[600]} />
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Payment Summary */}
        {selectedGroup && amount && (
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Group:</Text>
              <Text style={styles.summaryValue}>
                {groups.find(g => g.id === selectedGroup)?.name}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount:</Text>
              <Text style={styles.summaryValue}>
                ₦{parseFloat(amount || '0').toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Method:</Text>
              <Text style={styles.summaryValue}>
                {paymentMethods.find(m => m.id === selectedMethod)?.name}
              </Text>
            </View>
          </Card>
        )}

        <Button
          title="Process Payment"
          onPress={handlePayment}
          loading={loading}
          disabled={!selectedGroup || !amount || !selectedMethod}
          style={styles.submitButton}
        />
      </Card>
    </ScrollView>
  );
}

export default function PaymentScreen() {
  // Note: Stripe publishable key should come from config
  const publishableKey = config.STRIPE_PUBLISHABLE_KEY || '';

  if (!publishableKey) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.errorText}>
            Stripe is not configured. Please set STRIPE_PUBLISHABLE_KEY in your environment.
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <StripeProvider publishableKey={publishableKey}>
      <PaymentForm />
    </StripeProvider>
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
  card: {
    margin: spacing.md,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.text.white,
  },
  selectedOption: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  optionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  optionSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  addButton: {
    marginTop: spacing.sm,
  },
  summaryCard: {
    backgroundColor: colors.primary[50],
    marginBottom: spacing.md,
  },
  summaryTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.error,
    textAlign: 'center',
    padding: spacing.md,
  },
});
