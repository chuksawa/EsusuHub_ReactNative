/**
 * usePerformance Hook
 * Hook for measuring component render performance
 */

import {useEffect, useRef} from 'react';
import {performanceMonitor} from '../utils/performanceMonitor';

export function usePerformance(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = Date.now() - mountTime.current;

    if (renderCount.current === 1) {
      // First render (mount)
      performanceMonitor.recordMetric(`${componentName}:mount`, renderTime);
    } else {
      // Subsequent renders (updates)
      performanceMonitor.recordMetric(`${componentName}:update`, renderTime, {
        renderCount: renderCount.current,
      });
    }

    mountTime.current = Date.now();
  });

  return {
    renderCount: renderCount.current,
  };
}

/**
 * useRenderTime Hook
 * Measures time between renders
 */
export function useRenderTime(componentName: string) {
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;

    if (lastRenderTime.current > 0) {
      performanceMonitor.recordMetric(`${componentName}:render-interval`, timeSinceLastRender);
    }

    lastRenderTime.current = now;
  });
}

