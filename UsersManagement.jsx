import React, { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { getUsers, addUser } from "../../services/apiService";

const initialUser = {
  matricule: "",
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  mot_de_passe: "",
  role: "agent",
  faculte: "",
  departement: "",
  statut: "Actif"
};

const roles = ["admin", "agent", "department_head", "student"];

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      alert("Erreur lors du chargement des utilisateurs");
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      await addUser(newUser);
      setShowAdd(false);
      setNewUser(initialUser);
      fetchUsers();
    } catch (err) {
      alert("Erreur lors de l'ajout");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          Ajouter un utilisateur
        </Button>
      </div>
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Liste des utilisateurs</h3>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div>Chargement...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.matricule}</td>
                    <td>{u.nom}</td>
                    <td>{u.prenom}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card.Body>
      </Card>

      {/* Modal ajout utilisateur */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowAdd(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Ajouter un utilisateur</h2>
            <div className="space-y-3">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Matricule"
                value={newUser.matricule}
                onChange={(e) => setNewUser({ ...newUser, matricule: e.target.value })}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Nom"
                value={newUser.nom}
                onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Prénom"
                value={newUser.prenom}
                onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Téléphone"
                value={newUser.telephone}
                onChange={(e) => setNewUser({ ...newUser, telephone: e.target.value })}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Mot de passe"
                type="password"
                value={newUser.mot_de_passe}
                onChange={(e) => setNewUser({ ...newUser, mot_de_passe: e.target.value })}
              />
              <select
                className="w-full border rounded px-3 py-2"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Faculté"
                value={newUser.faculte}
                onChange={(e) => setNewUser({ ...newUser, faculte: e.target.value })}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Département"
                value={newUser.departement}
                onChange={(e) => setNewUser({ ...newUser, departement: e.target.value })}
              />
              <select
                className="w-full border rounded px-3 py-2"
                value={newUser.statut}
                onChange={(e) => setNewUser({ ...newUser, statut: e.target.value })}
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
              <Button variant="primary" onClick={handleAdd} loading={loading}>
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;