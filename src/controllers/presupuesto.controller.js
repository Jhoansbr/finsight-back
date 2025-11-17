import { presupuestoService } from '../services/presupuesto.service.js';
import { successResponse, createPaginationMeta } from '../utils/response.js';

export const presupuestoController = {
  /**
   * Crear nuevo presupuesto
   * POST /api/v1/presupuestos
   */
  async createPresupuesto(req, res, next) {
    try {
      const presupuesto = await presupuestoService.createPresupuesto(req.user.id, req.body);
      res.status(201).json(successResponse(presupuesto));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Listar presupuestos
   * GET /api/v1/presupuestos
   */
  async getPresupuestos(req, res, next) {
    try {
      const filters = req.query;
      const result = await presupuestoService.getPresupuestos(req.user.id, filters);
      
      const meta = createPaginationMeta(result.page, result.limit, result.total);
      
      res.json(successResponse(result.presupuestos, meta));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener presupuesto por ID
   * GET /api/v1/presupuestos/:id
   */
  async getPresupuestoById(req, res, next) {
    try {
      const presupuestoId = parseInt(req.params.id);
      const presupuesto = await presupuestoService.getPresupuestoById(req.user.id, presupuestoId);
      res.json(successResponse(presupuesto));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualizar presupuesto
   * PUT /api/v1/presupuestos/:id
   */
  async updatePresupuesto(req, res, next) {
    try {
      const presupuestoId = parseInt(req.params.id);
      const presupuesto = await presupuestoService.updatePresupuesto(req.user.id, presupuestoId, req.body);
      res.json(successResponse(presupuesto));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Eliminar presupuesto
   * DELETE /api/v1/presupuestos/:id
   */
  async deletePresupuesto(req, res, next) {
    try {
      const presupuestoId = parseInt(req.params.id);
      const result = await presupuestoService.deletePresupuesto(req.user.id, presupuestoId);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Asignar monto a categoría
   * POST /api/v1/presupuestos/:id/categorias
   */
  async assignCategoria(req, res, next) {
    try {
      const presupuestoId = parseInt(req.params.id);
      const categoriaPresupuesto = await presupuestoService.assignCategoria(req.user.id, presupuestoId, req.body);
      res.status(201).json(successResponse(categoriaPresupuesto));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener progreso del presupuesto
   * GET /api/v1/presupuestos/:id/progreso
   */
  async getProgreso(req, res, next) {
    try {
      const presupuestoId = parseInt(req.params.id);
      const progreso = await presupuestoService.getProgreso(req.user.id, presupuestoId);
      res.json(successResponse(progreso));
    } catch (error) {
      next(error);
    }
  },
};

