const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/', authenticate, authorize('admin', 'department_head'), userController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', authenticate, authorize('admin', 'department_head', 'agent', 'student'), userController.getOne);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur (admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - email
 *               - mot_de_passe
 *               - role
 *             properties:
 *               matricule:
 *                 type: string
 *                 example: U12345
 *               nom:
 *                 type: string
 *                 example: Doe
 *               prenom:
 *                 type: string
 *                 example: John
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               telephone:
 *                 type: string
 *                 example: 699000111
 *               mot_de_passe:
 *                 type: string
 *                 description: Mot de passe en clair (sera hashé côté serveur)
 *                 example: motdepassefort
 *               role:
 *                 type: string
 *                 enum: [admin, agent, enseignant, secretaire, etudiant]
 *                 example: agent
 *               faculte:
 *                 type: string
 *                 example: Sciences
 *               departement:
 *                 type: string
 *                 example: Mathématiques
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 */
router.post('/', authenticate, authorize('admin', 'department_head'), userController.create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:id', authenticate, authorize('admin', 'department_head'), userController.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:id', authenticate, authorize('admin'), userController.remove);

module.exports = router;