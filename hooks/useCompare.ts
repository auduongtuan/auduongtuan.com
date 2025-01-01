import { useEffect, useRef } from "react";

// Desired hook
export function useCompare(val) {
  const prevVal = usePrevious(val);
  return prevVal !== val;
}

// Helper hook
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
