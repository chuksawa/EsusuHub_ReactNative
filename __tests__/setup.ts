/**
 * Jest Setup File
 * Global test configuration and mocks
 */

import '@testing-library/jest-native/extend-expect';

// Mock React Native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() =>
    Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
    })
  ),
  addEventListener: jest.fn(() => jest.fn()),
}));

// Mock SecureKeyStore
jest.mock('react-native-secure-key-store', () => ({
  set: jest.fn(() => Promise.resolve()),
  get: jest.fn(() => Promise.resolve(null)),
  remove: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-config
jest.mock('react-native-config', () => ({
  API_BASE_URL: 'http://localhost:5166/api',
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  STRIPE_PUBLISHABLE_KEY: '',
  NODE_ENV: 'test',
}));

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock react-native-linear-gradient
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// Mock react-native-image-picker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn((options, callback) => {
    callback({
      didCancel: false,
      assets: [
        {
          uri: 'file://test-image.jpg',
          type: 'image/jpeg',
          fileName: 'test-image.jpg',
        },
      ],
    });
  }),
  launchCamera: jest.fn(),
}));

// Mock Stripe
jest.mock('@stripe/stripe-react-native', () => ({
  StripeProvider: ({children}: any) => children,
  useStripe: () => ({
    initPaymentSheet: jest.fn(() => Promise.resolve({error: null})),
    presentPaymentSheet: jest.fn(() => Promise.resolve({error: null})),
  }),
}));

// Mock react-native-url-polyfill
jest.mock('react-native-url-polyfill/auto', () => {});

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Set up global test timeout
jest.setTimeout(10000);

