import React from "react";
import { Link } from "react-router-dom";
import { FileText, MessageSquare, Plus, TrendingUp, Calendar } from "lucide-react";
import Card from "../../components/ui/Card";
import { useRequests } from "../../context/RequestsContext";
import StatusBadge from "../../components/common/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const StudentDashboard = () => {
  const { requests, loading } = useRequests();

  // On affiche les 3 dernières requêtes
  const recentRequests = requests.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Actions rapides */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/dashboard/student/requests/new" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 group-hover:bg-blue-700">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">Nouvelle Requête</p>
            <p className="text-sm text-gray-500">Soumettre une nouvelle demande</p>
          </div>
        </Link>
        <Link to="/dashboard/student/requests" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 group-hover:bg-green-700">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">Mes Requêtes</p>
            <p className="text-sm text-gray-500">Consulter mes demandes</p>
          </div>
        </Link>
        <Link to="/messages" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 group-hover:bg-purple-700">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">Messages</p>
            <p className="text-sm text-gray-500">Communiquer avec l'administration</p>
          </div>
        </Link>
      </div>

      {/* Requêtes récentes */}
      <Card className="lg:col-span-2">
        <Card.Header className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Requêtes Récentes</h3>
          <Link to="/dashboard/student/requests" className="text-sm text-blue-600 hover:text-blue-500">
            Voir tout
          </Link>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div>Chargement...</div>
          ) : recentRequests.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-4 text-sm font-medium text-gray-900">Aucune requête</h4>
              <p className="mt-2 text-sm text-gray-500">Vous n'avez pas encore soumis de requête.</p>
              <Link to="/dashboard/student/requests/new" className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Requête
              </Link>
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
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(request.updatedAt, { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Conseils & Aide */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Conseils & Aide</h3>
        </Card.Header>
        <Card.Body>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Suivi en temps réel</h4>
                <p className="text-sm text-gray-500">Recevez des notifications à chaque étape du traitement de vos requêtes.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Délais de traitement</h4>
                <p className="text-sm text-gray-500">Chaque type de requête a un délai de traitement estimé pour vous aider à planifier.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                <MessageSquare className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Communication directe</h4>
                <p className="text-sm text-gray-500">Communiquez directement avec l'administration via le système de messages.</p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StudentDashboard;