/**
 * Logo Component
 * Displays the EsusuHub logo with fallback
 */

import React from 'react';
import {View, Image, StyleSheet, ViewStyle, ImageStyle, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

interface LogoProps {
  size?: number;
  style?: ViewStyle | ImageStyle;
  showText?: boolean;
}

export default function Logo({size = 48, style, showText = false}: LogoProps): React.ReactElement {
  const [imageError, setImageError] = React.useState(false);
  const logoUri = 'https://static.readdy.ai/image/c8fa67cf25818f8977dc6c7bfc4f6111/6aaef037c8e44e8eb9ec2616da6136a8.png';

  // Fallback to icon-based logo if image fails
  if (imageError || !logoUri) {
    return (
      <View style={[styles.iconContainer, {width: size, height: size}, style]}>
        <Icon name="wallet" size={size * 0.6} color={colors.primary[600]} />
        {showText && (
          <Text style={styles.logoText}>EH</Text>
        )}
      </View>
    );
  }

  return (
    <Image
      source={{uri: logoUri}}
      style={[{width: size, height: size}, style]}
      resizeMode="contain"
      onError={() => setImageError(true)}
    />
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary[200],
  },
  logoText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary[600],
    marginTop: 2,
  },
});

