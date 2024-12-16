interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export const handleError = (error: Error | ApiError): string => {
  if (!navigator.onLine) {
    return "Vérifiez votre connexion internet";
  }
  
  if (error.message.includes('Failed to fetch')) {
    return "Impossible de joindre le serveur";
  }
  
  return error.message || "Une erreur est survenue";
}; 