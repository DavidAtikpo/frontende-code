const isDevelopment = process.env.NODE_ENV === 'development';

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  API_PATH: '/api',
  HEADERS: {
    'Content-Type': 'application/json',
    'Authorization': ''
  },
  FETCH_OPTIONS: {
    credentials: 'include' as RequestCredentials,
    mode: 'cors' as RequestMode
  },
  getFullUrl: (endpoint: string) => `${API_CONFIG.BASE_URL}${API_CONFIG.API_PATH}${endpoint}`
};

export const getApiConfig = () => {
  return {
    apiUrl: API_CONFIG.BASE_URL,
    headers: API_CONFIG.HEADERS
  };
}; 