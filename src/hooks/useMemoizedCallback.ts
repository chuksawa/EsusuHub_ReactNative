/**
 * useMemoizedCallback Hook
 * Memoized callback hook for performance optimization
 */

import {useCallback, useRef} from 'react';

/**
 * Memoized callback that only changes when dependencies change
 * Similar to useCallback but with better performance tracking
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  callbackRef.current = callback;

  return useCallback(
    ((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }) as T,
    deps
  );
}

/**
 * useStableCallback Hook
 * Returns a stable callback reference that never changes
 * Useful for passing to child components that are memoized
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = useRef(callback);

  // Always update to latest callback
  callbackRef.current = callback;

  const stableCallback = useCallback(
    ((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }) as T,
    [] // Empty deps - callback reference never changes
  );

  return stableCallback;
}

