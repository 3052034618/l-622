import { useEffect, useRef, useCallback } from 'react';

interface UseRealtimeOptions {
  interval?: number;
  enabled?: boolean;
  onRefresh?: () => Promise<void> | void;
}

export function useRealtime(options: UseRealtimeOptions = {}) {
  const { interval = 10000, enabled = true, onRefresh } = options;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);

  const refresh = useCallback(async () => {
    if (isRunningRef.current || !onRefresh) return;
    
    isRunningRef.current = true;
    try {
      await onRefresh();
    } finally {
      isRunningRef.current = false;
    }
  }, [onRefresh]);

  const start = useCallback(() => {
    if (!enabled || !onRefresh) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    refresh();
    intervalRef.current = setInterval(refresh, interval);
  }, [enabled, interval, onRefresh, refresh]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }

    return () => {
      stop();
    };
  }, [enabled, start, stop]);

  return {
    refresh,
    start,
    stop,
    isRunning: isRunningRef.current,
  };
}
