import { AppError } from '../utils/errors.js';
import { errorResponse } from '../utils/response.js';
import logger from '../config/logger.js';
import { Prisma } from '@prisma/client';

/**
 * Middleware de manejo de errores centralizado
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Si no es un AppError, convertirlo
  if (!(error instanceof AppError)) {
    // Errores de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error = handlePrismaError(error);
    }
    // Errores de validación de Prisma
    else if (error instanceof Prisma.PrismaClientValidationError) {
      error = new AppError('Error de validación de datos', 400, 'VALIDATION_ERROR');
    }
    // Otros errores
    else {
      error = new AppError(
        error.message || 'Error interno del servidor',
        error.statusCode || 500,
        error.code || 'INTERNAL_ERROR'
      );
    }
  }

  // Log del error
  if (error.statusCode >= 500) {
    logger.error(`${error.code}: ${error.message}`, {
      error: error.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userId: req.user?.id,
    });
  } else {
    logger.warn(`${error.code}: ${error.message}`, {
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
    });
  }

  // Respuesta al cliente
  res.status(error.statusCode).json(
    errorResponse(error.code, error.message, error.details)
  );
};

/**
 * Manejo de errores específicos de Prisma
 */
const handlePrismaError = (error) => {
  switch (error.code) {
    case 'P2002':
      // Violación de constraint único
      const field = error.meta?.target?.[0] || 'campo';
      return new AppError(
        `Ya existe un registro con ese ${field}`,
        409,
        'DUPLICATE_ENTRY',
        { field }
      );

    case 'P2025':
      // Registro no encontrado
      return new AppError(
        'Registro no encontrado',
        404,
        'NOT_FOUND'
      );

    case 'P2003':
      // Violación de foreign key
      return new AppError(
        'Referencia inválida a recurso relacionado',
        400,
        'INVALID_REFERENCE',
        { field: error.meta?.field_name }
      );

    case 'P2014':
      // Violación de relación requerida
      return new AppError(
        'Violación de relación requerida',
        400,
        'REQUIRED_RELATION_VIOLATION'
      );

    default:
      return new AppError(
        'Error de base de datos',
        500,
        'DATABASE_ERROR',
        { code: error.code }
      );
  }
};

/**
 * Middleware para rutas no encontradas
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Ruta no encontrada: ${req.originalUrl}`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

