export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://dubon-server.onrender.com',
  API_PATH: '/api',
  HEADERS: {
    'Content-Type': 'application/json',
    'Authorization': typeof window !== 'undefined' 
      ? `Bearer ${localStorage.getItem('token')}` 
      : ''
  },
  getFullUrl: (endpoint: string) => {
    const base = API_CONFIG.BASE_URL;
    const path = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
    return `${base}${path}`;
  }
};

export const getApiConfig = () => {
  return {
    apiUrl: API_CONFIG.BASE_URL,
    headers: API_CONFIG.HEADERS
  };
}; 