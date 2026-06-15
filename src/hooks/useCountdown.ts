import { useState, useEffect, useCallback } from 'react';

interface UseCountdownOptions {
  onComplete?: () => void;
  autoStart?: boolean;
}

export function useCountdown(initialSeconds: number, options: UseCountdownOptions = {}) {
  const { onComplete, autoStart = true } = options;
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, seconds, onComplete]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newSeconds?: number) => {
    setSeconds(newSeconds ?? initialSeconds);
    setIsRunning(autoStart);
  }, [initialSeconds, autoStart]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return {
    seconds,
    minutes,
    secs,
    formatted,
    isRunning,
    isCompleted: seconds === 0,
    isUrgent: seconds <= 30,
    start,
    pause,
    reset,
  };
}
