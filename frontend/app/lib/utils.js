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

// Vérifie si l'utilisateur est authentifié (via les données user en localStorage)
// Le vrai token est dans un cookie HttpOnly — le backend valide chaque requête
const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;

  const userString = localStorage.getItem('user');
  return !!userString;
};

// Déconnecte l'utilisateur : efface le cookie côté backend + les données locales
const logout = async () => {
  if (typeof window === 'undefined') return;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.okanime.live/api';
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Si le backend est injoignable, on déconnecte quand même côté client
  }

  localStorage.removeItem('user');
  document.cookie = 'auth=; path=/; max-age=0';
  window.location.href = '/';
};

export { getCurrentUser, isAuthenticated, logout };
