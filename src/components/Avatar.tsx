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
    if (!nameStr || nameStr.trim() === '') return '';
    const parts = nameStr.trim().split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (parts.length === 1) {
      return parts[0][0]?.toUpperCase() || '';
    }
    return '';
  };

  const initials = getInitials(name);

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
      {initials ? (
        <Text
          style={{
            color: colors.text.white,
            fontSize: size * 0.4,
            fontWeight: 'bold',
          }}>
          {initials}
        </Text>
      ) : (
        <Icon name="account-circle" size={size * 0.8} color={colors.text.white} />
      )}
    </View>
  );
}

