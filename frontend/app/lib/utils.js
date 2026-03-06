// Récupère l'utilisateur depuis localStorage
const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  const userString = localStorage.getItem('user');
  if (!userString) return null;
  
  try {
    return JSON.parse(userString);
  } catch {
    return null;
  }
};

// Vérifie si l'utilisateur est authentifié
const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

// Déconnecte l'utilisateur
const logout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.cookie = 'auth=; path=/; max-age=0';
  window.location.href = '/';
};

export { getCurrentUser, isAuthenticated, logout };
