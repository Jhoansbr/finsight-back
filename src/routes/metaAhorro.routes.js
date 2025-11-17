import { Router } from 'express';
import { metaAhorroController } from '../controllers/metaAhorro.controller.js';
import {
  createMetaAhorroValidator,
  updateMetaAhorroValidator,
  listMetasAhorroValidator,
  createMovimientoValidator,
} from '../validators/metaAhorro.validator.js';
import { validate } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Todos los endpoints requieren autenticación
router.use(authenticate);

/**
 * @swagger
 * /metas-ahorros:
 *   post:
 *     summary: Crear nueva meta de ahorro
 *     tags: [Metas de Ahorro]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - montoObjetivo
 *               - fechaInicio
 *     responses:
 *       201:
 *         description: Meta de ahorro creada exitosamente
 */
router.post('/', createMetaAhorroValidator, validate, metaAhorroController.createMetaAhorro);

/**
 * @swagger
 * /metas-ahorros:
 *   get:
 *     summary: Listar metas de ahorro
 *     tags: [Metas de Ahorro]
 *     responses:
 *       200:
 *         description: Lista de metas de ahorro
 */
router.get('/', listMetasAhorroValidator, validate, metaAhorroController.getMetasAhorro);

/**
 * @swagger
 * /metas-ahorros/{id}:
 *   get:
 *     summary: Obtener meta de ahorro por ID
 *     tags: [Metas de Ahorro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la meta de ahorro
 */
router.get('/:id', metaAhorroController.getMetaAhorroById);

/**
 * @swagger
 * /metas-ahorros/{id}:
 *   put:
 *     summary: Actualizar meta de ahorro
 *     tags: [Metas de Ahorro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Meta de ahorro actualizada exitosamente
 */
router.put('/:id', updateMetaAhorroValidator, validate, metaAhorroController.updateMetaAhorro);

/**
 * @swagger
 * /metas-ahorros/{id}:
 *   delete:
 *     summary: Eliminar meta de ahorro
 *     tags: [Metas de Ahorro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Meta de ahorro eliminada exitosamente
 */
router.delete('/:id', metaAhorroController.deleteMetaAhorro);

/**
 * @swagger
 * /metas-ahorros/{id}/movimientos:
 *   post:
 *     summary: Agregar movimiento a meta de ahorro
 *     tags: [Metas de Ahorro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipoMovimiento
 *               - monto
 *             properties:
 *               tipoMovimiento:
 *                 type: string
 *                 enum: [deposito, retiro]
 *               monto:
 *                 type: number
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Movimiento agregado exitosamente
 */
router.post('/:id/movimientos', createMovimientoValidator, validate, metaAhorroController.addMovimiento);

/**
 * @swagger
 * /metas-ahorros/{id}/movimientos:
 *   get:
 *     summary: Listar movimientos de una meta de ahorro
 *     tags: [Metas de Ahorro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de movimientos
 */
router.get('/:id/movimientos', metaAhorroController.getMovimientos);

export default router;

