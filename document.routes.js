const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const upload = require('../utils/fileUpload');

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Gestion des documents joints
 */

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Liste tous les documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des documents
 */
router.get('/', authenticate, authorize('admin', 'department_head', 'agent', 'student'), documentController.getAll);

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Récupère un document par ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du document
 *     responses:
 *       200:
 *         description: Document trouvé
 *       404:
 *         description: Document non trouvé
 */
router.get('/:id', authenticate, authorize('admin', 'department_head', 'agent', 'student'), documentController.getOne);

/**
 * @swagger
 * /documents/upload:
 *   post:
 *     summary: Upload un document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploadé
 */
router.post(
  '/upload',
  authenticate,
  authorize('admin', 'department_head', 'agent', 'student'),
  upload.single('file'),
  async (req, res, next) => {
    try {
      // Création du document en base
      const Document = require('../models/document.model');
      const doc = new Document({
        nom_fichier: req.file.filename,
        chemin: req.file.path,
        type_mime: req.file.mimetype,
        taille: req.file.size,
        uploade_par: req.user._id
      });
      await doc.save();
      res.status(201).json(doc);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /documents/download/{id}:
 *   get:
 *     summary: Télécharge un document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du document
 *     responses:
 *       200:
 *         description: Document téléchargé
 *       404:
 *         description: Document non trouvé
 */
router.get(
  '/download/:id',
  authenticate,
  authorize('admin', 'department_head', 'agent', 'student'),
  async (req, res, next) => {
    try {
      const Document = require('../models/document.model');
      const doc = await Document.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Document non trouvé' });
      res.download(doc.chemin, doc.nom_fichier);
    } catch (err) {
      next(err);
    }
  }
);

// CRUD classique
router.get('/', authenticate, authorize('admin', 'department_head', 'agent', 'student'), documentController.getAll);
router.get('/:id', authenticate, authorize('admin', 'department_head', 'agent', 'student'), documentController.getOne);
router.post('/', authenticate, authorize('admin', 'department_head', 'agent', 'student'), documentController.create);
router.put('/:id', authenticate, authorize('admin', 'department_head', 'agent'), documentController.update);
router.delete('/:id', authenticate, authorize('admin'), documentController.remove);

module.exports = router;