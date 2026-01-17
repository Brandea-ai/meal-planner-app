'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';

function getServerSnapshot<T>(initialValue: T): T {
  return initialValue;
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [isLoaded, setIsLoaded] = useState(false);

  const subscribe = useCallback((callback: () => void) => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) {
        callback();
      }
    };
    window.addEventListener('storage', handleStorage);

    // Mark as loaded after first subscribe
    setTimeout(() => setIsLoaded(true), 0);

    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const storedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => getServerSnapshot(initialValue)
  );

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const currentValue = getSnapshot();
      const valueToStore = value instanceof Function ? value(currentValue) : value;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Trigger storage event for other tabs/components
        window.dispatchEvent(new StorageEvent('storage', { key }));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, getSnapshot]);

  return [storedValue, setValue, isLoaded];
}
