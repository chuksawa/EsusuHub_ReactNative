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
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {SecureStorageService} from '../../services/storage/secureStorage';
import {RootStackParamList} from '../../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Simulate login - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store user session
      await SecureStorageService.setUserSession({
        email,
        name: email.split('@')[0],
        token: 'mock_token_' + Date.now(),
      });

      // Navigate to main app
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
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
          {/* Logo and Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri: 'https://static.readdy.ai/image/c8fa67cf25818f8977dc6c7bfc4f6111/6aaef037c8e44e8eb9ec2616da6136a8.png',
                }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>EsusuHub</Text>
            <Text style={styles.subtitle}>Team up Cash up Climb up!</Text>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.description}>Sign in to your savings account</Text>
          </View>

          {/* Login Form */}
          <Card style={styles.card}>
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email-outline"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon="lock-outline"
              rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <View style={styles.forgotPasswordContainer}>
              <Text
                style={styles.forgotPassword}
                onPress={() => Alert.alert('Info', 'Forgot password feature coming soon')}>
                Forgot Password?
              </Text>
            </View>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login */}
            <Button
              title="Continue with Facebook"
              onPress={() => Alert.alert('Info', 'Facebook login coming soon')}
              variant="outline"
              style={styles.socialButton}
              icon={<Icon name="facebook" size={20} color={colors.blue[600]} style={{marginRight: spacing.sm}} />}
            />

            <Button
              title="Continue with Google"
              onPress={() => Alert.alert('Info', 'Google login coming soon')}
              variant="outline"
              style={styles.socialButton}
              icon={<Icon name="google" size={20} color={colors.error} style={{marginRight: spacing.sm}} />}
            />
          </Card>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text
                style={styles.registerLink}
                onPress={() => navigation.navigate('Register')}>
                Register here
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
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
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.blue[900],
    marginBottom: spacing.lg,
  },
  welcomeText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  card: {
    marginBottom: spacing.lg,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotPassword: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
  },
  loginButton: {
    marginBottom: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[200],
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  socialButton: {
    marginBottom: spacing.sm,
  },
  registerContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  registerText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  registerLink: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
  },
});

