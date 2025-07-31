// src/hooks/use-local-storage.ts
"use client";

import { useState, useEffect, useCallback } from 'react';

function getValue<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    const storedValue = localStorage.getItem(key);
    try {
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
        console.error("Error parsing localStorage key '"+key+"':", error);
        return defaultValue;
    }
}


export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [value, setValue] = useState(() => getValue(key, defaultValue));

    const setStoredValue = useCallback((newValue: T | ((val: T) => T)) => {
        setValue(prevValue => {
            const valueToStore = newValue instanceof Function ? newValue(prevValue) : newValue;
            try {
                if (typeof window !== 'undefined') {
                    localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            } catch (error) {
                console.error(`Error setting localStorage key "${key}":`, error);
            }
            return valueToStore;
        });
    }, [key]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                try {
                    setValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error(`Error parsing storage event value for key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [value, setStoredValue];
}
