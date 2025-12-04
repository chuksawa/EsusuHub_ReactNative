/**
 * EsusuHub React Native App
 * Main entry point for the application
 */

import React from 'react';
import {StatusBar, Platform} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto'; // Required for Supabase

import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import OfflineIndicator from './src/components/OfflineIndicator';
import {colors} from './src/theme/colors';
import {offlineService} from './src/services/offline/offlineService';
import {pushNotificationService} from './src/services/notifications/pushNotificationService';

const App: React.FC = () => {
  React.useEffect(() => {
    // Global error handler to prevent crashes
    const errorHandler = (error: Error, isFatal?: boolean) => {
      // Log error but don't crash the app
      if (__DEV__) {
        console.error('Global error handler:', error, 'isFatal:', isFatal);
      }
      // In production, you might want to log to a service like Sentry
    };

    // Set up global error handlers using ErrorUtils (React Native)
    if (typeof ErrorUtils !== 'undefined') {
      const originalHandler = ErrorUtils.getGlobalHandler();
      ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
        errorHandler(error, isFatal);
        // Still call original handler but don't let it crash
        try {
          if (originalHandler) {
            originalHandler(error, isFatal);
          }
        } catch (e) {
          // Silently catch any errors from original handler
        }
      });
    }

    // Initialize services asynchronously to prevent blocking app registration
    (async () => {
      try {
        // Initialize offline service
        await offlineService.initialize();
      } catch (error) {
        console.warn('Failed to initialize offline service:', error);
      }
      
      try {
        // Initialize push notifications
        await pushNotificationService.initialize();
      } catch (error) {
        console.warn('Failed to initialize push notifications:', error);
      }
    })();

    // Cleanup
    return () => {
      // Restore original handlers if needed
    };
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{flex: 1}}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
          backgroundColor={colors.primary[600]}
        />
        <OfflineIndicator />
        <AppNavigator />
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default App;

