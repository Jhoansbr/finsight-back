import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { NotFoundError, AuthenticationError } from '../utils/errors.js';

export const usuarioService = {
  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId, profileData) {
    const user = await prisma.usuario.update({
      where: { id: userId },
      data: {
        nombre: profileData.nombre,
        apellido: profileData.apellido,
        fechaNacimiento: profileData.fechaNacimiento,
        telefono: profileData.telefono,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        fechaNacimiento: true,
        telefono: true,
        moneda: true,
        zonaHoraria: true,
        idioma: true,
        updatedAt: true,
      },
    });

    return user;
  },

  /**
   * Actualizar preferencias de usuario
   */
  async updatePreferences(userId, preferencesData) {
    const user = await prisma.usuario.update({
      where: { id: userId },
      data: {
        moneda: preferencesData.moneda,
        zonaHoraria: preferencesData.zonaHoraria,
        idioma: preferencesData.idioma,
        notificacionesEmail: preferencesData.notificacionesEmail,
        notificacionesPush: preferencesData.notificacionesPush,
      },
      select: {
        id: true,
        moneda: true,
        zonaHoraria: true,
        idioma: true,
        notificacionesEmail: true,
        notificacionesPush: true,
        updatedAt: true,
      },
    });

    return user;
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(userId, currentPassword, newPassword) {
    // Obtener usuario con password
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('Usuario');
    }

    // Verificar contraseña actual
    const isPasswordValid = await comparePassword(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new AuthenticationError('Contraseña actual incorrecta');
    }

    // Hash de la nueva contraseña
    const passwordHash = await hashPassword(newPassword);

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  },

  /**
   * Desactivar cuenta
   */
  async deactivateAccount(userId) {
    await prisma.usuario.update({
      where: { id: userId },
      data: { activo: false },
    });

    return { message: 'Cuenta desactivada exitosamente' };
  },
};

