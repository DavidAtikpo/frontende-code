import { useState } from 'react';
import { api } from '@/utils/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async <R>(method: 'get' | 'post', endpoint: string, data?: Record<string, unknown>): Promise<R> => {
    try {
      setLoading(true);
      setError(null);
      if (method === 'post' && data) {
        return await api.post<R>(endpoint, data);
      }
      return await api.get(endpoint);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, request };
}; 