import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/utils/config';

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
  logout: () => Promise<void>;
}

export function useAuth(): AuthHook {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/auth/me`);
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/logout`);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { user, logout };
} 