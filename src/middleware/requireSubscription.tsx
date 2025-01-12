import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { toast } from 'react-hot-toast';
import { API_CONFIG } from '@/utils/config';

export function useRequireSubscription() {
  const router = useRouter();

  useEffect(() => {
    const checkSubscription = async () => {
      const token = getCookie('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/seller/subscription/status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await res.json();
        if (!data.success || !data.hasActiveSubscription) {
          toast.error("Un abonnement actif est requis pour accéder à cette page");
          router.push('/seller/subscription');
        }
      } catch (error) {
        console.error('Erreur vérification abonnement:', error);
        router.push('/seller/dashboard');
      }
    };

    checkSubscription();
  }, [router]);
}