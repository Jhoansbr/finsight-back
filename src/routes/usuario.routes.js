import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller.js';
import { updateProfileValidator, updatePreferencesValidator, changePasswordValidator } from '../validators/usuario.validator.js';
import { validate } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Todos los endpoints requieren autenticación
router.use(authenticate);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Actualizar perfil de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apodo:
 *                 type: string
 *               fotoPerfil:
 *                 type: string
 *               telegram:
 *                 type: string
 *               whatsapp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 */
router.put('/profile', updateProfileValidator, validate, usuarioController.updateProfile);

/**
 * @swagger
 * /users/preferences:
 *   put:
 *     summary: Actualizar preferencias de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moneda:
 *                 type: string
 *               pais:
 *                 type: string
 *               zonaHoraria:
 *                 type: string
 *               idioma:
 *                 type: string
 *               notificacionesEmail:
 *                 type: boolean
 *               notificacionesPush:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferencias actualizadas exitosamente
 */
router.put('/preferences', updatePreferencesValidator, validate, usuarioController.updatePreferences);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Cambiar contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 */
router.put('/change-password', changePasswordValidator, validate, usuarioController.changePassword);

/**
 * @swagger
 * /users/account:
 *   delete:
 *     summary: Desactivar cuenta
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Cuenta desactivada exitosamente
 */
router.delete('/account', usuarioController.deactivateAccount);

export default router;

