/**
 * Environment Configuration
 * Uses react-native-config for environment variables
 */

let Config: any = null;

try {
  Config = require('react-native-config').default || require('react-native-config');
} catch (error) {
  // react-native-config not available or not properly linked
  // This is expected - we'll use default values instead
  // Only log in dev mode for debugging
  if (__DEV__) {
    console.debug('react-native-config not available, using default configuration');
  }
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  try {
    // @ts-ignore - react-native-config types may not be available
    return (Config && Config[key]) || defaultValue || '';
  } catch (error) {
    return defaultValue || '';
  }
};

// Helper to get the API base URL with fallback
const getApiBaseUrl = (): string => {
  const envUrl = getEnvVar('API_BASE_URL');
  if (envUrl) return envUrl;
  
  if (__DEV__) {
    // Using localhost with ADB port forwarding (adb reverse tcp:5166 tcp:5166)
    // If this doesn't work, try: http://10.0.2.2:5166/api or http://10.0.0.187:5166/api
    return 'http://localhost:5166/api';
  }
  // Production: Azure App Service backend
  return 'https://esusuhubappserver-etaceafxd2h6gzdc.canadacentral-01.azurewebsites.net/api';
};

export const config = {
  // API Configuration
  // For Android emulator, try 10.0.2.2 first, fallback to your computer's IP
  // For physical device, use your computer's IP address (e.g., http://192.168.1.100:5166/api)
  // Your computer's IP: 10.0.0.187 (update if it changes)
  API_BASE_URL: getApiBaseUrl(),
  
  // Supabase Configuration
  SUPABASE_URL: getEnvVar('SUPABASE_URL', ''),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY', ''),
  
  // Stripe Configuration
  STRIPE_PUBLISHABLE_KEY: getEnvVar('STRIPE_PUBLISHABLE_KEY', ''),
  
  // Environment
  NODE_ENV: __DEV__ ? 'development' : 'production',
  
  // Feature Flags
  ENABLE_ANALYTICS: getEnvVar('ENABLE_ANALYTICS', 'false') === 'true',
  ENABLE_CRASH_REPORTING: getEnvVar('ENABLE_CRASH_REPORTING', 'false') === 'true',
};

export default config;

