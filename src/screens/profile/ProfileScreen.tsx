import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
  },
});

