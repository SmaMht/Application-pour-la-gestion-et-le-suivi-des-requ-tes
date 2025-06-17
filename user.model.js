const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  matricule: { type: String, unique: true, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  telephone: String,
  mot_de_passe_hash: { type: String, required: true },
  role: { type: String, enum: ['student', 'agent', 'department_head', 'admin'], required: true },
  faculte: String,
  departement: String,
  date_creation: { type: Date, default: Date.now },
  derniere_connexion: Date,
  statut: { type: String, enum: ['Actif', 'Inactif'], default: 'Actif' }
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.mot_de_passe_hash);
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - matricule
 *         - nom
 *         - prenom
 *         - email
 *         - mot_de_passe_hash
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *         matricule:
 *           type: string
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *         email:
 *           type: string
 *         telephone:
 *           type: string
 *         mot_de_passe_hash:
 *           type: string
 *         role:
 *           type: string
 *           enum: [student, agent, department_head, admin]
 *         faculte:
 *           type: string
 *         departement:
 *           type: string
 *         date_creation:
 *           type: string
 *           format: date-time
 *         derniere_connexion:
 *           type: string
 *           format: date-time
 *         statut:
 *           type: string
 *           enum: [Actif, Inactif]
 */

module.exports = mongoose.model('User', userSchema);