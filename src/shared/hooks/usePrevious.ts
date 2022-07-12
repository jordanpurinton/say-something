import { useRef, useEffect } from 'react';

// https://usehooks.com/usePrevious/
export const usePrevious = <T>(value: T): T => {
  const ref: any = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
