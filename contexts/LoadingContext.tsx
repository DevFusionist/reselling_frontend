'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { LoaderManager } from '@/lib/loader-manager';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  // Register the loader manager on mount
  useEffect(() => {
    LoaderManager.register(setIsLoading);
    return () => {
      LoaderManager.unregister();
    };
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const showLoader = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

