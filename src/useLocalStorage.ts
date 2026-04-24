import { useEffect, useRef, useState } from 'react';

const STORAGE_PREFIX = 'stock-sim:';

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const storageKey = STORAGE_PREFIX + key;

  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    }
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw !== null) {
        return JSON.parse(raw) as T;
      }
    } catch {
      // ignore parse/access errors and fall back to initial
    }
    return typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue;
  });

  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // storage may be full or disabled; silently ignore
    }
  }, [storageKey, value]);

  return [value, setValue];
}

export function clearLocalStorageKeys(keys: string[]) {
  for (const k of keys) {
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + k);
    } catch {
      // ignore
    }
  }
}
