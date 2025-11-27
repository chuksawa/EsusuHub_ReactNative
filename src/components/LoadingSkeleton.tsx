/**
 * Loading Skeleton Component
 * Shows skeleton placeholders while content is loading
 */

import React from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

function Skeleton({width = '100%', height = 20, borderRadius = 4, style}: SkeletonProps) {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.gray[300],
          opacity,
        },
        style,
      ]}
    />
  );
}

export default Skeleton;

/**
 * Card Skeleton
 */
export function CardSkeleton() {
  return (
    <View style={skeletonStyles.card}>
      <Skeleton width="60%" height={20} style={skeletonStyles.title} />
      <Skeleton width="100%" height={16} style={skeletonStyles.line} />
      <Skeleton width="80%" height={16} style={skeletonStyles.line} />
    </View>
  );
}

/**
 * List Item Skeleton
 */
export function ListItemSkeleton() {
  return (
    <View style={skeletonStyles.listItem}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={skeletonStyles.listItemContent}>
        <Skeleton width="60%" height={16} style={skeletonStyles.listItemTitle} />
        <Skeleton width="40%" height={14} style={skeletonStyles.listItemSubtitle} />
      </View>
      <Skeleton width={60} height={16} />
    </View>
  );
}

/**
 * Group Card Skeleton
 */
export function GroupCardSkeleton() {
  return (
    <View style={skeletonStyles.groupCard}>
      <View style={skeletonStyles.groupHeader}>
        <View style={skeletonStyles.groupInfo}>
          <Skeleton width="70%" height={20} style={skeletonStyles.groupTitle} />
          <Skeleton width="90%" height={14} style={skeletonStyles.groupDescription} />
        </View>
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
      <View style={skeletonStyles.groupStats}>
        <Skeleton width="30%" height={16} />
        <Skeleton width="30%" height={16} />
        <Skeleton width="30%" height={16} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.text.white,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
  line: {
    marginBottom: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  listItemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  listItemTitle: {
    marginBottom: spacing.xs,
  },
  listItemSubtitle: {
    marginTop: spacing.xs,
  },
  groupCard: {
    backgroundColor: colors.text.white,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  groupInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  groupTitle: {
    marginBottom: spacing.xs,
  },
  groupDescription: {
    marginTop: spacing.xs,
  },
  groupStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
});

