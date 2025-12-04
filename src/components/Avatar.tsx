/**
 * Avatar Component
 * Displays user avatar with fallback
 */

import React from 'react';
import {View, Image, StyleSheet, ViewStyle, ImageStyle, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../theme/colors';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: ViewStyle | ImageStyle;
}

export default function Avatar({uri, name, size = 40, style}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  // Get initials from name
  const getInitials = (nameStr?: string): string => {
    if (!nameStr) return '?';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr[0]?.toUpperCase() || '?';
  };

  // Use image if available and no error
  if (uri && !imageError) {
    return (
      <Image
        source={{uri}}
        style={[{width: size, height: size, borderRadius: size / 2}, style]}
        resizeMode="cover"
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback to initials or icon
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary[500],
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}>
      {name ? (
        <Text
          style={{
            color: colors.text.white,
            fontSize: size * 0.4,
            fontWeight: 'bold',
          }}>
          {getInitials(name)}
        </Text>
      ) : (
        <Icon name="account" size={size * 0.6} color={colors.text.white} />
      )}
    </View>
  );
}

