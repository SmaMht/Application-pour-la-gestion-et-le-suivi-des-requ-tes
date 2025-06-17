const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messagerie interne liée aux requêtes
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Liste tous les messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des messages
 */
router.get('/', authenticate, authorize('admin', 'department_head', 'agent', 'student'), messageController.getAll);

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Récupère un message par ID
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du message
 *     responses:
 *       200:
 *         description: Message trouvé
 *       404:
 *         description: Message non trouvé
 */
router.get('/:id', authenticate, authorize('admin', 'department_head', 'agent', 'student'), messageController.getOne);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Envoie un message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       201:
 *         description: Message envoyé
 */
router.post('/', authenticate, authorize('admin', 'department_head', 'agent', 'student'), messageController.create);

/**
 * @swagger
 * /messages/requete/{requeteId}:
 *   get:
 *     summary: Liste les messages d'une requête
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requeteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la requête
 *     responses:
 *       200:
 *         description: Liste des messages de la requête
 */
router.get(
  '/requete/:requeteId',
  authenticate,
  authorize('admin', 'department_head', 'agent', 'student'),
  async (req, res, next) => {
    try {
      const Message = require('../models/message.model');
      const messages = await Message.find({ requete_id: req.params.requeteId })
        .populate('expediteur_id', 'nom prenom role')
        .populate('fichiers_joints');
      res.json(messages);
    } catch (err) {
      next(err);
    }
  }
);
router.patch(
  '/:id/lu',
  authenticate,
  authorize('admin', 'department_head', 'agent', 'student'),
  async (req, res, next) => {
    try {
      const Message = require('../models/message.model');
      const message = await Message.findByIdAndUpdate(
        req.params.id,
        { lu: true },
        { new: true }
      );
      if (!message) return res.status(404).json({ message: 'Message non trouvé' });
      res.json(message);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;