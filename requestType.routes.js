const express = require('express');
const router = express.Router();
const requestTypeController = require('../controllers/requestType.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

/**
 * @swagger
 * tags:
 *   name: RequestTypes
 *   description: Types de requêtes étudiantes
 */

/**
 * @swagger
 * /request-types:
 *   get:
 *     summary: Liste tous les types de requêtes
 *     tags: [RequestTypes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des types de requêtes
 */
router.get('/', authenticate, authorize('admin', 'department_head', 'agent', 'student'), requestTypeController.getAll);

/**
 * @swagger
 * /request-types/{id}:
 *   get:
 *     summary: Récupère un type de requête par ID
 *     tags: [RequestTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du type de requête
 *     responses:
 *       200:
 *         description: Type trouvé
 *       404:
 *         description: Type non trouvé
 */
router.get('/:id', authenticate, authorize('admin', 'department_head', 'agent', 'student'), requestTypeController.getOne);

/**
 * @swagger
 * /request-types:
 *   post:
 *     summary: Crée un type de requête
 *     tags: [RequestTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestType'
 *     responses:
 *       201:
 *         description: Type créé
 */
router.post('/', authenticate, authorize('admin'), requestTypeController.create);

/**
 * @swagger
 * /request-types/{id}:
 *   put:
 *     summary: Met à jour un type de requête
 *     tags: [RequestTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du type de requête
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestType'
 *     responses:
 *       200:
 *         description: Type mis à jour
 *       404:
 *         description: Type non trouvé
 */
router.put('/:id', authenticate, authorize('admin'), requestTypeController.update);

/**
 * @swagger
 * /request-types/{id}:
 *   delete:
 *     summary: Supprime un type de requête
 *     tags: [RequestTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du type de requête
 *     responses:
 *       200:
 *         description: Type supprimé
 *       404:
 *         description: Type non trouvé
 */
router.delete('/:id', authenticate, authorize('admin'), requestTypeController.remove);

module.exports = router;