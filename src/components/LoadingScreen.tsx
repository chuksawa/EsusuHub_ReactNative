/**
 * Loading Screen Component
 * Shows a loading indicator while checking authentication
 */

import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {colors} from '../theme/colors';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary[600]} />
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
});

