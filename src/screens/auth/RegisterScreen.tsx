import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';

import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import Logo from '../../components/Logo';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {SecureStorageService} from '../../services/storage/secureStorage';
import {RootStackParamList} from '../../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {authService} from '../../services';
import {useAuthStore} from '../../stores';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return '';
  };

  const handleRegister = async () => {
    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the Terms of Service');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      Alert.alert('Error', passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Test connection first in dev mode
    if (__DEV__) {
      try {
        const {testBackendConnection} = await import('../../utils/testConnection');
        const testResult = await testBackendConnection();
        if (!testResult.success) {
          const apiUrl = (await import('../../config/env')).default.API_BASE_URL;
          Alert.alert(
            'Connection Test Failed',
            `${testResult.message}\n\nPlease check:\n• Backend server is running\n• Firewall allows port 5166\n• Current API URL: ${apiUrl}`,
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Try Anyway', onPress: () => proceedWithRegistration()},
            ]
          );
          return;
        }
      } catch (error) {
        // If test fails, continue anyway
        console.warn('Connection test failed, proceeding:', error);
      }
    }

    proceedWithRegistration();
  };

  const proceedWithRegistration = async () => {
    try {
      // Call real API - backend expects fullName, not firstName/lastName
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const response = await authService.register({
        fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      } as any);

      // Handle backend response format
      const token = (response as any).accessToken || (response as any).token;
      const refreshToken = (response as any).refreshToken;
      const user = (response as any).user || response;
      
      // Parse fullName into firstName and lastName
      let firstName = user.firstName || formData.firstName;
      let lastName = user.lastName || formData.lastName;
      if (!firstName && !lastName && user.fullName) {
        const nameParts = user.fullName.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      // Create normalized user object
      const normalizedUser = {
        id: user.id,
        email: user.email,
        firstName,
        lastName,
        phone: user.phone,
        avatarUrl: user.avatarUrl || user.avatar_url,
        emailVerified: user.emailVerified || user.isVerified || false,
        createdAt: user.createdAt || user.created_at,
        updatedAt: user.updatedAt || user.updated_at,
      };

      // Store tokens securely
      await SecureStorageService.setAuthToken(token);
      await SecureStorageService.setRefreshToken(refreshToken);
      await SecureStorageService.setUserSession({
        id: normalizedUser.id,
        email: normalizedUser.email,
        name: `${normalizedUser.firstName} ${normalizedUser.lastName}`.trim() || normalizedUser.email,
        token,
      });

      // Update auth store
      const {setAuth} = useAuthStore.getState();
      setAuth(normalizedUser as any, token, refreshToken);

      // Show success message and navigate
      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Main'),
          },
        ]
      );
    } catch (error: any) {
      let errorMessage = 'Registration failed. Please try again.';
      
      // Provide more helpful error messages
      if (error?.code === 'NETWORK_ERROR' || error?.code === 'TIMEOUT_ERROR' || error?.status === 0) {
        const config = await import('../../config/env');
        const apiUrl = config.default.API_BASE_URL;
        errorMessage = 'Cannot connect to server. Please check:\n\n' +
          '• Backend server is running (port 5166)\n' +
          '• You are connected to the internet\n' +
          `• Current API URL: ${apiUrl}\n` +
          '• Firewall allows port 5166';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Registration Error', errorMessage);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={[colors.primary[50], colors.secondary[50]]}
        style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Logo size={80} />
            </View>
            <Text style={styles.title}>EsusuHub</Text>
            <Text style={styles.subtitle}>Create Your Account</Text>
          </View>

          <Card style={styles.card}>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  label="First Name"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChangeText={text =>
                    setFormData({...formData, firstName: text})
                  }
                  leftIcon="account-outline"
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label="Last Name"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChangeText={text =>
                    setFormData({...formData, lastName: text})
                  }
                  leftIcon="account-outline"
                />
              </View>
            </View>

            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={text => setFormData({...formData, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email-outline"
            />

            <Input
              label="Phone Number"
              placeholder="+234 xxx xxx xxxx"
              value={formData.phone}
              onChangeText={text => setFormData({...formData, phone: text})}
              keyboardType="phone-pad"
              leftIcon="phone-outline"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={text => setFormData({...formData, password: text})}
              secureTextEntry={!showPassword}
              leftIcon="lock-outline"
              rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={text =>
                setFormData({...formData, confirmPassword: text})
              }
              secureTextEntry={!showConfirmPassword}
              leftIcon="lock-outline"
              rightIcon={
                showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
              }
              onRightIconPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />

            <View style={styles.termsContainer}>
              <Icon
                name={acceptTerms ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={acceptTerms ? colors.primary[600] : colors.gray[400]}
                onPress={() => setAcceptTerms(!acceptTerms)}
                style={styles.checkbox}
              />
              <Text style={styles.termsText}>
                I accept the{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
          </Card>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}>
                Sign in
              </Text>
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  card: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkbox: {
    marginRight: spacing.sm,
  },
  termsText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  termsLink: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
  },
  registerButton: {
    marginTop: spacing.sm,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  loginLink: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
  },
});

