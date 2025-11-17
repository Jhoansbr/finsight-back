import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Todos los endpoints requieren autenticación
router.use(authenticate);

/**
 * @swagger
 * /dashboard/resumen:
 *   get:
 *     summary: Obtener resumen financiero general
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Resumen financiero
 */
router.get('/resumen', dashboardController.getResumen);

/**
 * @swagger
 * /dashboard/mensual/{mes}/{anio}:
 *   get:
 *     summary: Obtener resumen mensual específico
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: mes
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: path
 *         name: anio
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resumen del mes específico
 */
router.get('/mensual/:mes/:anio', dashboardController.getResumenMensual);

/**
 * @swagger
 * /estadisticas/tendencias:
 *   get:
 *     summary: Obtener tendencias de ingresos/gastos
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Tendencias de los últimos 6 meses
 */
router.get('/estadisticas/tendencias', dashboardController.getTendencias);

/**
 * @swagger
 * /estadisticas/balance-historico:
 *   get:
 *     summary: Obtener balance histórico
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: meses
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Balance histórico
 */
router.get('/estadisticas/balance-historico', dashboardController.getBalanceHistorico);

/**
 * @swagger
 * /estadisticas/gastos-categoria:
 *   get:
 *     summary: Obtener gastos por categoría
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Gastos agrupados por categoría
 */
router.get('/estadisticas/gastos-categoria', dashboardController.getGastosPorCategoria);

export default router;

