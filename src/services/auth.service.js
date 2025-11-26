import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateTokens, verifyRefreshToken } from '../config/jwt.js';
import { ConflictError, AuthenticationError, NotFoundError } from '../utils/errors.js';
import { emailService } from './email.service.js';
import jwt from 'jsonwebtoken';

export const authService = {
  /**
   * Registrar nuevo usuario
   */
  async register(userData) {
    // Verificar si el email ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictError('El email ya está registrado');
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(userData.password);

    // Crear usuario y preferencias en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear usuario
      const user = await tx.usuario.create({
        data: {
          email: userData.email,
          passwordHash,
          nombre: userData.nombre,
          apodo: userData.apodo || null,
          telegram: userData.telegram || null,
          whatsapp: userData.whatsapp || null,
        },
        select: {
          id: true,
          email: true,
          nombre: true,
          apodo: true,
          telegram: true,
          whatsapp: true,
          fotoPerfil: true,
          fechaRegistro: true,
          createdAt: true,
        },
      });

      // Crear preferencias por defecto
      await tx.preferenciaUsuario.create({
        data: {
          usuarioId: user.id,
          moneda: 'COP',
          pais: 'Colombia',
          zonaHoraria: 'America/Bogota',
          idioma: 'es',
          notificacionesEmail: true,
          notificacionesPush: true,
        },
      });

      return user;
    });

    // Generar tokens
    const tokens = generateTokens(result);

    return {
      user: result,
      ...tokens,
    };
  },

  /**
   * Iniciar sesión
   */
  async login(email, password) {
    // Buscar usuario
    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AuthenticationError('Credenciales inválidas');
    }

    // Verificar si está activo
    if (!user.activo) {
      throw new AuthenticationError('Cuenta inactiva');
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AuthenticationError('Credenciales inválidas');
    }

    // Generar tokens
    const tokens = generateTokens(user);

    // Retornar usuario sin passwordHash
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  },

  /**
   * Refrescar token
   */
  async refreshToken(refreshToken) {
    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Buscar usuario
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.id },
    });

    if (!user || !user.activo) {
      throw new AuthenticationError('Usuario no válido');
    }

    // Generar nuevos tokens
    const tokens = generateTokens(user);

    return tokens;
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(userId) {
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apodo: true,
        telegram: true,
        whatsapp: true,
        fotoPerfil: true,
        fechaRegistro: true,
        fechaUltimaSesion: true,
        createdAt: true,
        updatedAt: true,
        preferencia: {
          select: {
            moneda: true,
            pais: true,
            zonaHoraria: true,
            idioma: true,
            notificacionesEmail: true,
            notificacionesPush: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('Usuario');
    }

    return user;
  },

  /**
   * Solicitar recuperación de contraseña
   */
  async forgotPassword(email) {
    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      // Por seguridad, no decimos si el usuario existe o no
      return;
    }

    // Generar token de recuperación (validez 1 hora)
    // Usamos la misma función de JWT pero con un secret diferente o payload específico
    const resetToken = jwt.sign(
      { id: user.id, type: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Enviar correo
    await emailService.sendPasswordResetEmail(email, resetToken);
  },

  /**
   * Restablecer contraseña
   */
  async resetPassword(token, newPassword) {
    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type !== 'reset') {
        throw new AuthenticationError('Token inválido');
      }

      // Hash nueva contraseña
      const passwordHash = await hashPassword(newPassword);

      // Actualizar usuario
      await prisma.usuario.update({
        where: { id: decoded.id },
        data: { passwordHash },
      });

      return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      throw new AuthenticationError('Token inválido o expirado');
    }
  },
};

