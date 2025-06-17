const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     StatusHistory:
 *       type: object
 *       required:
 *         - requete_id
 *         - ancien_statut
 *         - nouveau_statut
 *       properties:
 *         _id:
 *           type: string
 *         requete_id:
 *           $ref: '#/components/schemas/Request'
 *         ancien_statut:
 *           type: string
 *         nouveau_statut:
 *           type: string
 *         commentaire:
 *           type: string
 *         agent_id:
 *           $ref: '#/components/schemas/User'
 *         date_changement:
 *           type: string
 *           format: date-time
 */

const statusHistorySchema = new mongoose.Schema({
  requete_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  ancien_statut: { type: String, required: true },
  nouveau_statut: { type: String, required: true },
  commentaire: String,
  agent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date_changement: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StatusHistory', statusHistorySchema);