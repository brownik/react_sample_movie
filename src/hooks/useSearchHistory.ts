import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, MAX_SEARCH_HISTORY } from '../constants/app';

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setHistory((prev) => {
      // 중복 제거 및 최신순으로 정렬
      const filtered = prev.filter((term) => term.toLowerCase() !== searchTerm.toLowerCase());
      const updated = [searchTerm, ...filtered].slice(0, MAX_SEARCH_HISTORY);
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((searchTerm: string) => {
    setHistory((prev) => prev.filter((term) => term !== searchTerm));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}

