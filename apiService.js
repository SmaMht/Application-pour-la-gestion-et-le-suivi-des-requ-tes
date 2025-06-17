// services/apiService.js
const API_BASE_URL = 'http://localhost:5000/api';

// Helper pour ajouter le token dans les headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('Aucun token d\'authentification trouvé');
    return {};
  }
  return { Authorization: `Bearer ${token}` };
}

// AUTHENTIFICATION
export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Échec de la connexion');
  return res.json();
}

export async function register(userData) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error('Échec de l\'inscription');
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error('Impossible de récupérer le profil');
  return res.json();
}

// REQUÊTES (Requests)
export async function getRequests() {
  const res = await fetch(`${API_BASE_URL}/requests`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error('Impossible de récupérer les requêtes');
  return res.json();
}

export async function createRequest(requestData) {
  console.log('API: Envoi des données:', requestData); // Pour debug
  
  try {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        ...getAuthHeaders() 
      },
      body: JSON.stringify(requestData),
    });

    console.log('API: Statut de la réponse:', res.status);

    if (!res.ok) {
      let errorMessage = 'Impossible de créer la requête';
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('API: Erreur du serveur:', errorData);
      } catch (parseError) {
        console.error('API: Impossible de parser l\'erreur:', parseError);
      }
      throw new Error(errorMessage);
    }

    const result = await res.json();
    console.log('API: Requête créée avec succès:', result); // Pour debug
    return result;

  } catch (error) {
    console.error('API: Erreur lors de la création de la requête:', error);
    throw error;
  }
}

export async function updateRequest(id, updateData) {
  const res = await fetch(`${API_BASE_URL}/requests/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) throw new Error('Impossible de mettre à jour la requête');
  return res.json();
}

export async function deleteRequest(id) {
  const res = await fetch(`${API_BASE_URL}/requests/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error('Impossible de supprimer la requête');
  return res.json();
}

// TYPES DE REQUÊTES (Request Types)
export async function getRequestTypes() {
  const res = await fetch(`${API_BASE_URL}/request-types`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error('Impossible de récupérer les types de requêtes');
  return res.json();
}

// UTILISATEURS (optionnel)
export async function getUsers() {
  const res = await fetch(`${API_BASE_URL}/users`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error('Impossible de récupérer les utilisateurs');
  return res.json();
}

export async function addUser(userData) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error('Impossible d\'ajouter l\'utilisateur');
  return res.json();
}

export async function updateUser(id, userData) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error('Impossible de modifier l\'utilisateur');
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error('Impossible de supprimer l\'utilisateur');
  return res.json();
}

// Pour activer/désactiver, il faut un endpoint dédié ou utiliser updateUser avec un champ "statut"