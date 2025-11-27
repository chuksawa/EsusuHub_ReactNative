/**
 * Cache Service Tests
 */

import {cacheService} from '../../src/services/cache/cacheService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('CacheService', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe('set and get', () => {
    it('should set and get cache entry', async () => {
      const testData = {name: 'Test', value: 123};
      await cacheService.set('test-key', testData, 60000);

      const result = await cacheService.get('test-key');
      expect(result).toEqual(testData);
    });

    it('should return null for non-existent key', async () => {
      const result = await cacheService.get('non-existent');
      expect(result).toBeNull();
    });

    it('should return null for expired entry', async () => {
      const testData = {name: 'Test'};
      await cacheService.set('test-key', testData, 100); // 100ms TTL

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));

      const result = await cacheService.get('test-key');
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove cache entry', async () => {
      const testData = {name: 'Test'};
      await cacheService.set('test-key', testData);
      await cacheService.remove('test-key');

      const result = await cacheService.get('test-key');
      expect(result).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', async () => {
      await cacheService.set('key1', {data: 1});
      await cacheService.set('key2', {data: 2});
      await cacheService.clear();

      expect(await cacheService.get('key1')).toBeNull();
      expect(await cacheService.get('key2')).toBeNull();
    });
  });
});

