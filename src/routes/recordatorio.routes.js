import { Router } from 'express';
import { recordatorioController } from '../controllers/recordatorio.controller.js';
import {
  createRecordatorioValidator,
  updateRecordatorioValidator,
  listRecordatoriosValidator,
} from '../validators/recordatorio.validator.js';
import { validate } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Todos los endpoints requieren autenticación
router.use(authenticate);

/**
 * @swagger
 * /recordatorios:
 *   post:
 *     summary: Crear nuevo recordatorio
 *     tags: [Recordatorios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - fecha
 *               - tipo
 *     responses:
 *       201:
 *         description: Recordatorio creado exitosamente
 */
router.post('/', createRecordatorioValidator, validate, recordatorioController.createRecordatorio);

/**
 * @swagger
 * /recordatorios:
 *   get:
 *     summary: Listar recordatorios
 *     tags: [Recordatorios]
 *     responses:
 *       200:
 *         description: Lista de recordatorios
 */
router.get('/', listRecordatoriosValidator, validate, recordatorioController.getRecordatorios);

/**
 * @swagger
 * /recordatorios/proximos:
 *   get:
 *     summary: Obtener recordatorios próximos
 *     tags: [Recordatorios]
 *     responses:
 *       200:
 *         description: Lista de recordatorios próximos
 */
router.get('/proximos', recordatorioController.getUpcoming);

/**
 * @swagger
 * /recordatorios/{id}:
 *   get:
 *     summary: Obtener recordatorio por ID
 *     tags: [Recordatorios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del recordatorio
 */
router.get('/:id', recordatorioController.getRecordatorioById);

/**
 * @swagger
 * /recordatorios/{id}:
 *   put:
 *     summary: Actualizar recordatorio
 *     tags: [Recordatorios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recordatorio actualizado exitosamente
 */
router.put('/:id', updateRecordatorioValidator, validate, recordatorioController.updateRecordatorio);

/**
 * @swagger
 * /recordatorios/{id}/completar:
 *   patch:
 *     summary: Marcar recordatorio como completado
 *     tags: [Recordatorios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recordatorio marcado como completado
 */
router.patch('/:id/completar', recordatorioController.markAsCompleted);

/**
 * @swagger
 * /recordatorios/{id}:
 *   delete:
 *     summary: Eliminar recordatorio
 *     tags: [Recordatorios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recordatorio eliminado exitosamente
 */
router.delete('/:id', recordatorioController.deleteRecordatorio);

export default router;

