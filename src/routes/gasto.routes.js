import { Router } from 'express';
import { gastoController } from '../controllers/gasto.controller.js';
import { createGastoValidator, updateGastoValidator, listGastosValidator } from '../validators/gasto.validator.js';
import { validate } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Todos los endpoints requieren autenticación
router.use(authenticate);

/**
 * @swagger
 * /gastos:
 *   post:
 *     summary: Crear nuevo gasto
 *     tags: [Gastos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoriaId
 *               - monto
 *               - fecha
 *             properties:
 *               categoriaId:
 *                 type: integer
 *               monto:
 *                 type: number
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *               tipoPagoId:
 *                 type: integer
 *               esRecurrente:
 *                 type: boolean
 *               frecuenciaId:
 *                 type: integer
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *               fechaFin:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Gasto creado exitosamente
 */
router.post('/', createGastoValidator, validate, gastoController.createGasto);

/**
 * @swagger
 * /gastos:
 *   get:
 *     summary: Listar gastos
 *     tags: [Gastos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: categoriaId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: esRecurrente
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de gastos
 */
router.get('/', listGastosValidator, validate, gastoController.getGastos);

/**
 * @swagger
 * /gastos/{id}:
 *   get:
 *     summary: Obtener gasto por ID
 *     tags: [Gastos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del gasto
 */
router.get('/:id', gastoController.getGastoById);

/**
 * @swagger
 * /gastos/{id}:
 *   put:
 *     summary: Actualizar gasto
 *     tags: [Gastos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Gasto actualizado exitosamente
 */
router.put('/:id', updateGastoValidator, validate, gastoController.updateGasto);

/**
 * @swagger
 * /gastos/{id}:
 *   delete:
 *     summary: Eliminar gasto
 *     tags: [Gastos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gasto eliminado exitosamente
 */
router.delete('/:id', gastoController.deleteGasto);

export default router;

