"use client";
import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const isMounted = useRef(false);
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (e) {
      console.log(e);
    }
    isMounted.current = true;
  }, [key]);

  useEffect(() => {
    if (isMounted.current) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  const remove = () => {
    window.localStorage.removeItem(key);
    setValue(defaultValue); // Optionally reset state
  };

  return [value, setValue, remove];
}

