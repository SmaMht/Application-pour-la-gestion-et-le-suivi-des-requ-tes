import React, { useEffect, useState } from "react";
import { Users, UserPlus, Search, Shield, Mail, Edit, Trash2, Check, X, Lock, Unlock } from "lucide-react";
import { getUsers, addUser, updateUser, deleteUser } from "../../services/apiService";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// Utilise les valeurs attendues par le backend
const roles = [
  { label: "Enseignant", value: "agent" },
  { label: "Secrétaire", value: "agent" }
];

const TeamManagement = () => {
  const [search, setSearch] = useState("");
  const [team, setTeam] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({
    matricule: "",
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    mot_de_passe: "",
    role: roles[0].value,
    faculte: "Sciences",
    departement: "",
    statut: "Actif"
  });
  const [editId, setEditId] = useState(null);
  const [editMember, setEditMember] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const users = await getUsers();
        setTeam(users);
      } catch (err) {
        // Gérer l’erreur
      }
      setLoading(false);
    };
    fetchTeam();
  }, []);

  // Recherche multi-champ
  const filteredTeam = team.filter(
    (member) =>
      member.prenom.toLowerCase().includes(search.toLowerCase()) ||
      member.nom.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.matricule.toLowerCase().includes(search.toLowerCase()) ||
      (member.role && member.role.toLowerCase().includes(search.toLowerCase())) ||
      member.departement.toLowerCase().includes(search.toLowerCase())
  );

  // Ajout membre (API)
  const handleAdd = async () => {
    try {
      const created = await addUser(newMember);
      setTeam([...team, created]);
      setShowAdd(false);
      setNewMember({
        matricule: "",
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        mot_de_passe: "",
        role: roles[0].value,
        faculte: "Sciences",
        departement: "",
        statut: "Actif"
      });
    } catch (err) {
      alert("Erreur lors de l'ajout du membre");
    }
  };

  // Edition membre (API)
  const handleEdit = (member) => {
    setEditId(member._id);
    setEditMember(member);
  };
  const handleEditSave = async () => {
    try {
      const updated = await updateUser(editId, editMember);
      setTeam(team.map((m) => (m._id === editId ? updated : m)));
      setEditId(null);
    } catch (err) {
      alert("Erreur lors de la modification");
    }
  };

  // Suppression membre (API)
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce membre ?")) {
      try {
        await deleteUser(id);
        setTeam(team.filter((m) => m._id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  // Activation/désactivation (API)
  const toggleStatus = async (id) => {
    const member = team.find((m) => m._id === id);
    if (!member) return;
    try {
      const updated = await updateUser(id, {
        ...member,
        statut: member.statut === "Actif" ? "Inactif" : "Actif"
      });
      setTeam(team.map((m) => (m._id === id ? updated : m)));
    } catch (err) {
      alert("Erreur lors du changement de statut");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Gestion d'Équipe
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les membres de votre équipe pédagogique, leur rôle, leur statut et
            leurs accès conformément au cahier des charges.
          </p>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => setShowAdd(true)}
        >
          <UserPlus className="h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>

      {/* Search */}
      <Card>
        <Card.Body>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, matricule, email, rôle, département..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Team List */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Membres de l'équipe</h3>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">Chargement des membres...</p>
            </div>
          ) : filteredTeam.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-4 text-sm font-medium text-gray-900">
                Aucun membre trouvé
              </h4>
              <p className="mt-2 text-sm text-gray-500">
                Aucun résultat ne correspond à votre recherche.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matricule
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom & Prénom
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Département
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière connexion
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeam.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {editId === member._id ? (
                          <input
                            className="border rounded px-2 py-1 text-sm"
                            value={editMember.matricule}
                            onChange={(e) =>
                              setEditMember({
                                ...editMember,
                                matricule: e.target.value,
                              })
                            }
                            style={{ width: 90 }}
                          />
                        ) : (
                          member.matricule
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-400" />
                          {editId === member._id ? (
                            <>
                              <input
                                className="border rounded px-2 py-1 text-sm"
                                value={editMember.prenom}
                                onChange={(e) =>
                                  setEditMember({
                                    ...editMember,
                                    prenom: e.target.value,
                                  })
                                }
                                style={{ width: 60 }}
                              />
                              <input
                                className="border rounded px-2 py-1 text-sm"
                                value={editMember.nom}
                                onChange={(e) =>
                                  setEditMember({
                                    ...editMember,
                                    nom: e.target.value,
                                  })
                                }
                                style={{ width: 80 }}
                              />
                            </>
                          ) : (
                            <span className="text-sm font-medium text-gray-900">
                              {member.prenom} {member.nom}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {editId === member._id ? (
                          <input
                            className="border rounded px-2 py-1 text-sm"
                            value={editMember.email}
                            onChange={(e) =>
                              setEditMember({
                                ...editMember,
                                email: e.target.value,
                              })
                            }
                            style={{ width: 180 }}
                          />
                        ) : (
                          member.email
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {editId === member._id ? (
                          <input
                            className="border rounded px-2 py-1 text-sm"
                            value={editMember.telephone}
                            onChange={(e) =>
                              setEditMember({
                                ...editMember,
                                telephone: e.target.value,
                              })
                            }
                            style={{ width: 110 }}
                          />
                        ) : (
                          member.telephone
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {editId === member._id ? (
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={editMember.role}
                            onChange={(e) =>
                              setEditMember({
                                ...editMember,
                                role: e.target.value,
                              })
                            }
                          >
                            {roles.map((r) => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                        ) : (
                          // Affiche le label au lieu de la valeur brute
                          roles.find(r => r.value === member.role)?.label || member.role
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {editId === member._id ? (
                          <input
                            className="border rounded px-2 py-1 text-sm"
                            value={editMember.departement}
                            onChange={(e) =>
                              setEditMember({
                                ...editMember,
                                departement: e.target.value,
                              })
                            }
                            style={{ width: 90 }}
                          />
                        ) : (
                          member.departement
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            member.statut === "Actif"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {member.statut}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                        {member.derniere_connexion || "Jamais"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex gap-2">
                        {editId === member._id ? (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={handleEditSave}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditId(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(member)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleStatus(member._id)}
                              title={
                                member.statut === "Actif"
                                  ? "Désactiver le compte"
                                  : "Activer le compte"
                              }
                            >
                              {member.statut === "Actif" ? (
                                <Lock className="h-4 w-4 text-red-500" />
                              ) : (
                                <Unlock className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(member._id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            <a href={`mailto:${member.email}`}>
                              <Button size="sm" variant="outline">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </a>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal ajout membre */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowAdd(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Ajouter un membre</h2>
            <div className="space-y-3">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Matricule"
                value={newMember.matricule}
                onChange={(e) =>
                  setNewMember({ ...newMember, matricule: e.target.value })
                }
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Prénom"
                value={newMember.prenom}
                onChange={(e) =>
                  setNewMember({ ...newMember, prenom: e.target.value })
                }
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Nom"
                value={newMember.nom}
                onChange={(e) =>
                  setNewMember({ ...newMember, nom: e.target.value })
                }
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Email"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Téléphone"
                value={newMember.telephone}
                onChange={(e) =>
                  setNewMember({ ...newMember, telephone: e.target.value })
                }
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Département"
                value={newMember.departement}
                onChange={(e) =>
                  setNewMember({ ...newMember, departement: e.target.value })
                }
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Mot de passe"
                type="password"
                value={newMember.mot_de_passe}
                onChange={(e) =>
                  setNewMember({ ...newMember, mot_de_passe: e.target.value })
                }
              />
              <select
                className="w-full border rounded px-3 py-2"
                value={newMember.role}
                onChange={(e) =>
                  setNewMember({ ...newMember, role: e.target.value })
                }
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <Button
                variant="primary"
                className="w-full"
                onClick={handleAdd}
                disabled={
                  !newMember.matricule ||
                  !newMember.prenom ||
                  !newMember.nom ||
                  !newMember.email ||
                  !newMember.telephone ||
                  !newMember.departement ||
                  !newMember.mot_de_passe
                }
              >
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;