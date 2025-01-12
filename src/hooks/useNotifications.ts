import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '@/utils/config';
import { useAuth } from './useAuth';

const { BASE_URL } = API_CONFIG;

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/api/seller/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setNotifications(response.data.data.notifications || []);
        setUnreadCount(response.data.data.unreadCount || 0);
        setError(null);
      }
    } catch (err) {
      const error = err as AxiosError;
      let errorMessage = 'Impossible de charger les notifications';
      
      if (error.response?.status === 404) {
        errorMessage = 'Service de notifications non disponible';
      }
      
      console.error('Erreur:', errorMessage, error.message);
      setError(errorMessage);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const markAsRead = async (notificationId: string) => {
    if (!token) return;

    try {
      await axios.put(`${BASE_URL}/api/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      setError('Impossible de marquer la notification comme lue');
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;

    try {
      await axios.put(`${BASE_URL}/api/notifications/mark-all-read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
      setError('Impossible de marquer toutes les notifications comme lues');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}; 