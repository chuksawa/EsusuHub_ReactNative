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
    // Initialize offline service
    offlineService.initialize();
    
    // Initialize push notifications
    pushNotificationService.initialize();
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

