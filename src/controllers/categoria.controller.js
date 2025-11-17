import { categoriaService } from '../services/categoria.service.js';
import { successResponse } from '../utils/response.js';

export const categoriaController = {
  /**
   * Listar categorías
   * GET /api/v1/categorias
   */
  async getCategorias(req, res, next) {
    try {
      const { tipo } = req.query;
      const categorias = await categoriaService.getAllCategorias(tipo);
      res.json(successResponse(categorias));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Listar tipos de pago
   * GET /api/v1/tipos-pago
   */
  async getTiposPago(req, res, next) {
    try {
      const tiposPago = await categoriaService.getAllTiposPago();
      res.json(successResponse(tiposPago));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Listar frecuencias
   * GET /api/v1/frecuencias
   */
  async getFrecuencias(req, res, next) {
    try {
      const frecuencias = await categoriaService.getAllFrecuencias();
      res.json(successResponse(frecuencias));
    } catch (error) {
      next(error);
    }
  },
};

