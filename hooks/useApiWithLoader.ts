'use client';

import { useLoading } from '@/contexts/LoadingContext';
import {  ApiResponse } from '@/lib/api';
import { useCallback } from 'react';

/**
 * Hook that wraps API calls with automatic loading state management
 * Usage: const { callWithLoader } = useApiWithLoader();
 * await callWithLoader(() => apiClient.getProducts());
 */
export function useApiWithLoader() {
  const { showLoader, hideLoader } = useLoading();

  const callWithLoader = useCallback(
    async <T,>(apiCall: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> => {
      try {
        showLoader();
        const response = await apiCall();
        return response;
      } finally {
        hideLoader();
      }
    },
    [showLoader, hideLoader]
  );

  return { callWithLoader, showLoader, hideLoader };
}

