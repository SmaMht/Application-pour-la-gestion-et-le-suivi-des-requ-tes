const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Génération de rapports statistiques
 */

/**
 * @swagger
 * /reports/excel:
 *   get:
 *     summary: Génère un rapport Excel des requêtes
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rapport Excel généré
 */
router.get(
  '/excel',
  authenticate,
  authorize('admin', 'department_head'),
  reportController.exportExcel
);

/**
 * @swagger
 * /reports/pdf:
 *   get:
 *     summary: Génère un rapport PDF des requêtes
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rapport PDF généré
 */
router.get(
  '/pdf',
  authenticate,
  authorize('admin', 'department_head'),
  reportController.exportPDF
);

module.exports = router;