import { recordatorioService } from '../services/recordatorio.service.js';
import { successResponse, createPaginationMeta } from '../utils/response.js';

export const recordatorioController = {
  /**
   * Crear nuevo recordatorio
   * POST /api/v1/recordatorios
   */
  async createRecordatorio(req, res, next) {
    try {
      const recordatorio = await recordatorioService.createRecordatorio(req.user.id, req.body);
      res.status(201).json(successResponse(recordatorio));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Listar recordatorios
   * GET /api/v1/recordatorios
   */
  async getRecordatorios(req, res, next) {
    try {
      const filters = req.query;
      const result = await recordatorioService.getRecordatorios(req.user.id, filters);
      
      const meta = createPaginationMeta(result.page, result.limit, result.total);
      
      res.json(successResponse(result.recordatorios, meta));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener recordatorio por ID
   * GET /api/v1/recordatorios/:id
   */
  async getRecordatorioById(req, res, next) {
    try {
      const recordatorioId = parseInt(req.params.id);
      const recordatorio = await recordatorioService.getRecordatorioById(req.user.id, recordatorioId);
      res.json(successResponse(recordatorio));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualizar recordatorio
   * PUT /api/v1/recordatorios/:id
   */
  async updateRecordatorio(req, res, next) {
    try {
      const recordatorioId = parseInt(req.params.id);
      const recordatorio = await recordatorioService.updateRecordatorio(req.user.id, recordatorioId, req.body);
      res.json(successResponse(recordatorio));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Marcar recordatorio como completado
   * PATCH /api/v1/recordatorios/:id/completar
   */
  async markAsCompleted(req, res, next) {
    try {
      const recordatorioId = parseInt(req.params.id);
      const recordatorio = await recordatorioService.markAsCompleted(req.user.id, recordatorioId);
      res.json(successResponse(recordatorio));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Eliminar recordatorio
   * DELETE /api/v1/recordatorios/:id
   */
  async deleteRecordatorio(req, res, next) {
    try {
      const recordatorioId = parseInt(req.params.id);
      const result = await recordatorioService.deleteRecordatorio(req.user.id, recordatorioId);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener recordatorios próximos
   * GET /api/v1/recordatorios/proximos
   */
  async getUpcoming(req, res, next) {
    try {
      const recordatorios = await recordatorioService.getUpcomingRecordatorios(req.user.id);
      res.json(successResponse(recordatorios));
    } catch (error) {
      next(error);
    }
  },
};

