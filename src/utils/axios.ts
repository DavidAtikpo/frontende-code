import axios from 'axios';
import { API_CONFIG } from './config';
import { redirectToLogin } from './auth';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
});

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    // Ajouter le token aux headers si disponible
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Si le token est expiré (401) ou invalide (403)
      if (error.response.status === 401 || error.response.status === 403) {
        // Essayer d'utiliser le refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const response = await axios.post(`${API_CONFIG.BASE_URL}/api/auth/refresh-token`, {
              refreshToken
            });
            
            if (response.data.success) {
              // Mettre à jour les tokens
              localStorage.setItem('token', response.data.accessToken);
              localStorage.setItem('refreshToken', response.data.refreshToken);
              
              // Réessayer la requête originale
              const config = error.config;
              config.headers.Authorization = `Bearer ${response.data.accessToken}`;
              return axios(config);
            }
          } catch (refreshError) {
            // Si le refresh token échoue, rediriger vers login
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
            
            // Sauvegarder l'URL actuelle avant la redirection
            const currentPath = window.location.pathname;
            redirectToLogin(currentPath);
          }
        } else {
          // Pas de refresh token, rediriger vers login
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          
          const currentPath = window.location.pathname;
          redirectToLogin(currentPath);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 