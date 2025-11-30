/**
 * Environment Configuration
 * Uses react-native-config for environment variables
 */

let Config: any = null;

try {
  Config = require('react-native-config').default || require('react-native-config');
} catch (error) {
  // react-native-config not available or not properly linked
  console.warn('react-native-config not available, using defaults');
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  try {
    // @ts-ignore - react-native-config types may not be available
    return (Config && Config[key]) || defaultValue || '';
  } catch (error) {
    return defaultValue || '';
  }
};

export const config = {
  // API Configuration
  API_BASE_URL: getEnvVar('API_BASE_URL', __DEV__ 
    ? 'http://localhost:5166/api' 
    : 'https://api.esusuhub.com/api'),
  
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

