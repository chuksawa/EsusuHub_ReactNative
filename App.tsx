/**
 * EsusuHub React Native App
 * Main entry point for the application
 */

import React from 'react';
import {StatusBar, Platform} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto'; // Required for Supabase

import AppNavigator from './src/navigation/AppNavigator';
import {colors} from './src/theme/colors';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.primary[600]}
      />
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;

