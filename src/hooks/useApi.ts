import { useState } from 'react';
import { api } from '@/utils/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export const useApi = <T>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async <T>(method: 'get' | 'post', endpoint: string, data?: Record<string, unknown>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api[method](endpoint, data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, request };
}; 