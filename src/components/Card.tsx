import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../theme/colors';
import {spacing, borderRadius} from '../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({
  children,
  style,
  variant = 'default',
}: CardProps) {
  return (
    <View style={[styles.card, styles[variant], style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.text.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  default: {
    shadowColor: colors.gray[900],
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  elevated: {
    shadowColor: colors.gray[900],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    shadowOpacity: 0,
    elevation: 0,
  },
});

