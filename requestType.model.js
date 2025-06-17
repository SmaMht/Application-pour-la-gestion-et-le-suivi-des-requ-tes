const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     RequestType:
 *       type: object
 *       required:
 *         - nom
 *       properties:
 *         _id:
 *           type: string
 *         nom:
 *           type: string
 *         description:
 *           type: string
 *         delai_standard:
 *           type: integer
 *         documents_requis:
 *           type: array
 *           items:
 *             type: string
 *         formulaire_specifique:
 *           type: object
 */

const requestTypeSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  description: String,
  delai_standard: { type: Number, default: 7 }, // jours
  documents_requis: [String],
  formulaire_specifique: Object
});

module.exports = mongoose.model('RequestType', requestTypeSchema);