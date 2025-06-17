// context/RequestsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/apiService';

const RequestsContext = createContext();

export function RequestsProvider({ children }) {
  const [requests, setRequests] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    dateRange: 'all',
    search: ''
  });

  // Charger les types de requêtes au montage
  useEffect(() => {
    fetchRequestTypes();
  }, []);

  // Charger les requêtes au montage
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getRequests();
      // Transformation des données pour correspondre au format attendu par l'interface
      const transformedRequests = data.map(request => ({
        id: request._id,
        reference: request.numero_reference,
        titre: request.titre,
        description: request.description,
        priority: request.priorite?.toLowerCase() || 'normal',
        status: mapApiStatusToLocal(request.statut),
        type: {
          id: request.type_requete._id,
          nom: request.type_requete.nom,
          description: request.type_requete.description,
          delaiStandard: request.type_requete.delai_standard,
          documentsRequis: request.type_requete.documents_requis || []
        },
        etudiant: {
          id: request.etudiant_id._id,
          matricule: request.etudiant_id.matricule,
          nom: request.etudiant_id.nom,
          prenom: request.etudiant_id.prenom,
          email: request.etudiant_id.email
        },
        createdAt: new Date(request.date_creation),
        updatedAt: new Date(request.date_derniere_maj),
        dateLimite: request.date_limite ? new Date(request.date_limite) : null,
        documents: request.documents_joints?.map(doc => ({
          id: doc._id,
          name: doc.nom_fichier,
          type: doc.type_mime,
          size: doc.taille,
          uploadedAt: new Date(doc.date_upload)
        })) || [],
        history: [
          {
            id: '1',
            action: 'Requête soumise',
            date: new Date(request.date_creation),
            comment: 'Requête créée et soumise pour traitement'
          }
        ]
      }));

      setRequests(transformedRequests);
    } catch (err) {
      setError(err);
      console.error('Erreur lors du chargement des requêtes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestTypes = async () => {
    try {
      const data = await api.getRequestTypes();
      const transformedTypes = data.map(type => ({
        id: type._id,
        nom: type.nom,
        description: type.description,
        delaiStandard: type.delai_standard,
        documentsRequis: type.documents_requis || [],
        formulaireSpecifique: type.formulaire_specifique || {}
      }));

      setRequestTypes(transformedTypes);
    } catch (err) {
      console.error('Erreur lors du chargement des types de requêtes:', err);
    }
  };
  
  const createRequest = async (requestData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Données envoyées à l\'API:', requestData); // Pour debug

      const apiRequestData = {
        etudiant_id: requestData.etudiant_id,
        type_requete: requestData.type_requete,
        numero_reference: requestData.numero_reference || `REQ-${Date.now()}`,
        titre: requestData.titre,
        description: requestData.description,
        priorite: requestData.priorite || 'Normale', // Valeur par défaut
      };

      const newRequest = await api.createRequest(apiRequestData);

      console.log('Réponse de l\'API:', newRequest); // Pour debug

      // Transformation de la réponse pour l'interface
      const transformedRequest = {
        id: newRequest._id,
        reference: newRequest.numero_reference,
        titre: newRequest.titre,
        description: newRequest.description,
        priority: newRequest.priorite?.toLowerCase() || 'normale',
        status: mapApiStatusToLocal(newRequest.statut),
        type: {
          id: newRequest.type_requete._id || newRequest.type_requete,
          nom: newRequest.type_requete.nom || 'Type non spécifié',
          description: newRequest.type_requete.description || ''
        },
        createdAt: new Date(newRequest.date_creation),
        updatedAt: new Date(newRequest.date_derniere_maj),
        documents: [],
        history: [
          {
            id: '1',
            action: 'Requête soumise',
            date: new Date(newRequest.date_creation),
            comment: 'Requête créée et soumise pour traitement'
          }
        ]
      };

      setRequests(prev => [...prev, transformedRequest]);

      // Afficher un message de succès
      toast?.success?.('Requête créée avec succès !');

      return transformedRequest;
    } catch (err) {
      console.error('Erreur détaillée lors de la création:', err);
      const errorMessage = err.message || "Erreur lors de la création de la requête";
      setError(errorMessage);

      // Afficher l'erreur à l'utilisateur
      toast?.error?.(errorMessage);

      // Re-lancer l'erreur pour que le composant puisse la gérer
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (id, requestData) => {
    try {
      const updatedRequest = await api.updateRequest(id, requestData);

      setRequests(prev =>
        prev.map(req =>
          req.id === id
            ? { ...req, ...requestData, updatedAt: new Date() }
            : req
        )
      );

      return updatedRequest;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteRequest = async (id) => {
    try {
      await api.deleteRequest(id);
      setRequests(prev => prev.filter(req => req.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Fonction pour mapper les statuts de l'API vers l'interface locale
  const mapApiStatusToLocal = (apiStatus) => {
    const statusMap = {
      'Soumise': 'submitted',
      'En cours d\'examen': 'in_review',
      'Informations requises': 'info_required',
      'En traitement': 'in_progress',
      'Validée': 'validated',
      'Terminée': 'completed',
      'Rejetée': 'rejected'
    };

    return statusMap[apiStatus] || 'submitted';
  };

  // Fonction pour filtrer les requêtes
  const getFilteredRequests = () => {
    return requests.filter(request => {
      // Filtre par statut
      if (filters.status !== 'all' && request.status !== filters.status) {
        return false;
      }

      // Filtre par type
      if (filters.type !== 'all' && request.type.id !== parseInt(filters.type)) {
        return false;
      }

      // Filtre par priorité
      if (filters.priority !== 'all' && request.priority !== filters.priority) {
        return false;
      }

      // Filtre par recherche
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          request.titre.toLowerCase().includes(searchTerm) ||
          request.reference.toLowerCase().includes(searchTerm) ||
          request.type.nom.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });
  };

  // Fonction pour mettre à jour les filtres
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const value = {
    requests,
    requestTypes,
    loading,
    error,
    filters,
    setFilters: updateFilters,
    fetchRequests,
    createRequest,
    updateRequest,
    deleteRequest,
    getFilteredRequests,
    refetch: fetchRequests
  };

  return (
    <RequestsContext.Provider value={value}>
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  return useContext(RequestsContext);
}