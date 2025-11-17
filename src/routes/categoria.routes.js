import { Router } from 'express';
import { categoriaController } from '../controllers/categoria.controller.js';

const router = Router();

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Listar categorías
 *     tags: [Categorías]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [ingreso, gasto]
 *         description: Filtrar por tipo de categoría
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/', categoriaController.getCategorias);

/**
 * @swagger
 * /tipos-pago:
 *   get:
 *     summary: Listar tipos de pago
 *     tags: [Categorías]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de tipos de pago
 */
router.get('/tipos-pago', categoriaController.getTiposPago);

/**
 * @swagger
 * /frecuencias:
 *   get:
 *     summary: Listar frecuencias
 *     tags: [Categorías]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de frecuencias
 */
router.get('/frecuencias', categoriaController.getFrecuencias);

export default router;

