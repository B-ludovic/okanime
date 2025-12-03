// URL de base de l'API backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.okanime.live/api';

// Fonction helper pour faire des requêtes avec fetch
const fetchAPI = async (endpoint, options = {}) => {
  // Les cookies sont envoyés automatiquement avec credentials: 'include'
  // Plus besoin de gérer manuellement le token

  // Configure les headers par défaut
  const headers = {};
  
  // Ajoute Content-Type: application/json seulement si ce n'est pas du FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Ajoute les headers personnalisés si fournis
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  // Fait la requête avec credentials: 'include' pour envoyer les cookies
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers: headers,
    body: options.body,
    credentials: 'include', // Envoie les cookies httpOnly automatiquement
  });

  // Gère les erreurs
  if (!response.ok) {
    // Si 401 (non autorisé), redirige vers login
    if (response.status === 401 && typeof window !== 'undefined') {
      // Nettoie le localStorage (si utilisé pour d'autres données)
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

    // Convertir en string si c'est un objet
    const errorString = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, errorString);
    throw new Error(errorString);
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
      // Pas de headers, le navigateur gère automatiquement le Content-Type avec boundary
    });
  },

  // PUT avec FormData
  putFormData: (endpoint, formData) => {
    return fetchAPI(endpoint, {
      method: 'PUT',
      body: formData,
      // Pas de headers, le navigateur gère automatiquement le Content-Type avec boundary
    });
  },
};

export default api;