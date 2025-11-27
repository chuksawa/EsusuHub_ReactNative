/**
 * Error Display Component
 * Displays user-friendly error messages
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import Button from './Button';
import {ApiError} from '../types/api';

interface ErrorDisplayProps {
  error: Error | ApiError | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  title?: string;
  showRetry?: boolean;
  style?: any;
}

export default function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  title = 'Error',
  showRetry = true,
  style,
}: ErrorDisplayProps) {
  if (!error) {
    return null;
  }

  const getErrorMessage = (): string => {
    if (typeof error === 'string') {
      return error;
    }
    if ('message' in error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  const getErrorCode = (): string | undefined => {
    if (typeof error === 'object' && 'code' in error) {
      return error.code;
    }
    return undefined;
  };

  const getErrorStatus = (): number | undefined => {
    if (typeof error === 'object' && 'status' in error) {
      return error.status;
    }
    return undefined;
  };

  const errorMessage = getErrorMessage();
  const errorCode = getErrorCode();
  const errorStatus = getErrorStatus();

  // Network error
  if (errorCode === 'NETWORK_ERROR' || errorStatus === 0) {
    return (
      <View style={[styles.container, style]}>
        <Icon name="wifi-off" size={48} color={colors.error} />
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.message}>
          Please check your internet connection and try again.
        </Text>
        {showRetry && onRetry && (
          <Button
            title="Retry"
            onPress={onRetry}
            style={styles.button}
            size="small"
          />
        )}
        {onDismiss && (
          <Button
            title="Dismiss"
            onPress={onDismiss}
            variant="outline"
            style={styles.button}
            size="small"
          />
        )}
      </View>
    );
  }

  // 401 Unauthorized
  if (errorStatus === 401) {
    return (
      <View style={[styles.container, style]}>
        <Icon name="lock-alert" size={48} color={colors.error} />
        <Text style={styles.title}>Authentication Required</Text>
        <Text style={styles.message}>
          Your session has expired. Please log in again.
        </Text>
        {showRetry && onRetry && (
          <Button
            title="Retry"
            onPress={onRetry}
            style={styles.button}
            size="small"
          />
        )}
      </View>
    );
  }

  // 403 Forbidden
  if (errorStatus === 403) {
    return (
      <View style={[styles.container, style]}>
        <Icon name="shield-alert" size={48} color={colors.error} />
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.message}>
          You don't have permission to perform this action.
        </Text>
      </View>
    );
  }

  // 404 Not Found
  if (errorStatus === 404) {
    return (
      <View style={[styles.container, style]}>
        <Icon name="file-question" size={48} color={colors.error} />
        <Text style={styles.title}>Not Found</Text>
        <Text style={styles.message}>
          The requested resource could not be found.
        </Text>
        {showRetry && onRetry && (
          <Button
            title="Retry"
            onPress={onRetry}
            style={styles.button}
            size="small"
          />
        )}
      </View>
    );
  }

  // 500 Server Error
  if (errorStatus === 500 || errorStatus === 502 || errorStatus === 503) {
    return (
      <View style={[styles.container, style]}>
        <Icon name="server-network-off" size={48} color={colors.error} />
        <Text style={styles.title}>Server Error</Text>
        <Text style={styles.message}>
          Our servers are experiencing issues. Please try again later.
        </Text>
        {showRetry && onRetry && (
          <Button
            title="Retry"
            onPress={onRetry}
            style={styles.button}
            size="small"
          />
        )}
      </View>
    );
  }

  // Generic error
  return (
    <View style={[styles.container, style]}>
      <Icon name="alert-circle" size={48} color={colors.error} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{errorMessage}</Text>
      {showRetry && onRetry && (
        <Button
          title="Retry"
          onPress={onRetry}
          style={styles.button}
          size="small"
        />
      )}
      {onDismiss && (
        <Button
          title="Dismiss"
          onPress={onDismiss}
          variant="outline"
          style={styles.button}
          size="small"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.error + '10',
    borderRadius: spacing.md,
    margin: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.sm,
    minWidth: 120,
  },
});

