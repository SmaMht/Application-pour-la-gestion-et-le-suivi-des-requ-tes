const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       required:
 *         - numero_reference
 *         - type_requete
 *         - titre
 *         - description
 *         - etudiant_id
 *       properties:
 *         _id:
 *           type: string
 *         numero_reference:
 *           type: string
 *         type_requete:
 *           $ref: '#/components/schemas/RequestType'
 *         titre:
 *           type: string
 *         description:
 *           type: string
 *         priorite:
 *           type: string
 *           enum: [Urgente, Normale, Faible]
 *         statut:
 *           type: string
 *           enum: [Soumise, En cours d'examen, Informations requises, En traitement, Validée, Terminée, Rejetée]
 *         etudiant_id:
 *           $ref: '#/components/schemas/User'
 *         agent_assigne_id:
 *           $ref: '#/components/schemas/User'
 *         date_creation:
 *           type: string
 *           format: date-time
 *         date_limite:
 *           type: string
 *           format: date-time
 *         date_derniere_maj:
 *           type: string
 *           format: date-time
 *         documents_joints:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Document'
 */

const requestSchema = new mongoose.Schema({
  numero_reference: { type: String, unique: true, required: true },
  type_requete: { type: mongoose.Schema.Types.ObjectId, ref: 'RequestType', required: true },
  titre: { type: String, required: true },
  description: { type: String, required: true },
  priorite: { type: String, enum: ['Urgente', 'Normale', 'Faible'], default: 'Normale' },
  statut: { type: String, enum: [
    'Soumise', 'En cours d\'examen', 'Informations requises', 'En traitement', 'Validée', 'Terminée', 'Rejetée'
  ], default: 'Soumise' },
  etudiant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agent_assigne_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date_creation: { type: Date, default: Date.now },
  date_limite: Date,
  date_derniere_maj: Date,
  documents_joints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
});

module.exports = mongoose.model('Request', requestSchema);