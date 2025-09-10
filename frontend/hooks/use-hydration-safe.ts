import { useState, useEffect } from 'react';

export function useHydrationSafe<T>(initialValue: T): [T, (value: T) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return [value, setValue, mounted];
}

export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}