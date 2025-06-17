const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       required:
 *         - nom_fichier
 *         - chemin
 *         - type_mime
 *         - taille
 *       properties:
 *         _id:
 *           type: string
 *         nom_fichier:
 *           type: string
 *         chemin:
 *           type: string
 *         type_mime:
 *           type: string
 *         taille:
 *           type: integer
 *         requete_id:
 *           $ref: '#/components/schemas/Request'
 *         uploade_par:
 *           $ref: '#/components/schemas/User'
 *         date_upload:
 *           type: string
 *           format: date-time
 */

const documentSchema = new mongoose.Schema({
  nom_fichier: { type: String, required: true },
  chemin: { type: String, required: true },
  type_mime: { type: String, required: true },
  taille: { type: Number, required: true },
  requete_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
  uploade_par: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date_upload: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);