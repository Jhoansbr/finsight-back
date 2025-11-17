import { Router } from 'express';
import { presupuestoController } from '../controllers/presupuesto.controller.js';
import {
  createPresupuestoValidator,
  updatePresupuestoValidator,
  listPresupuestosValidator,
  assignCategoriaValidator,
} from '../validators/presupuesto.validator.js';
import { validate } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Todos los endpoints requieren autenticación
router.use(authenticate);

/**
 * @swagger
 * /presupuestos:
 *   post:
 *     summary: Crear nuevo presupuesto
 *     tags: [Presupuestos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - mes
 *               - anio
 *               - montoTotal
 *     responses:
 *       201:
 *         description: Presupuesto creado exitosamente
 */
router.post('/', createPresupuestoValidator, validate, presupuestoController.createPresupuesto);

/**
 * @swagger
 * /presupuestos:
 *   get:
 *     summary: Listar presupuestos
 *     tags: [Presupuestos]
 *     responses:
 *       200:
 *         description: Lista de presupuestos
 */
router.get('/', listPresupuestosValidator, validate, presupuestoController.getPresupuestos);

/**
 * @swagger
 * /presupuestos/{id}:
 *   get:
 *     summary: Obtener presupuesto por ID
 *     tags: [Presupuestos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del presupuesto
 */
router.get('/:id', presupuestoController.getPresupuestoById);

/**
 * @swagger
 * /presupuestos/{id}:
 *   put:
 *     summary: Actualizar presupuesto
 *     tags: [Presupuestos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Presupuesto actualizado exitosamente
 */
router.put('/:id', updatePresupuestoValidator, validate, presupuestoController.updatePresupuesto);

/**
 * @swagger
 * /presupuestos/{id}:
 *   delete:
 *     summary: Eliminar presupuesto
 *     tags: [Presupuestos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Presupuesto eliminado exitosamente
 */
router.delete('/:id', presupuestoController.deletePresupuesto);

/**
 * @swagger
 * /presupuestos/{id}/categorias:
 *   post:
 *     summary: Asignar monto a categoría
 *     tags: [Presupuestos]
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
 *               - categoriaId
 *               - montoAsignado
 *     responses:
 *       201:
 *         description: Categoría asignada exitosamente
 */
router.post('/:id/categorias', assignCategoriaValidator, validate, presupuestoController.assignCategoria);

/**
 * @swagger
 * /presupuestos/{id}/progreso:
 *   get:
 *     summary: Obtener progreso del presupuesto
 *     tags: [Presupuestos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Progreso del presupuesto
 */
router.get('/:id/progreso', presupuestoController.getProgreso);

export default router;

