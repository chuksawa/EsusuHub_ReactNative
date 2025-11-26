import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Card from '../../components/Card';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

export default function GroupsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Card>
          <Text style={styles.title}>My Groups</Text>
          <Text style={styles.subtitle}>Groups screen - Coming soon</Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
});

