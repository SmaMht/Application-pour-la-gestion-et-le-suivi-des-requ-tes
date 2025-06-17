import React, { useEffect, useState } from 'react';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Settings,
  BarChart3,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import StatsCard from '../../components/ui/StatsCard';
import { getUsers, getRequests } from '../../services/apiService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    systemUptime: '99.9%',
    avgProcessingTime: 'N/A'
  });
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Récupérer les utilisateurs et requêtes depuis l'API
        const [usersData, requestsData] = await Promise.all([
          getUsers(),
          getRequests()
        ]);
        setUsers(usersData);
        setRequests(requestsData);

        // Calculs statistiques simples
        setStats({
          totalUsers: usersData.length,
          totalRequests: requestsData.length,
          systemUptime: '99.9%', // À remplacer par une vraie valeur si dispo via l'API
          avgProcessingTime: calcAvgProcessingTime(requestsData)
        });
      } catch (err) {
        // Gérer l’erreur (affichage, toast, etc.)
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  // Exemple de calcul du temps moyen de traitement
  function calcAvgProcessingTime(requests) {
    const completed = requests.filter(r => r.status === 'completed' && r.createdAt && r.updatedAt);
    if (completed.length === 0) return 'N/A';
    const totalDays = completed.reduce((sum, r) => {
      const created = new Date(r.createdAt);
      const updated = new Date(r.updatedAt);
      return sum + Math.max(0, (updated - created) / (1000 * 60 * 60 * 24));
    }, 0);
    return `${(totalDays / completed.length).toFixed(1)} jours`;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">
          Tableau de bord Administrateur
        </h1>
        <p className="text-purple-100 mt-2">
          Vue d'ensemble du système et gestion globale de l'application.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Utilisateurs Total"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
          change={0}
          trend="up"
        />
        <StatsCard
          title="Requêtes Total"
          value={stats.totalRequests}
          icon={FileText}
          color="green"
          change={0}
          trend="up"
        />
        <StatsCard
          title="Temps de Traitement"
          value={stats.avgProcessingTime}
          icon={Clock}
          color="yellow"
          change={0}
          trend="neutral"
        />
        <StatsCard
          title="Disponibilité"
          value={stats.systemUptime}
          icon={Shield}
          color="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Liste des utilisateurs */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Utilisateurs</h3>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div>Chargement...</div>
            ) : (
              <ul>
                {users.slice(0, 10).map(user => (
                  <li key={user._id || user.id} className="py-2 border-b">
                    {user.prenom} {user.nom} — {user.email} ({user.role})
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>

        {/* Liste des requêtes */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Requêtes récentes</h3>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div>Chargement...</div>
            ) : (
              <ul>
                {requests.slice(0, 10).map(req => (
                  <li key={req._id || req.id} className="py-2 border-b">
                    {req.titre} — {req.status} ({new Date(req.createdAt).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;