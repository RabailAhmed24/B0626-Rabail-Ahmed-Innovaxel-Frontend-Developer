import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  // Check memory to see if data already exists, otherwise use initial value
  const [value, setValue] = useState(() => {
    try {
      const localValue = window.localStorage.getItem(key);
      return localValue ? JSON.parse(localValue) : initialValue;
    } catch (error) {
      console.error("LocalStorage read error: ", error);
      return initialValue;
    }
  });

  // Whenever value changes, sync it to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("LocalStorage write error: ", error);
    }
  }, [key, value]);

  return [value, setValue];
}