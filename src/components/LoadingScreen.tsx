/**
 * Loading Screen Component
 * Shows a loading indicator while checking authentication
 */

import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import Logo from './Logo';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Logo size={200} />
      <ActivityIndicator 
        size="large" 
        color={colors.primary[600]} 
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
  loader: {
    marginTop: spacing.lg,
  },
});

