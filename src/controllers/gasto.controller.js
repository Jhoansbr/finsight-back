import { gastoService } from '../services/gasto.service.js';
import { successResponse, createPaginationMeta } from '../utils/response.js';

export const gastoController = {
  /**
   * Crear nuevo gasto
   * POST /api/v1/gastos
   */
  async createGasto(req, res, next) {
    try {
      const gasto = await gastoService.createGasto(req.user.id, req.body);
      res.status(201).json(successResponse(gasto));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Listar gastos
   * GET /api/v1/gastos
   */
  async getGastos(req, res, next) {
    try {
      const filters = req.query;
      const result = await gastoService.getGastos(req.user.id, filters);
      
      const meta = createPaginationMeta(result.page, result.limit, result.total);
      
      res.json(successResponse(result.gastos, meta));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener gasto por ID
   * GET /api/v1/gastos/:id
   */
  async getGastoById(req, res, next) {
    try {
      const gastoId = parseInt(req.params.id);
      const gasto = await gastoService.getGastoById(req.user.id, gastoId);
      res.json(successResponse(gasto));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualizar gasto
   * PUT /api/v1/gastos/:id
   */
  async updateGasto(req, res, next) {
    try {
      const gastoId = parseInt(req.params.id);
      const gasto = await gastoService.updateGasto(req.user.id, gastoId, req.body);
      res.json(successResponse(gasto));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Eliminar gasto
   * DELETE /api/v1/gastos/:id
   */
  async deleteGasto(req, res, next) {
    try {
      const gastoId = parseInt(req.params.id);
      const result = await gastoService.deleteGasto(req.user.id, gastoId);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },
};

