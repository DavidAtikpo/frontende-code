import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/utils/config';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const { BASE_URL } = API_CONFIG;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  storeId?: string;
}

interface AuthHook {
  user: User | null;
  token: string | null;
  logout: () => Promise<void>;
  isSeller: boolean;
}

export function useAuth(): AuthHook {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isSeller, setIsSeller] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsSeller(userData.role === 'seller');
    }
  }, []);

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${BASE_URL}/api/user/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('refreshToken');
      deleteCookie('token');
      deleteCookie('refreshToken');
      setUser(null);
      setToken(null);
    }
  };

  return { token, user, logout, isSeller };
} 