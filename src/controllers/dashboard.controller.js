import { dashboardService } from '../services/dashboard.service.js';
import { successResponse } from '../utils/response.js';

export const dashboardController = {
  /**
   * Obtener resumen financiero general
   * GET /api/v1/dashboard/resumen
   */
  async getResumen(req, res, next) {
    try {
      const resumen = await dashboardService.getResumen(req.user.id);
      res.json(successResponse(resumen));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener resumen mensual específico
   * GET /api/v1/dashboard/mensual/:mes/:anio
   */
  async getResumenMensual(req, res, next) {
    try {
      const mes = parseInt(req.params.mes);
      const anio = parseInt(req.params.anio);
      const resumen = await dashboardService.getResumenMensual(req.user.id, mes, anio);
      res.json(successResponse(resumen));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener tendencias
   * GET /api/v1/estadisticas/tendencias
   */
  async getTendencias(req, res, next) {
    try {
      const tendencias = await dashboardService.getTendencias(req.user.id);
      res.json(successResponse(tendencias));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener balance histórico
   * GET /api/v1/estadisticas/balance-historico
   */
  async getBalanceHistorico(req, res, next) {
    try {
      const meses = req.query.meses ? parseInt(req.query.meses) : 12;
      const historico = await dashboardService.getBalanceHistorico(req.user.id, meses);
      res.json(successResponse(historico));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener gastos por categoría
   * GET /api/v1/estadisticas/gastos-categoria
   */
  async getGastosPorCategoria(req, res, next) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      const estadisticas = await dashboardService.getGastosPorCategoria(req.user.id, fechaInicio, fechaFin);
      res.json(successResponse(estadisticas));
    } catch (error) {
      next(error);
    }
  },
};

