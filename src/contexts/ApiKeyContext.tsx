import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEYS, DEFAULT_API_KEY } from '../constants/app';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isConfigured: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.API_KEY);
    return stored || DEFAULT_API_KEY;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
  }, [apiKey]);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
  };

  const isConfigured = apiKey.trim().length > 0;

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, isConfigured }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}

