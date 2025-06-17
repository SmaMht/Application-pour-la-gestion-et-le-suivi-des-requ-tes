const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Gestion des requêtes étudiantes
 */

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Liste toutes les requêtes
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des requêtes
 */
router.get('/', authenticate, authorize('admin', 'department_head', 'agent', 'student'), requestController.getAll);

/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     summary: Récupère une requête par ID
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la requête
 *     responses:
 *       200:
 *         description: Requête trouvée
 *       404:
 *         description: Requête non trouvée
 */
router.get('/:id', authenticate, authorize('admin', 'department_head', 'agent', 'student'), requestController.getOne);

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Crée une nouvelle requête
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       201:
 *         description: Requête créée
 */
router.post('/', authenticate, authorize('student', 'agent', 'department_head', 'admin'), requestController.create);
// Modification par agent, chef ou admin
router.put('/:id', authenticate, authorize('admin', 'department_head', 'agent'), requestController.update);
// Suppression par admin
router.delete('/:id', authenticate, authorize('admin'), requestController.remove);

module.exports = router;