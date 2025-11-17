import { verifyAccessToken } from '../config/jwt.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';
import prisma from '../config/database.js';

/**
 * Middleware de autenticación
 * Verifica el token JWT y adjunta el usuario a req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Token no proporcionado');
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar token
    const decoded = verifyAccessToken(token);

    // Buscar usuario en la base de datos
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        activo: true,
        moneda: true,
        zonaHoraria: true,
        idioma: true,
      },
    });

    if (!user) {
      throw new AuthenticationError('Usuario no encontrado');
    }

    if (!user.activo) {
      throw new AuthorizationError('Cuenta de usuario inactiva');
    }

    // Adjuntar usuario a la petición
    req.user = user;
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware opcional de autenticación
 * No falla si no hay token, pero lo verifica si existe
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);

      const user = await prisma.usuario.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          nombre: true,
          apellido: true,
          activo: true,
        },
      });

      if (user && user.activo) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Si hay error en el token opcional, simplemente continuar sin usuario
    next();
  }
};

