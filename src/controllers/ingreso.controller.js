import { ingresoService } from '../services/ingreso.service.js';
import { successResponse, createPaginationMeta } from '../utils/response.js';

export const ingresoController = {
  /**
   * Crear nuevo ingreso
   * POST /api/v1/ingresos
   */
  async createIngreso(req, res, next) {
    try {
      const ingreso = await ingresoService.createIngreso(req.user.id, req.body);
      res.status(201).json(successResponse(ingreso));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Listar ingresos
   * GET /api/v1/ingresos
   */
  async getIngresos(req, res, next) {
    try {
      const filters = req.query;
      const result = await ingresoService.getIngresos(req.user.id, filters);
      
      const meta = createPaginationMeta(result.page, result.limit, result.total);
      
      res.json(successResponse(result.ingresos, meta));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener ingreso por ID
   * GET /api/v1/ingresos/:id
   */
  async getIngresoById(req, res, next) {
    try {
      const ingresoId = parseInt(req.params.id);
      const ingreso = await ingresoService.getIngresoById(req.user.id, ingresoId);
      res.json(successResponse(ingreso));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualizar ingreso
   * PUT /api/v1/ingresos/:id
   */
  async updateIngreso(req, res, next) {
    try {
      const ingresoId = parseInt(req.params.id);
      const ingreso = await ingresoService.updateIngreso(req.user.id, ingresoId, req.body);
      res.json(successResponse(ingreso));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Eliminar ingreso
   * DELETE /api/v1/ingresos/:id
   */
  async deleteIngreso(req, res, next) {
    try {
      const ingresoId = parseInt(req.params.id);
      const result = await ingresoService.deleteIngreso(req.user.id, ingresoId);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },
};

