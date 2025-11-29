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
  
  const token = localStorage.getItem('token');
  return !!token;
};

// Déconnecte l'utilisateur
const logout = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

// Récupère le token
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export { getCurrentUser, isAuthenticated, logout, getToken };
