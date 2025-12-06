/**
 * Avatar Component
 * Displays user avatar with fallback
 */

import React from 'react';
import {View, Image, StyleSheet, ViewStyle, ImageStyle, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../theme/colors';
import config from '../config/env';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: ViewStyle | ImageStyle;
}

// Helper to convert relative URLs to full URLs
const getFullUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url; // Already a full URL
  }
  // Convert relative path to full URL
  const baseUrl = config.API_BASE_URL.replace('/api', ''); // Remove /api to get base server URL
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function Avatar({uri, name, size = 40, style}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  
  // Convert relative URL to full URL if needed
  const fullUri = React.useMemo(() => getFullUrl(uri), [uri]);

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
  if (fullUri && !imageError && fullUri.trim() !== '') {
    return (
      <Image
        source={{uri: fullUri}}
        style={[{width: size, height: size, borderRadius: size / 2}, style]}
        resizeMode="cover"
        onError={() => {
          console.warn('Avatar image failed to load:', fullUri);
          setImageError(true);
        }}
      />
    );
  }

  // Fallback to initials or icon - always render something
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
          overflow: 'hidden', // Ensure content stays within bounds
        },
        style,
      ]}>
      {initials ? (
        <Text
          style={{
            color: colors.text.white,
            fontSize: size * 0.4,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          {initials}
        </Text>
      ) : (
        <Icon 
          name="account-circle" 
          size={size * 0.8} 
          color={colors.text.white}
          style={{opacity: 1}} // Ensure icon is visible
        />
      )}
    </View>
  );
}

