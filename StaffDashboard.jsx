import React from "react";
import { FileText, TrendingUp, Calendar, MessageSquare, AlertTriangle } from "lucide-react";
import Card from "../../components/ui/Card";
import { useRequests } from "../../context/RequestsContext";
import StatusBadge from "../../components/common/StatusBadge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const StaffDashboard = () => {
  const { requests, loading } = useRequests();

  // Filtrer les requêtes assignées à l'utilisateur connecté si besoin
  const assignedRequests = requests; // À adapter selon la logique d'assignation

  // Statistiques
  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.status === "completed").length;

  // Requêtes urgentes
  const urgentRequests = assignedRequests.filter(r => r.priority === "high" && !["completed", "rejected"].includes(r.status)).slice(0, 3);

  // Requêtes récentes
  const recentRequests = assignedRequests.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Urgent Requests */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Requêtes Urgentes</h3>
        </Card.Header>
        <Card.Body>
          {urgentRequests.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
              <h4 className="mt-4 text-sm font-medium text-gray-900">Aucune requête urgente</h4>
              <p className="mt-2 text-sm text-gray-500">Toutes les requêtes urgentes ont été traitées.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {urgentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{request.titre}</p>
                        <p className="text-sm text-gray-500">{request.reference} • {request.type.nom}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <StatusBadge status={request.status} />
                    <p className="text-xs text-gray-500">{format(request.createdAt, 'dd/MM')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Statistiques rapides */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Statistiques Rapides</h3>
        </Card.Header>
        <Card.Body className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Taux de résolution</span>
            </div>
            <span className="text-sm font-bold text-blue-600">
              {totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0}%
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Temps moyen</span>
            </div>
            <span className="text-sm font-bold text-green-600">3.2 jours</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Messages non lus</span>
            </div>
            <span className="text-sm font-bold text-purple-600">2</span>
          </div>
        </Card.Body>
      </Card>

      {/* Activité récente */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Activité Récente</h3>
        </Card.Header>
        <Card.Body>
          {recentRequests.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-4 text-sm font-medium text-gray-900">Aucune requête assignée</h4>
              <p className="mt-2 text-sm text-gray-500">Aucune requête ne vous a été assignée pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{request.titre}</p>
                        <p className="text-sm text-gray-500">{request.reference} • {request.type.nom}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <StatusBadge status={request.status} />
                    <p className="text-xs text-gray-500">{format(request.createdAt, 'dd/MM')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default StaffDashboard;