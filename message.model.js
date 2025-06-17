const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - requete_id
 *         - expediteur_id
 *         - contenu
 *       properties:
 *         _id:
 *           type: string
 *         requete_id:
 *           $ref: '#/components/schemas/Request'
 *         expediteur_id:
 *           $ref: '#/components/schemas/User'
 *         contenu:
 *           type: string
 *         fichiers_joints:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Document'
 *         date_envoi:
 *           type: string
 *           format: date-time
 *         lu:
 *           type: boolean
 */

const messageSchema = new mongoose.Schema({
  requete_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  expediteur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contenu: { type: String, required: true },
  fichiers_joints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  date_envoi: { type: Date, default: Date.now },
  lu: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', messageSchema);