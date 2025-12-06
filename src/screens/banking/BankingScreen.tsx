import React, {useState, useEffect, useCallback} from 'react';
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
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {bankingService} from '../../services';
import {
  BankAccount,
  BankAccountApplication,
  BankTransaction,
  CreateAccountApplicationRequest,
  DepositRequest,
  WithdrawRequest,
} from '../../types/banking';

type TabType = 'overview' | 'accounts' | 'applications' | 'transactions';

export default function BankingScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [applications, setApplications] = useState<BankAccountApplication[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  // Modal states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  // Form states
  const [applicationForm, setApplicationForm] = useState<CreateAccountApplicationRequest>({
    accountType: 'savings',
    employmentStatus: '',
    employerName: '',
    monthlyIncome: undefined,
    purposeOfAccount: '',
    initialDeposit: undefined,
    preferredBranch: '',
  });

  const [depositForm, setDepositForm] = useState<DepositRequest>({
    accountId: '',
    amount: 0,
    description: '',
  });

  const [withdrawForm, setWithdrawForm] = useState<WithdrawRequest>({
    accountId: '',
    amount: 0,
    description: '',
  });

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [accountsData, applicationsData, transactionsData] = await Promise.all([
        bankingService.getAccounts(),
        bankingService.getApplications(),
        bankingService.getTransactions({page: 1, pageSize: 10}),
      ]);

      setAccounts(accountsData);
      setApplications(applicationsData);
      setTransactions(transactionsData.transactions);
    } catch (error: any) {
      console.error('Error loading banking data:', error);
      Alert.alert(
        'Error',
        error?.message || 'Failed to load banking data. Please try again.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Handle apply for account
  const handleApplyAccount = async () => {
    try {
      if (!applicationForm.accountType) {
        Alert.alert('Error', 'Please select an account type');
        return;
      }

      const newApplication = await bankingService.applyForAccount(applicationForm);
      setApplications(prev => [newApplication, ...prev]);
      setShowApplyModal(false);
      setApplicationForm({
        accountType: 'savings',
        employmentStatus: '',
        employerName: '',
        monthlyIncome: undefined,
        purposeOfAccount: '',
        initialDeposit: undefined,
        preferredBranch: '',
      });
      Alert.alert('Success', 'Your application has been submitted successfully!');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to submit application. Please try again.');
    }
  };

  // Handle deposit
  const handleDeposit = async () => {
    try {
      if (!depositForm.accountId || depositForm.amount <= 0) {
        Alert.alert('Error', 'Please select an account and enter a valid amount');
        return;
      }

      await bankingService.deposit(depositForm);
      setShowDepositModal(false);
      setDepositForm({accountId: '', amount: 0, description: ''});
      Alert.alert('Success', 'Deposit processed successfully!');
      loadData(); // Refresh data
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to process deposit. Please try again.');
    }
  };

  // Handle withdraw
  const handleWithdraw = async () => {
    try {
      if (!withdrawForm.accountId || withdrawForm.amount <= 0) {
        Alert.alert('Error', 'Please select an account and enter a valid amount');
        return;
      }

      await bankingService.withdraw(withdrawForm);
      setShowWithdrawModal(false);
      setWithdrawForm({accountId: '', amount: 0, description: ''});
      Alert.alert('Success', 'Withdrawal processed successfully!');
      loadData(); // Refresh data
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to process withdrawal. Please try again.');
    }
  };

  // Calculate totals
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const totalAvailable = accounts.reduce((sum, acc) => sum + (acc.availableBalance || 0), 0);

  if (loading && accounts.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Loading banking data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}>
            <Text
              style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'accounts' && styles.activeTab]}
            onPress={() => setActiveTab('accounts')}>
            <Text
              style={[styles.tabText, activeTab === 'accounts' && styles.activeTabText]}>
              Accounts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'applications' && styles.activeTab]}
            onPress={() => setActiveTab('applications')}>
            <Text
              style={[styles.tabText, activeTab === 'applications' && styles.activeTabText]}>
              Applications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
            onPress={() => setActiveTab('transactions')}>
            <Text
              style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
              Transactions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            {/* Summary Cards */}
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Balance</Text>
              <Text style={styles.summaryAmount}>
                ₦{totalBalance.toLocaleString('en-NG', {minimumFractionDigits: 2})}
              </Text>
              <Text style={styles.summarySubtext}>
                Available: ₦{totalAvailable.toLocaleString('en-NG', {minimumFractionDigits: 2})}
              </Text>
            </Card>

            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => setShowApplyModal(true)}>
                <View style={[styles.quickActionIcon, {backgroundColor: colors.primary[50]}]}>
                  <Icon name="account-plus" size={24} color={colors.primary[600]} />
                </View>
                <Text style={styles.quickActionText}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => {
                  if (accounts.length === 0) {
                    Alert.alert('No Accounts', 'Please apply for an account first');
                    return;
                  }
                  setDepositForm({...depositForm, accountId: accounts[0].id});
                  setShowDepositModal(true);
                }}>
                <View style={[styles.quickActionIcon, {backgroundColor: colors.success[50]}]}>
                  <Icon name="arrow-down" size={24} color={colors.success[600]} />
                </View>
                <Text style={styles.quickActionText}>Deposit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => {
                  if (accounts.length === 0) {
                    Alert.alert('No Accounts', 'Please apply for an account first');
                    return;
                  }
                  setWithdrawForm({...withdrawForm, accountId: accounts[0].id});
                  setShowWithdrawModal(true);
                }}>
                <View style={[styles.quickActionIcon, {backgroundColor: colors.warning[50]}]}>
                  <Icon name="arrow-up" size={24} color={colors.warning[600]} />
                </View>
                <Text style={styles.quickActionText}>Withdraw</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Accounts */}
            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Recent Accounts</Text>
              {accounts.length === 0 ? (
                <Text style={styles.emptyStateText}>No accounts yet. Apply for one to get started!</Text>
              ) : (
                accounts.slice(0, 3).map(account => (
                  <TouchableOpacity
                    key={account.id}
                    style={styles.accountItem}
                    onPress={() => {
                      setSelectedAccount(account);
                      setShowAccountDetails(true);
                    }}>
                    <View style={styles.accountInfo}>
                      <Text style={styles.accountName}>{account.accountName}</Text>
                      <Text style={styles.accountNumber}>{account.accountNumber}</Text>
                    </View>
                    <View style={styles.accountBalance}>
                      <Text style={styles.accountBalanceText}>
                        ₦{account.balance.toLocaleString('en-NG', {minimumFractionDigits: 2})}
                      </Text>
                      <Text style={styles.accountType}>{account.accountType}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </Card>

            {/* Recent Transactions */}
            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              {transactions.length === 0 ? (
                <Text style={styles.emptyStateText}>No transactions yet</Text>
              ) : (
                transactions.slice(0, 5).map(transaction => (
                  <View key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionIcon}>
                      <Icon
                        name={
                          transaction.transactionType === 'deposit'
                            ? 'arrow-down'
                            : transaction.transactionType === 'withdrawal'
                            ? 'arrow-up'
                            : 'swap-horizontal'
                        }
                        size={20}
                        color={
                          transaction.transactionType === 'deposit'
                            ? colors.success[600]
                            : colors.error
                        }
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDescription}>
                        {transaction.description || transaction.transactionType}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.transactionAmount,
                        transaction.transactionType === 'deposit' && styles.transactionAmountCredit,
                      ]}>
                      {transaction.transactionType === 'deposit' ? '+' : '-'}₦
                      {Math.abs(transaction.amount).toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                      })}
                    </Text>
                  </View>
                ))
              )}
            </Card>
          </View>
        )}

        {activeTab === 'accounts' && (
          <View style={styles.tabContent}>
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Accounts</Text>
                <Button
                  title="Apply"
                  onPress={() => setShowApplyModal(true)}
                  size="small"
                  variant="outline"
                />
              </View>
              {accounts.length === 0 ? (
                <Text style={styles.emptyStateText}>No accounts yet. Apply for one to get started!</Text>
              ) : (
                accounts.map(account => (
                  <TouchableOpacity
                    key={account.id}
                    style={styles.accountCard}
                    onPress={() => {
                      setSelectedAccount(account);
                      setShowAccountDetails(true);
                    }}>
                    <View style={styles.accountCardHeader}>
                      <View style={styles.accountCardIcon}>
                        <Icon
                          name={
                            account.accountType === 'savings'
                              ? 'piggy-bank'
                              : account.accountType === 'current'
                              ? 'wallet'
                              : 'bank'
                          }
                          size={24}
                          color={colors.primary[600]}
                        />
                      </View>
                      <View style={styles.accountCardInfo}>
                        <Text style={styles.accountCardName}>{account.accountName}</Text>
                        <Text style={styles.accountCardNumber}>{account.accountNumber}</Text>
                      </View>
                      <View style={styles.accountCardStatus}>
                        <View
                          style={[
                            styles.statusBadge,
                            account.status === 'active' && styles.statusBadgeActive,
                          ]}>
                          <Text
                            style={[
                              styles.statusText,
                              account.status === 'active' && styles.statusTextActive,
                            ]}>
                            {account.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.accountCardBody}>
                      <View style={styles.accountCardBalance}>
                        <Text style={styles.accountCardBalanceLabel}>Balance</Text>
                        <Text style={styles.accountCardBalanceAmount}>
                          ₦{account.balance.toLocaleString('en-NG', {minimumFractionDigits: 2})}
                        </Text>
                      </View>
                      <View style={styles.accountCardDetails}>
                        <Text style={styles.accountCardDetail}>
                          Available: ₦
                          {account.availableBalance.toLocaleString('en-NG', {
                            minimumFractionDigits: 2,
                          })}
                        </Text>
                        {account.interestRate > 0 && (
                          <Text style={styles.accountCardDetail}>
                            Interest: {account.interestRate}%
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </Card>
          </View>
        )}

        {activeTab === 'applications' && (
          <View style={styles.tabContent}>
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Applications</Text>
                <Button
                  title="New Application"
                  onPress={() => setShowApplyModal(true)}
                  size="small"
                />
              </View>
              {applications.length === 0 ? (
                <Text style={styles.emptyStateText}>No applications yet</Text>
              ) : (
                applications.map(application => (
                  <View key={application.id} style={styles.applicationCard}>
                    <View style={styles.applicationHeader}>
                      <Text style={styles.applicationType}>
                        {application.accountType.replace('_', ' ').toUpperCase()}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          application.status === 'approved' && styles.statusBadgeSuccess,
                          application.status === 'rejected' && styles.statusBadgeError,
                        ]}>
                        <Text
                          style={[
                            styles.statusText,
                            application.status === 'approved' && styles.statusTextSuccess,
                            application.status === 'rejected' && styles.statusTextError,
                          ]}>
                          {application.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.applicationDate}>
                      Applied: {new Date(application.applicationDate).toLocaleDateString()}
                    </Text>
                    {application.reviewerNotes && (
                      <Text style={styles.applicationNotes}>{application.reviewerNotes}</Text>
                    )}
                  </View>
                ))
              )}
            </Card>
          </View>
        )}

        {activeTab === 'transactions' && (
          <View style={styles.tabContent}>
            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Transaction History</Text>
              {transactions.length === 0 ? (
                <Text style={styles.emptyStateText}>No transactions yet</Text>
              ) : (
                transactions.map(transaction => (
                  <View key={transaction.id} style={styles.transactionCard}>
                    <View style={styles.transactionHeader}>
                      <View style={styles.transactionIcon}>
                        <Icon
                          name={
                            transaction.transactionType === 'deposit'
                              ? 'arrow-down'
                              : transaction.transactionType === 'withdrawal'
                              ? 'arrow-up'
                              : 'swap-horizontal'
                          }
                          size={24}
                          color={
                            transaction.transactionType === 'deposit'
                              ? colors.success[600]
                              : colors.error
                          }
                        />
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.transactionDescription}>
                          {transaction.description || transaction.transactionType}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {new Date(transaction.transactionDate).toLocaleDateString()}
                        </Text>
                        {transaction.referenceNumber && (
                          <Text style={styles.transactionRef}>
                            Ref: {transaction.referenceNumber}
                          </Text>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.transactionAmount,
                          transaction.transactionType === 'deposit' && styles.transactionAmountCredit,
                        ]}>
                        {transaction.transactionType === 'deposit' ? '+' : '-'}₦
                        {Math.abs(transaction.amount).toLocaleString('en-NG', {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </View>
                    <View style={styles.transactionFooter}>
                      <Text style={styles.transactionBalance}>
                        Balance: ₦
                        {transaction.balanceAfter.toLocaleString('en-NG', {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          transaction.status === 'completed' && styles.statusBadgeSuccess,
                        ]}>
                        <Text
                          style={[
                            styles.statusText,
                            transaction.status === 'completed' && styles.statusTextSuccess,
                          ]}>
                          {transaction.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Apply Account Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showApplyModal}
        onRequestClose={() => setShowApplyModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply for Account</Text>
              <TouchableOpacity onPress={() => setShowApplyModal(false)}>
                <Icon name="close" size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Input
                label="Account Type"
                value={applicationForm.accountType}
                onChangeText={text =>
                  setApplicationForm({...applicationForm, accountType: text as any})
                }
                editable={false}
              />
              <View style={styles.accountTypeSelector}>
                {(['savings', 'current', 'fixed_deposit'] as const).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.accountTypeOption,
                      applicationForm.accountType === type && styles.accountTypeOptionActive,
                    ]}
                    onPress={() => setApplicationForm({...applicationForm, accountType: type})}>
                    <Text
                      style={[
                        styles.accountTypeOptionText,
                        applicationForm.accountType === type && styles.accountTypeOptionTextActive,
                      ]}>
                      {type.replace('_', ' ').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Input
                label="Employment Status"
                value={applicationForm.employmentStatus || ''}
                onChangeText={text =>
                  setApplicationForm({...applicationForm, employmentStatus: text})
                }
                placeholder="e.g., Employed, Self-employed"
              />
              <Input
                label="Employer Name"
                value={applicationForm.employerName || ''}
                onChangeText={text =>
                  setApplicationForm({...applicationForm, employerName: text})
                }
                placeholder="Company name"
              />
              <Input
                label="Monthly Income"
                value={applicationForm.monthlyIncome?.toString() || ''}
                onChangeText={text =>
                  setApplicationForm({
                    ...applicationForm,
                    monthlyIncome: text ? parseFloat(text) : undefined,
                  })
                }
                keyboardType="numeric"
                placeholder="0.00"
              />
              <Input
                label="Purpose of Account"
                value={applicationForm.purposeOfAccount || ''}
                onChangeText={text =>
                  setApplicationForm({...applicationForm, purposeOfAccount: text})
                }
                multiline
                numberOfLines={3}
                placeholder="Describe the purpose of this account"
              />
              <Input
                label="Initial Deposit"
                value={applicationForm.initialDeposit?.toString() || ''}
                onChangeText={text =>
                  setApplicationForm({
                    ...applicationForm,
                    initialDeposit: text ? parseFloat(text) : undefined,
                  })
                }
                keyboardType="numeric"
                placeholder="0.00"
              />
              <Input
                label="Preferred Branch"
                value={applicationForm.preferredBranch || ''}
                onChangeText={text =>
                  setApplicationForm({...applicationForm, preferredBranch: text})
                }
                placeholder="Branch location"
              />
            </ScrollView>
            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setShowApplyModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Submit Application"
                onPress={handleApplyAccount}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Deposit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDepositModal}
        onRequestClose={() => setShowDepositModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Deposit</Text>
              <TouchableOpacity onPress={() => setShowDepositModal(false)}>
                <Icon name="close" size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Select Account</Text>
              {accounts.map(account => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.accountOption,
                    depositForm.accountId === account.id && styles.accountOptionActive,
                  ]}
                  onPress={() => setDepositForm({...depositForm, accountId: account.id})}>
                  <Text style={styles.accountOptionText}>
                    {account.accountName} - {account.accountNumber}
                  </Text>
                </TouchableOpacity>
              ))}
              <Input
                label="Amount"
                value={depositForm.amount.toString()}
                onChangeText={text =>
                  setDepositForm({...depositForm, amount: parseFloat(text) || 0})
                }
                keyboardType="numeric"
                placeholder="0.00"
              />
              <Input
                label="Description (Optional)"
                value={depositForm.description || ''}
                onChangeText={text => setDepositForm({...depositForm, description: text})}
                placeholder="Transaction description"
              />
            </View>
            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setShowDepositModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button title="Deposit" onPress={handleDeposit} style={styles.modalButton} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showWithdrawModal}
        onRequestClose={() => setShowWithdrawModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Withdraw</Text>
              <TouchableOpacity onPress={() => setShowWithdrawModal(false)}>
                <Icon name="close" size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Select Account</Text>
              {accounts.map(account => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.accountOption,
                    withdrawForm.accountId === account.id && styles.accountOptionActive,
                  ]}
                  onPress={() => setWithdrawForm({...withdrawForm, accountId: account.id})}>
                  <Text style={styles.accountOptionText}>
                    {account.accountName} - {account.accountNumber}
                  </Text>
                  <Text style={styles.accountOptionBalance}>
                    Available: ₦{account.availableBalance.toLocaleString('en-NG')}
                  </Text>
                </TouchableOpacity>
              ))}
              <Input
                label="Amount"
                value={withdrawForm.amount.toString()}
                onChangeText={text =>
                  setWithdrawForm({...withdrawForm, amount: parseFloat(text) || 0})
                }
                keyboardType="numeric"
                placeholder="0.00"
              />
              <Input
                label="Description (Optional)"
                value={withdrawForm.description || ''}
                onChangeText={text => setWithdrawForm({...withdrawForm, description: text})}
                placeholder="Transaction description"
              />
            </View>
            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setShowWithdrawModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button title="Withdraw" onPress={handleWithdraw} style={styles.modalButton} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Account Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAccountDetails}
        onRequestClose={() => setShowAccountDetails(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Account Details</Text>
              <TouchableOpacity onPress={() => setShowAccountDetails(false)}>
                <Icon name="close" size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>
            {selectedAccount && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.accountDetailsSection}>
                  <Text style={styles.accountDetailsLabel}>Account Name</Text>
                  <Text style={styles.accountDetailsValue}>{selectedAccount.accountName}</Text>
                </View>
                <View style={styles.accountDetailsSection}>
                  <Text style={styles.accountDetailsLabel}>Account Number</Text>
                  <Text style={styles.accountDetailsValue}>{selectedAccount.accountNumber}</Text>
                </View>
                <View style={styles.accountDetailsSection}>
                  <Text style={styles.accountDetailsLabel}>Account Type</Text>
                  <Text style={styles.accountDetailsValue}>
                    {selectedAccount.accountType.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
                <View style={styles.accountDetailsSection}>
                  <Text style={styles.accountDetailsLabel}>Balance</Text>
                  <Text style={styles.accountDetailsValue}>
                    ₦{selectedAccount.balance.toLocaleString('en-NG', {minimumFractionDigits: 2})}
                  </Text>
                </View>
                <View style={styles.accountDetailsSection}>
                  <Text style={styles.accountDetailsLabel}>Available Balance</Text>
                  <Text style={styles.accountDetailsValue}>
                    ₦
                    {selectedAccount.availableBalance.toLocaleString('en-NG', {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>
                {selectedAccount.interestRate > 0 && (
                  <View style={styles.accountDetailsSection}>
                    <Text style={styles.accountDetailsLabel}>Interest Rate</Text>
                    <Text style={styles.accountDetailsValue}>
                      {selectedAccount.interestRate}% per annum
                    </Text>
                  </View>
                )}
                <View style={styles.accountDetailsSection}>
                  <Text style={styles.accountDetailsLabel}>Status</Text>
                  <Text style={styles.accountDetailsValue}>{selectedAccount.status}</Text>
                </View>
                <View style={styles.accountDetailsSection}>
                  <Text style={styles.accountDetailsLabel}>Opened Date</Text>
                  <Text style={styles.accountDetailsValue}>
                    {new Date(selectedAccount.openedDate).toLocaleDateString()}
                  </Text>
                </View>
              </ScrollView>
            )}
            <View style={styles.modalFooter}>
              <Button
                title="Close"
                onPress={() => setShowAccountDetails(false)}
                style={styles.modalButton}
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
  content: {
    flex: 1,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    margin: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary[600],
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  activeTabText: {
    color: colors.text.white,
    fontWeight: typography.fontWeight.semibold,
  },
  tabContent: {
    padding: spacing.md,
  },
  summaryCard: {
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  summaryAmount: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  summarySubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  quickActionText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  sectionCard: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  emptyStateText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  accountNumber: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  accountBalance: {
    alignItems: 'flex-end',
  },
  accountBalanceText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  accountType: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  accountCard: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  accountCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  accountCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  accountCardInfo: {
    flex: 1,
  },
  accountCardName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  accountCardNumber: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  accountCardStatus: {
    marginLeft: spacing.sm,
  },
  accountCardBody: {
    marginTop: spacing.sm,
  },
  accountCardBalance: {
    marginBottom: spacing.xs,
  },
  accountCardBalanceLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  accountCardBalanceAmount: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
  },
  accountCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountCardDetail: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  applicationCard: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  applicationType: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  applicationDate: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  applicationNotes: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  transactionDate: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  transactionAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.error,
  },
  transactionAmountCredit: {
    color: colors.success[600],
  },
  transactionCard: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  transactionRef: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  transactionBalance: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
  statusBadgeActive: {
    backgroundColor: colors.primary[100],
  },
  statusBadgeSuccess: {
    backgroundColor: colors.success[100],
  },
  statusBadgeError: {
    backgroundColor: colors.error + '20',
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  statusTextActive: {
    color: colors.primary[700],
  },
  statusTextSuccess: {
    color: colors.success[700],
  },
  statusTextError: {
    color: colors.error,
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
  modalLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
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
  accountTypeSelector: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  accountTypeOption: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
    alignItems: 'center',
  },
  accountTypeOptionActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  accountTypeOptionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  accountTypeOptionTextActive: {
    color: colors.text.white,
  },
  accountOption: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
    marginBottom: spacing.sm,
  },
  accountOptionActive: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  accountOptionText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  accountOptionBalance: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  accountDetailsSection: {
    marginBottom: spacing.md,
  },
  accountDetailsLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  accountDetailsValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
});
