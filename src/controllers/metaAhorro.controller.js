import { metaAhorroService } from '../services/metaAhorro.service.js';
import { successResponse, createPaginationMeta } from '../utils/response.js';

export const metaAhorroController = {
  /**
   * Crear nueva meta de ahorro
   * POST /api/v1/metas-ahorros
   */
  async createMetaAhorro(req, res, next) {
    try {
      const meta = await metaAhorroService.createMetaAhorro(req.user.id, req.body);
      res.status(201).json(successResponse(meta));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Listar metas de ahorro
   * GET /api/v1/metas-ahorros
   */
  async getMetasAhorro(req, res, next) {
    try {
      const filters = req.query;
      const result = await metaAhorroService.getMetasAhorro(req.user.id, filters);
      
      const meta = createPaginationMeta(result.page, result.limit, result.total);
      
      res.json(successResponse(result.metas, meta));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener meta de ahorro por ID
   * GET /api/v1/metas-ahorros/:id
   */
  async getMetaAhorroById(req, res, next) {
    try {
      const metaId = parseInt(req.params.id);
      const meta = await metaAhorroService.getMetaAhorroById(req.user.id, metaId);
      res.json(successResponse(meta));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualizar meta de ahorro
   * PUT /api/v1/metas-ahorros/:id
   */
  async updateMetaAhorro(req, res, next) {
    try {
      const metaId = parseInt(req.params.id);
      const meta = await metaAhorroService.updateMetaAhorro(req.user.id, metaId, req.body);
      res.json(successResponse(meta));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Eliminar meta de ahorro
   * DELETE /api/v1/metas-ahorros/:id
   */
  async deleteMetaAhorro(req, res, next) {
    try {
      const metaId = parseInt(req.params.id);
      const result = await metaAhorroService.deleteMetaAhorro(req.user.id, metaId);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Agregar movimiento (depósito/retiro)
   * POST /api/v1/metas-ahorros/:id/movimientos
   */
  async addMovimiento(req, res, next) {
    try {
      const metaId = parseInt(req.params.id);
      const movimiento = await metaAhorroService.addMovimiento(req.user.id, metaId, req.body);
      res.status(201).json(successResponse(movimiento));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Listar movimientos de una meta
   * GET /api/v1/metas-ahorros/:id/movimientos
   */
  async getMovimientos(req, res, next) {
    try {
      const metaId = parseInt(req.params.id);
      const filters = req.query;
      const result = await metaAhorroService.getMovimientos(req.user.id, metaId, filters);
      
      const meta = createPaginationMeta(result.page, result.limit, result.total);
      
      res.json(successResponse(result.movimientos, meta));
    } catch (error) {
      next(error);
    }
  },
};

