/**
 * Memory Manager
 * Monitors and manages app memory usage
 */

import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {logger} from './logger';

interface MemoryInfo {
  used: number;
  total: number;
  percentage: number;
}

class MemoryManager {
  private memoryThreshold = 0.8; // 80% memory usage threshold
  private checkInterval: NodeJS.Timeout | null = null;

  /**
   * Start memory monitoring
   */
  startMonitoring(intervalMs: number = 30000): void {
    if (this.checkInterval) {
      return;
    }

    this.checkInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, intervalMs);

    logger.info('Memory monitoring started');
  }

  /**
   * Stop memory monitoring
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      logger.info('Memory monitoring stopped');
    }
  }

  /**
   * Check current memory usage
   */
  async checkMemoryUsage(): Promise<MemoryInfo | null> {
    try {
      if (Platform.OS === 'android') {
        // Android memory info
        const memInfo = await DeviceInfo.getTotalMemory();
        // Note: getUsedMemory is not available in react-native-device-info
        // This is a placeholder - in production, you might need a native module
        logger.debug('Memory check', {total: memInfo});
      } else {
        // iOS memory info
        // Note: iOS memory info requires native module
        logger.debug('Memory check (iOS)');
      }
    } catch (error) {
      logger.error('Error checking memory usage', error);
    }

    return null;
  }

  /**
   * Clear caches to free memory
   */
  async clearCaches(): Promise<void> {
    try {
      const {cacheService} = await import('../services/cache/cacheService');
      await cacheService.clearExpired();
      logger.info('Caches cleared to free memory');
    } catch (error) {
      logger.error('Error clearing caches', error);
    }
  }

  /**
   * Check if memory usage is high
   */
  async isMemoryHigh(): Promise<boolean> {
    const memInfo = await this.checkMemoryUsage();
    if (!memInfo) {
      return false;
    }

    return memInfo.percentage > this.memoryThreshold;
  }

  /**
   * Set memory threshold
   */
  setThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new Error('Memory threshold must be between 0 and 1');
    }
    this.memoryThreshold = threshold;
  }
}

export const memoryManager = new MemoryManager();

