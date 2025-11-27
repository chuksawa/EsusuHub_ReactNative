/**
 * Cache Service
 * Handles data caching for offline support
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {logger} from '../../utils/logger';

const CACHE_PREFIX = '@cache:';
const CACHE_EXPIRY_PREFIX = '@cache_expiry:';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheService {
  /**
   * Check if cache entry is expired
   */
  private isExpired(timestamp: number, ttl: number): boolean {
    return Date.now() - timestamp > ttl;
  }

  /**
   * Get cache key
   */
  private getCacheKey(key: string): string {
    return `${CACHE_PREFIX}${key}`;
  }

  /**
   * Get expiry key
   */
  private getExpiryKey(key: string): string {
    return `${CACHE_EXPIRY_PREFIX}${key}`;
  }

  /**
   * Set cache entry
   */
  async set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      await AsyncStorage.setItem(this.getCacheKey(key), JSON.stringify(entry));
      logger.debug(`Cache set: ${key}`);
    } catch (error) {
      logger.error('Error setting cache', error);
    }
  }

  /**
   * Get cache entry
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(this.getCacheKey(key));
      if (!cached) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(cached);

      // Check if expired
      if (this.isExpired(entry.timestamp, entry.ttl)) {
        await this.remove(key);
        logger.debug(`Cache expired: ${key}`);
        return null;
      }

      logger.debug(`Cache hit: ${key}`);
      return entry.data;
    } catch (error) {
      logger.error('Error getting cache', error);
      return null;
    }
  }

  /**
   * Remove cache entry
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.getCacheKey(key));
      await AsyncStorage.removeItem(this.getExpiryKey(key));
      logger.debug(`Cache removed: ${key}`);
    } catch (error) {
      logger.error('Error removing cache', error);
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key =>
        key.startsWith(CACHE_PREFIX) || key.startsWith(CACHE_EXPIRY_PREFIX)
      );
      await AsyncStorage.multiRemove(cacheKeys);
      logger.info('Cache cleared');
    } catch (error) {
      logger.error('Error clearing cache', error);
    }
  }

  /**
   * Clear expired cache entries
   */
  async clearExpired(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));

      for (const key of cacheKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          const entry: CacheEntry<any> = JSON.parse(cached);
          if (this.isExpired(entry.timestamp, entry.ttl)) {
            const originalKey = key.replace(CACHE_PREFIX, '');
            await this.remove(originalKey);
          }
        }
      }

      logger.info('Expired cache entries cleared');
    } catch (error) {
      logger.error('Error clearing expired cache', error);
    }
  }
}

export const cacheService = new CacheService();

