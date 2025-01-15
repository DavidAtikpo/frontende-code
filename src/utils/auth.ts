// Fonction pour sauvegarder l'URL de redirection
export const saveRedirectUrl = (url: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('redirectUrl', url);
  }
};

// Fonction pour récupérer et effacer l'URL de redirection
export const getAndClearRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    const url = sessionStorage.getItem('redirectUrl');
    sessionStorage.removeItem('redirectUrl');
    return url;
  }
  return null;
};

// Fonction pour rediriger vers la page de login avec l'URL de retour
export const redirectToLogin = (currentPath: string) => {
  saveRedirectUrl(currentPath);
  window.location.href = '/login';
}; 