// URL de base de l'API backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Fonction helper pour faire des requêtes avec fetch
const fetchAPI = async (endpoint, options = {}) => {
  // Récupère le token depuis localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Configure les headers par défaut
  const headers = {
    'Content-Type': 'application/json',
  };

  // Ajoute les headers personnalisés si fournis
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  // Ajoute le token si disponible
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Fait la requête
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers: headers,
    body: options.body,
  });

  // Gère les erreurs
  if (!response.ok) {
    // Si 401 (non autorisé), déconnecte l'utilisateur
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Parse l'erreur si possible
    let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (parseError) {
      console.error('Impossible de parser la réponse d\'erreur:', parseError);
    }

    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, errorMessage);
    throw new Error(errorMessage);
  }

  // Retourne les données JSON
  return response.json();
};

// Méthodes raccourcies pour les requêtes courantes
const api = {
  // GET request
  get: (endpoint) => {
    return fetchAPI(endpoint, { method: 'GET' });
  },

  // POST request
  post: (endpoint, data) => {
    return fetchAPI(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT request
  put: (endpoint, data) => {
    return fetchAPI(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE request
  delete: (endpoint) => {
    return fetchAPI(endpoint, { method: 'DELETE' });
  },

  // POST avec FormData (pour les uploads)
  postFormData: (endpoint, formData) => {
    return fetchAPI(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Pas de Content-Type, le navigateur le gère
    });
  },

  // PUT avec FormData
  putFormData: (endpoint, formData) => {
    return fetchAPI(endpoint, {
      method: 'PUT',
      body: formData,
      headers: {},
    });
  },
};

export default api;