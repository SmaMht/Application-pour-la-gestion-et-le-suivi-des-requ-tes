import React, { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useRequests } from "../../context/RequestsContext";

const StudentRequests = () => {
  const { requests, loading, error, filters, setFilters, getFilteredRequests } = useRequests();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    setFilters({
      status: "all",
      type: "all",
      priority: "all",
      search: "",
    });
  };

  const filteredRequests = getFilteredRequests();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Requêtes</h1>
          <p className="text-gray-600 mt-1">
            Gérez et suivez toutes vos demandes administratives
          </p>
        </div>
        <Link to="/dashboard/student/requests/new">
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Requête
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <Card.Body className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une requête..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                className="w-full border rounded px-3 py-2"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">Tous statuts</option>
                <option value="submitted">Soumise</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminée</option>
                <option value="rejected">Rejetée</option>
              </select>
              <select
                className="w-full border rounded px-3 py-2"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="all">Tous types</option>
                {/* Ajoute dynamiquement les types si besoin */}
              </select>
              <select
                className="w-full border rounded px-3 py-2"
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
              >
                <option value="all">Toutes priorités</option>
                <option value="high">Urgente</option>
                <option value="normal">Normale</option>
                <option value="low">Faible</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="w-full"
              >
                Réinitialiser
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Requests List */}
      <Card>
        <Card.Body>
          <div>
            {filteredRequests.length === 0 ? (
              <div>Aucune requête trouvée</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requête
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.titre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {request.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StudentRequests;