import React, { useState } from "react";
import { ClipboardList, Edit2, MessageCircle, Users } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useRequests } from "../../context/RequestsContext";

const StaffRequests = () => {
  const {
    requests,
    loading,
    error,
    getFilteredRequests,
    updateRequest,
    fetchRequests,
  } = useRequests();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showTraitement, setShowTraitement] = useState(false);
  const [traitement, setTraitement] = useState({
    statut: "",
    commentaire: "",
    document: null,
  });

  const filteredRequests = getFilteredRequests();

  const handleTraitement = (req) => {
    setSelectedRequest(req);
    setShowTraitement(true);
    setTraitement({
      statut: req.status,
      commentaire: "",
      document: null,
    });
  };

  const handleTraitementSubmit = async () => {
    await updateRequest(selectedRequest.id, traitement);
    setShowTraitement(false);
    setSelectedRequest(null);
    await fetchRequests();
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-600" />
            Gestion des Requêtes
          </h1>
        </div>
      </div>

      {/* Liste des requêtes */}
      <Card>
        <Card.Body>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="mt-4 text-sm font-medium text-gray-900">
                Aucune requête trouvée
              </h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="px-4 py-3">{req.reference}</td>
                      <td className="px-4 py-3">{req.titre}</td>
                      <td className="px-4 py-3">{req.status}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleTraitement(req)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal Traitement */}
      {showTraitement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowTraitement(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Traitement de la requête</h2>
            <div className="space-y-3">
              <label className="block text-sm font-medium">Statut</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={traitement.statut}
                onChange={(e) => setTraitement({ ...traitement, statut: e.target.value })}
              >
                <option value="in_progress">En cours</option>
                <option value="completed">Terminée</option>
                <option value="rejected">Rejetée</option>
              </select>
              <label className="block text-sm font-medium">Commentaire</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={traitement.commentaire}
                onChange={(e) => setTraitement({ ...traitement, commentaire: e.target.value })}
              />
              <Button variant="primary" onClick={handleTraitementSubmit}>
                Envoyer le traitement
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffRequests;