/**
 * Performance Monitor
 * Tracks and logs performance metrics
 */

import {logger} from './logger';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000;
  private timers: Map<string, number> = new Map();

  /**
   * Start a performance timer
   */
  start(name: string): void {
    this.timers.set(name, Date.now());
  }

  /**
   * End a performance timer and record metric
   */
  end(name: string, metadata?: Record<string, any>): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      logger.warn(`Performance timer "${name}" was not started`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.recordMetric(name, duration, metadata);
    this.timers.delete(name);

    if (__DEV__) {
      logger.debug(`Performance: ${name} took ${duration}ms`, metadata);
    }

    return duration;
  }

  /**
   * Record a performance metric
   */
  recordMetric(
    name: string,
    duration: number,
    metadata?: Record<string, any>
  ): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);

    // Keep only the last maxMetrics entries
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log slow operations
    if (duration > 1000) {
      logger.warn(`Slow operation detected: ${name} took ${duration}ms`, metadata);
    }
  }

  /**
   * Measure async function execution time
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      this.end(name, metadata);
      return result;
    } catch (error) {
      this.end(name, {...metadata, error: true});
      throw error;
    }
  }

  /**
   * Measure sync function execution time
   */
  measureSync<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    this.start(name);
    try {
      const result = fn();
      this.end(name, metadata);
      return result;
    } catch (error) {
      this.end(name, {...metadata, error: true});
      throw error;
    }
  }

  /**
   * Get metrics for a specific operation
   */
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(m => m.name === name);
    }
    return [...this.metrics];
  }

  /**
   * Get average duration for an operation
   */
  getAverageDuration(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) {
      return 0;
    }

    const total = metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / metrics.length;
  }

  /**
   * Get slowest operations
   */
  getSlowestOperations(limit: number = 10): PerformanceMetric[] {
    return [...this.metrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.timers.clear();
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    totalMetrics: number;
    averageDuration: number;
    slowestOperations: PerformanceMetric[];
  } {
    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const averageDuration =
      this.metrics.length > 0 ? totalDuration / this.metrics.length : 0;

    return {
      totalMetrics: this.metrics.length,
      averageDuration,
      slowestOperations: this.getSlowestOperations(10),
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();

