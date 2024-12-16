import { API_CONFIG } from './config';

export const getApiUrl = () => API_CONFIG.BASE_URL;

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(API_CONFIG.getFullUrl(endpoint), {
      headers: API_CONFIG.HEADERS
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  post: async <T>(endpoint: string, data: Record<string, unknown>): Promise<T> => {
    const response = await fetch(API_CONFIG.getFullUrl(endpoint), {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }
}; 