import api from './api';

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
// On vérifie juste si on a les infos user (le cookie httpOnly est géré automatiquement)
const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const user = getCurrentUser();
  return !!user;
};

// Déconnecte l'utilisateur
const logout = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Appelle l'API pour supprimer le cookie httpOnly
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  } finally {
    // Nettoie le localStorage
    localStorage.removeItem('user');
    window.location.href = '/';
  }
};

// Note: getToken() n'est plus nécessaire car le token est dans un cookie httpOnly
// Il n'est plus accessible via JavaScript (c'est le but !)

export { getCurrentUser, isAuthenticated, logout };
