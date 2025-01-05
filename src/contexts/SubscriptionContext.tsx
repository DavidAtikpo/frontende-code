import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';

type SubscriptionStatus = 'active' | 'inactive' | 'loading';

interface SubscriptionContextType {
  status: SubscriptionStatus;
  checkStatus: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SubscriptionStatus>('loading');

  const checkStatus = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/seller/subscription/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      const data = await response.json();
      setStatus(data.status);
    } catch (error) {
      console.error('Erreur vérification abonnement:', error);
      setStatus('inactive');
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <SubscriptionContext.Provider value={{ status, checkStatus }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}; 