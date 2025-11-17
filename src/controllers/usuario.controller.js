import { usuarioService } from '../services/usuario.service.js';
import { successResponse } from '../utils/response.js';

export const usuarioController = {
  /**
   * Actualizar perfil de usuario
   * PUT /api/v1/users/profile
   */
  async updateProfile(req, res, next) {
    try {
      const user = await usuarioService.updateProfile(req.user.id, req.body);
      res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualizar preferencias de usuario
   * PUT /api/v1/users/preferences
   */
  async updatePreferences(req, res, next) {
    try {
      const user = await usuarioService.updatePreferences(req.user.id, req.body);
      res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Cambiar contraseña
   * PUT /api/v1/users/change-password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await usuarioService.changePassword(req.user.id, currentPassword, newPassword);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Desactivar cuenta
   * DELETE /api/v1/users/account
   */
  async deactivateAccount(req, res, next) {
    try {
      const result = await usuarioService.deactivateAccount(req.user.id);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },
};

