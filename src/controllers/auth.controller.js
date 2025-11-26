import { authService } from '../services/auth.service.js';
import { successResponse } from '../utils/response.js';

export const authController = {
  /**
   * Registrar nuevo usuario
   * POST /api/v1/auth/register
   */
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Iniciar sesión
   * POST /api/v1/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Refrescar token
   * POST /api/v1/auth/refresh-token
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener perfil del usuario autenticado
   * GET /api/v1/auth/me
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Cerrar sesión
   * POST /api/v1/auth/logout
   */
  async logout(req, res, next) {
    try {
      // En una implementación completa, aquí se invalidaría el token en una lista negra
      // Por ahora, solo retornamos éxito (el cliente debe eliminar el token)
      res.json(successResponse({ message: 'Sesión cerrada exitosamente' }));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Solicitar recuperación de contraseña
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);
      // Siempre respondemos éxito por seguridad
      res.json(successResponse({ message: 'Si el correo existe, recibirás instrucciones para recuperar tu contraseña' }));
    } catch (error) {
      next(error);
    }
  },

  /**
   * Restablecer contraseña
   * POST /api/v1/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword(token, newPassword);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  },
};
