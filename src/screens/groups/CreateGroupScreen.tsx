import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useGroupsStore} from '../../stores';
import {groupsService} from '../../services';
import {GroupConfiguration} from '../../types/group';

type CreateGroupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateGroup'
>;

export default function CreateGroupScreen() {
  const navigation = useNavigation<CreateGroupScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [config, setConfig] = useState<GroupConfiguration | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monthlyContribution: '',
    maxMembers: '',
    cycleDuration: '',
    startDate: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const {addGroup} = useGroupsStore();

  useEffect(() => {
    loadConfiguration();
    // Set default start date to today
    setFormData(prev => ({
      ...prev,
      startDate: prev.startDate || formatDateForInput(new Date()),
    }));
  }, []);

  const loadConfiguration = async () => {
    try {
      setConfigLoading(true);
      const groupConfig = await groupsService.getGroupConfiguration();
      setConfig(groupConfig);
      
      // Set default values
      setFormData(prev => ({
        ...prev,
        maxMembers: groupConfig.maxMembers.toString(),
        cycleDuration: groupConfig.cycleDurations[0]?.toString() || '12',
        // Keep existing startDate or set to today
        startDate: prev.startDate || formatDateForInput(new Date()),
      }));
    } catch (error: any) {
      console.error('Error loading configuration:', error);
      Alert.alert('Error', 'Failed to load group configuration. Please try again.');
    } finally {
      setConfigLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    }

    if (!formData.monthlyContribution) {
      newErrors.monthlyContribution = 'Monthly contribution is required';
    } else {
      const amount = parseFloat(formData.monthlyContribution);
      if (isNaN(amount) || amount <= 0) {
        newErrors.monthlyContribution = 'Please enter a valid amount';
      } else if (config && amount < config.minContribution) {
        newErrors.monthlyContribution = `Minimum contribution is ₦${config.minContribution.toLocaleString()}`;
      } else if (config && amount > config.maxContribution) {
        newErrors.monthlyContribution = `Maximum contribution is ₦${config.maxContribution.toLocaleString()}`;
      }
    }

    if (!formData.maxMembers) {
      newErrors.maxMembers = 'Maximum members is required';
    } else {
      const members = parseInt(formData.maxMembers);
      if (isNaN(members) || members < 2) {
        newErrors.maxMembers = 'Minimum 2 members required';
      } else if (config && members < config.minMembers) {
        newErrors.maxMembers = `Minimum ${config.minMembers} members required`;
      } else if (config && members > config.maxMembers) {
        newErrors.maxMembers = `Maximum ${config.maxMembers} members allowed`;
      }
    }

    if (!formData.cycleDuration) {
      newErrors.cycleDuration = 'Cycle duration is required';
    } else {
      const duration = parseInt(formData.cycleDuration);
      if (isNaN(duration) || duration < 1) {
        newErrors.cycleDuration = 'Please enter a valid duration';
      }
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const group = await groupsService.createGroup({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        monthlyContribution: parseFloat(formData.monthlyContribution),
        maxMembers: parseInt(formData.maxMembers),
        cycleDuration: parseInt(formData.cycleDuration),
        startDate: formData.startDate,
      });

      addGroup(group);

      Alert.alert(
        'Success',
        'Group created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('GroupDetail', {groupId: group.id}),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating group:', error);
      Alert.alert('Error', error?.message || 'Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMinDate = (): string => {
    return formatDateForInput(new Date());
  };

  if (configLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Card style={styles.card}>
          <Text style={styles.title}>Create New Group</Text>
          <Text style={styles.subtitle}>
            Set up a new savings group and invite members
          </Text>

          <Input
            label="Group Name *"
            placeholder="Enter group name"
            value={formData.name}
            onChangeText={text => {
              setFormData({...formData, name: text});
              if (errors.name) setErrors({...errors, name: ''});
            }}
            error={errors.name}
            leftIcon="account-group"
          />

          <Input
            label="Description"
            placeholder="Enter group description (optional)"
            value={formData.description}
            onChangeText={text => setFormData({...formData, description: text})}
            multiline
            numberOfLines={3}
            leftIcon="text"
          />

          <Input
            label="Monthly Contribution (₦) *"
            placeholder="Enter monthly contribution amount"
            value={formData.monthlyContribution}
            onChangeText={text => {
              setFormData({...formData, monthlyContribution: text});
              if (errors.monthlyContribution) {
                setErrors({...errors, monthlyContribution: ''});
              }
            }}
            keyboardType="numeric"
            error={errors.monthlyContribution}
            leftIcon="currency-ngn"
          />
          {config && (
            <Text style={styles.hint}>
              Range: ₦{config.minContribution.toLocaleString()} - ₦
              {config.maxContribution.toLocaleString()}
            </Text>
          )}

          <Input
            label="Maximum Members *"
            placeholder="Enter maximum number of members"
            value={formData.maxMembers}
            onChangeText={text => {
              setFormData({...formData, maxMembers: text});
              if (errors.maxMembers) setErrors({...errors, maxMembers: ''});
            }}
            keyboardType="numeric"
            error={errors.maxMembers}
            leftIcon="account-group"
          />
          {config && (
            <Text style={styles.hint}>
              Range: {config.minMembers} - {config.maxMembers} members
            </Text>
          )}

          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Cycle Duration (months) *</Text>
            <View style={styles.cycleOptions}>
              {config?.cycleDurations.map(duration => (
                <Button
                  key={duration}
                  title={`${duration} months`}
                  onPress={() => {
                    setFormData({...formData, cycleDuration: duration.toString()});
                    if (errors.cycleDuration) {
                      setErrors({...errors, cycleDuration: ''});
                    }
                  }}
                  variant={
                    formData.cycleDuration === duration.toString()
                      ? 'primary'
                      : 'outline'
                  }
                  size="small"
                  style={styles.cycleOption}
                />
              ))}
            </View>
            {errors.cycleDuration && (
              <Text style={styles.errorText}>{errors.cycleDuration}</Text>
            )}
          </View>

          <Input
            label="Start Date *"
            placeholder="YYYY-MM-DD (e.g., 2025-01-15)"
            value={formData.startDate}
            onChangeText={text => {
              // Allow only date format characters
              const cleaned = text.replace(/[^0-9-]/g, '');
              setFormData({...formData, startDate: cleaned});
              if (errors.startDate) setErrors({...errors, startDate: ''});
            }}
            error={errors.startDate}
            leftIcon="calendar"
            keyboardType="numeric"
            maxLength={10}
          />
          <Text style={styles.hint}>
            Format: YYYY-MM-DD (e.g., {formatDateForInput(new Date())}). The group will start collecting contributions on this date.
          </Text>

          <Button
            title="Create Group"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
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
  card: {
    marginBottom: spacing.md,
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
  hint: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    marginLeft: spacing.md,
  },
  selectContainer: {
    marginBottom: spacing.md,
  },
  selectLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  cycleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  cycleOption: {
    flex: 1,
    minWidth: '30%',
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
