// Validation de l'email
export const validateEmail = (email: string) => {
  if (!email) {
    return { isValid: false, message: "L'email est requis" };
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Format d'email invalide" };
  }

  return { isValid: true, message: "" };
};

// Validation du mot de passe
export const validatePassword = (password: string) => {
  if (!password) {
    return { isValid: false, message: "Le mot de passe est requis" };
  }

  if (password.length < 8) {
    return { isValid: false, message: "Le mot de passe doit contenir au moins 8 caractères" };
  }

  // Au moins une majuscule
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Le mot de passe doit contenir au moins une majuscule" };
  }

  // Au moins une minuscule
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Le mot de passe doit contenir au moins une minuscule" };
  }

  // Au moins un chiffre
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "Le mot de passe doit contenir au moins un chiffre" };
  }

  // Au moins un caractère spécial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: "Le mot de passe doit contenir au moins un caractère spécial" };
  }

  return { isValid: true, message: "" };
};

// Validation de la confirmation du mot de passe
export const validatePasswordConfirmation = (password: string, confirmPassword: string) => {
  if (password !== confirmPassword) {
    return { isValid: false, message: "Les mots de passe ne correspondent pas" };
  }

  return { isValid: true, message: "" };
}; 