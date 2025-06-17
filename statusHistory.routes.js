const express = require('express');
const router = express.Router();
const statusHistoryController = require('../controllers/statusHistory.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

/**
 * @swagger
 * tags:
 *   name: StatusHistory
 *   description: Historique des statuts des requêtes
 */

/**
 * @swagger
 * /status-history:
 *   get:
 *     summary: Liste tout l'historique des statuts
 *     tags: [StatusHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des historiques
 */
router.get('/', authenticate, authorize('admin', 'department_head', 'agent'), statusHistoryController.getAll);

/**
 * @swagger
 * /status-history/{id}:
 *   get:
 *     summary: Récupère un historique de statut par ID
 *     tags: [StatusHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'historique
 *     responses:
 *       200:
 *         description: Historique trouvé
 *       404:
 *         description: Historique non trouvé
 */
router.get('/:id', authenticate, authorize('admin', 'department_head', 'agent'), statusHistoryController.getOne);

/**
 * @swagger
 * /status-history:
 *   post:
 *     summary: Crée un historique de statut
 *     tags: [StatusHistory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusHistory'
 *     responses:
 *       201:
 *         description: Historique créé
 */
router.post('/', authenticate, authorize('admin', 'department_head', 'agent'), statusHistoryController.create);

/**
 * @swagger
 * /status-history/{id}:
 *   put:
 *     summary: Met à jour un historique de statut
 *     tags: [StatusHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'historique
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusHistory'
 *     responses:
 *       200:
 *         description: Historique mis à jour
 *       404:
 *         description: Historique non trouvé
 */
router.put('/:id', authenticate, authorize('admin'), statusHistoryController.update);

/**
 * @swagger
 * /status-history/{id}:
 *   delete:
 *     summary: Supprime un historique de statut
 *     tags: [StatusHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'historique
 *     responses:
 *       200:
 *         description: Historique supprimé
 *       404:
 *         description: Historique non trouvé
 */
router.delete('/:id', authenticate, authorize('admin'), statusHistoryController.remove);

module.exports = router;