/**
 * Optimized Image Component
 * Provides image caching and optimization
 */

import React from 'react';
import {Image, ImageProps, StyleSheet, ActivityIndicator, View} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  placeholder?: React.ReactNode;
  fallback?: string;
  cache?: 'memory' | 'disk' | 'none';
}

export default function OptimizedImage({
  uri,
  placeholder,
  fallback,
  cache = 'memory',
  style,
  ...props
}: OptimizedImageProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [imageUri, setImageUri] = React.useState(uri);

  React.useEffect(() => {
    setImageUri(uri);
    setLoading(true);
    setError(false);
  }, [uri]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    if (fallback) {
      setImageUri(fallback);
    }
  };

  // Default placeholder
  const defaultPlaceholder = (
    <View style={[styles.placeholder, style]}>
      <ActivityIndicator size="small" color={colors.primary[600]} />
    </View>
  );

  if (error && !fallback) {
    return (
      <View style={[styles.errorContainer, style]}>
        {placeholder || defaultPlaceholder}
      </View>
    );
  }

  return (
    <View style={style}>
      {loading && (placeholder || defaultPlaceholder)}
      <Image
        {...props}
        source={{uri: imageUri, cache}}
        style={[style, loading && styles.hidden]}
        onLoad={handleLoad}
        onError={handleError}
        resizeMode={props.resizeMode || 'cover'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  hidden: {
    opacity: 0,
  },
  errorContainer: {
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
});

