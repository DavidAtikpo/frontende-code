export const CookieService = {
    enableCookies: () => {
      // Activer les différents types de cookies
      enableAnalyticsCookies();
      enablePreferenceCookies();
      enableMarketingCookies();
    },
  
    disableCookies: () => {
      // Désactiver tous les cookies non essentiels
      disableAnalyticsCookies();
      disablePreferenceCookies();
      disableMarketingCookies();
    },
  
    // Fonction pour vérifier le consentement
    hasConsent: () => {
      return localStorage.getItem('cookieConsent') === 'accepted';
    },
  
    // Fonction pour définir un cookie
    setCookie: (name, value, days) => {
      if (!CookieService.hasConsent()) return;
  
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
  
    // Fonction pour récupérer un cookie
    getCookie: (name) => {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
  
    // Fonction pour supprimer un cookie
    deleteCookie: (name) => {
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    }
  };
  
  // Fonctions auxiliaires pour activer/désactiver différents types de cookies
  function enableAnalyticsCookies() {
    // Implémenter l'activation des cookies analytics (Google Analytics, etc.)
  }
  
  function enablePreferenceCookies() {
    // Implémenter l'activation des cookies de préférences
  }
  
  function enableMarketingCookies() {
    // Implémenter l'activation des cookies marketing
  }
  
  function disableAnalyticsCookies() {
    // Implémenter la désactivation des cookies analytics
  }
  
  function disablePreferenceCookies() {
    // Implémenter la désactivation des cookies de préférences
  }
  
  function disableMarketingCookies() {
    // Implémenter la désactivation des cookies marketing
  }