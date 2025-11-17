import { Router } from 'express';
import { ingresoController } from '../controllers/ingreso.controller.js';
import { createIngresoValidator, updateIngresoValidator, listIngresosValidator } from '../validators/ingreso.validator.js';
import { validate } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Todos los endpoints requieren autenticación
router.use(authenticate);

/**
 * @swagger
 * /ingresos:
 *   post:
 *     summary: Crear nuevo ingreso
 *     tags: [Ingresos]
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
 *         description: Ingreso creado exitosamente
 */
router.post('/', createIngresoValidator, validate, ingresoController.createIngreso);

/**
 * @swagger
 * /ingresos:
 *   get:
 *     summary: Listar ingresos
 *     tags: [Ingresos]
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
 *         description: Lista de ingresos
 */
router.get('/', listIngresosValidator, validate, ingresoController.getIngresos);

/**
 * @swagger
 * /ingresos/{id}:
 *   get:
 *     summary: Obtener ingreso por ID
 *     tags: [Ingresos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del ingreso
 */
router.get('/:id', ingresoController.getIngresoById);

/**
 * @swagger
 * /ingresos/{id}:
 *   put:
 *     summary: Actualizar ingreso
 *     tags: [Ingresos]
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
 *         description: Ingreso actualizado exitosamente
 */
router.put('/:id', updateIngresoValidator, validate, ingresoController.updateIngreso);

/**
 * @swagger
 * /ingresos/{id}:
 *   delete:
 *     summary: Eliminar ingreso
 *     tags: [Ingresos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ingreso eliminado exitosamente
 */
router.delete('/:id', ingresoController.deleteIngreso);

export default router;

