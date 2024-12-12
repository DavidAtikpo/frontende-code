import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface GtagConsent {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
}

interface GtagWindow extends Window {
  gtag?: (
    command: string,
    action: string,
    config: GtagConsent
  ) => void;
}

const enableCookies = () => {
  // Activer les cookies analytiques, marketing, etc.
  ((window as GtagWindow).gtag)?.('consent', 'update', {
    'analytics_storage': 'granted',
    'ad_storage': 'granted'
  });
};

const disableCookies = () => {
  // Désactiver les cookies non essentiels
  ((window as GtagWindow).gtag)?.('consent', 'update', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied'
  });
};

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    // Sauvegarder le consentement
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    // Activer les cookies ici
    enableCookies();
  };

  const refuseCookies = () => {
    localStorage.setItem('cookieConsent', 'refused');
    setIsVisible(false);
    // Désactiver les cookies non essentiels
    disableCookies();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50">
      <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <h3 className="font-bold mb-2">🍪 Nous utilisons des cookies</h3>
          <p>
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
            Ils nous aident à comprendre comment vous interagissez avec notre site 
            et nous permettent de l&apos;améliorer.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={refuseCookies}
          >
            Refuser
          </Button>
          <Button 
            onClick={acceptCookies}
          >
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
}